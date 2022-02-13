import { useEffect, useState } from "react";
import { useRef } from "react";

const ScrollViewDetail = ({photo}) => {
    const [imageCount, setImageCount] = useState(0);
    const leftArrow = useRef();
    const rightArrow = useRef();
    const [firstTouch, setFirstTouch] = useState(0);
    const [lastTouch, setLastTouch] = useState(0);

    const handleClick = () => {
        if (imageCount === photo.length - 1) {
            setImageCount(0);
        } else {
            setImageCount(current => current + 1)
        }
        setFirstTouch(0);
        setLastTouch(0);
    }

    const handleLeftClick = () => {
        if (imageCount === 0) {
            setImageCount(photo.length - 1);
        } else {
            setImageCount(current => current -1);
        }
        setFirstTouch(0);
        setLastTouch(0);
    }

    useEffect(() => {
        if (photo.length === 1) {
            leftArrow.current.className = "hidden";
            rightArrow.current.className = "hidden";
        }
    }, [photo.length]);



    function handleTouch () {
        if (lastTouch) {
            touchSwitch();
        }
        
    }

    function touchSwitch() {
        if (firstTouch - lastTouch > 100) {
            handleClick();
        } else if (firstTouch - lastTouch < - 100) {
            handleLeftClick();
        }
    }

    return (
        <>
            <div className="flex justify-center">
                <img onTouchEnd={e => handleTouch(e)} onTouchMove={(e) => setLastTouch(e.touches[0].clientX)} onTouchStart={(e) => setFirstTouch(e.touches[0].clientX)}  className=" md:w-[42vw] md:max-h-[90vh] block" src={`${photo[imageCount]}`} alt="content-display" />
                <i ref={leftArrow} onClick={(handleLeftClick)} className="invisible md:visible fas fa-angle-double-left text-slate-100 md:text-3xl opacity-50 hover:opacity-100 my-32 absolute left-[30%] py-10"></i>
                <i ref={rightArrow} onClick={(handleClick)} className="invisible md:visible fas fa-angle-double-right text-slate-100 md:text-3xl opacity-50 hover:opacity-100 my-32 absolute right-[30%] py-10"></i>
            </ div>
            {photo.length > 1 &&
                <div className="flex justify-center gap-1 my-1">
                    {photo.map((ph, i) => (

                        <i key={ph} className={`fas fa-circle ${imageCount === i ? 'text-blue-700' : ''}`}></i>

                    ))}
                </div>
            }
        </>
     );
}
 
export default ScrollViewDetail;