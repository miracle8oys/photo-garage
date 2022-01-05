import { addDoc, collection, getDocs, orderBy, query, where, Timestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

const Comments = ({user, setMsg}) => {
    const {post_id} = useParams();
    const [comments, setComments] = useState([]);
    const [userComment, setUserComment] = useState('');
    const [changes, setChanges] = useState(0);
    const addCmnRef = collection(db, "comments");
    
    useEffect(() => {
        const cmnRef = query(collection(db, "comments"), where("post_id", "==", `${post_id}`), orderBy("createdAt"));
        getDocs(cmnRef)
            .then(snapshot => {
                setComments(snapshot.docs.map(cmn => (
                    {
                        ...cmn.data(),
                        id: cmn.id
                    }
                )));
            }) 
    }, [changes, post_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            setMsg("This feature allowed if you are logged in");
            return false
        }
        const currentTime = Timestamp.now();
        addDoc(addCmnRef, {
            createdAt: currentTime,
            msg: userComment,
            post_id,
            uid: user.uid,
            profile_pic: user.photoURL,
            username: user.displayName
        }).then(() => {
            setChanges(current => current + 1);
            setUserComment('');
        })
    }


    return ( 
        <div className="my-3 min-h-[83vh] md:min-h-[75vh]">
            <div className="grid">
                {comments.map(cmn => (
                    <div key={cmn.id} className="inline-flex gap-2 mb-2">
                        <img src={`${cmn.profile_pic}`} className="rounded-full w-12 h-12" alt="commen-profile" referrerPolicy="no-referrer" />
                        <div>
                            <p className="font-bold text-xl">@{cmn.username} <span className="font-medium">{cmn.msg}</span> </p>
                            <p className="">{cmn.createdAt.toDate().toDateString('ID')}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center justify-center md:w-screen gap-3 mt-3 fixed bottom-0 mb-3">
                    <textarea value={userComment} onChange={(e) => setUserComment(e.target.value)} className="border-2 w-[80vw] md:w-96 h-16"></textarea>
                    <button className="py-3 bg-blue-500 w-14 h-16 rounded-md"><i className="far fa-paper-plane text-2xl"></i></button>
            </form>
        </div>
     );
}
 
export default Comments;