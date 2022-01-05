import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Footer from "./Footer";
const Activity = ({user}) => {

    const [activity, setActivity] = useState([]);
    
    useEffect(() => {
        const likeRef = query(collection(db, "likes"), where("post_uid", "==", `${user?.uid}`));
        getDocs(likeRef)
            .then(snapshot => {
                setActivity(snapshot.docs.map(doc => (
                    {
                        ...doc.data()
                    }
                )))
            })
    }, [user]);

    return (
        <>
            <div className="min-h-[85vh] md:flex md:justify-center ">
                <div className="grid my-12 md:w-[50vw]">
                    {activity.map((act, i) => (
                        <div key={i} className="flex justify-between items-center text-lg mb-2">
                            <h1>@<p className="inline font-semibold">{act.username}</p> like your post</h1>
                            <img className="w-20" src={act.photo} alt="preview-profile" />
                        </div>
                    ))}
                </div>
            </div> 
            <Footer user={user} />
        </>
     );
}
 
export default Activity;