import { useEffect, useState } from "react/cjs/react.development";
import { useRef } from "react";

const ScrollView = ({photo}) => {
    const [imageCount, setImageCount] = useState(0);
    const leftArrow = useRef();
    const rightArrow = useRef();

    const handleClick = () => {
        if (imageCount === photo.length - 1) {
            setImageCount(0);
        } else {
            setImageCount(current => current + 1)
        }
    }

    const handleLeftClick = () => {
        if (imageCount === 0) {
            setImageCount(photo.length - 1);
        } else {
            setImageCount(current => current -1);
        }
    }

    useEffect(() => {
        if (photo.length === 1) {
            leftArrow.current.className = "hidden";
            rightArrow.current.className = "hidden";
        }
    }, []);

    return (
        <div className="flex justify-center">
            <div className="flex justify-center">
            <img className="w-96 md:w-3/6 block" src={`${photo[imageCount]}`} alt="image-content" />
            <i ref={leftArrow} onClick={(handleLeftClick)} className="fas fa-angle-double-left text-slate-100 text-3xl md:text-5xl my-32 absolute left-[10%] md:left-[30%]"></i>
            <i ref={rightArrow} onClick={(handleClick)} className="fas fa-angle-double-right text-slate-100 text-3xl md:text-5xl my-32 absolute right-[10%] md:right-[30%]"></i>
            </ div>
        </div>
     );
}
 
export default ScrollView;