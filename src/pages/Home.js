import { db } from "../config/firebase";
import {collection, getDocs, query, where, orderBy, updateDoc, doc, addDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollView from "./ScrollView";
const Home = ({user, setMsg}) => {

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState([]);
    const [changes, setChanges] = useState(0);
    const postsRef = query(collection(db, 'posts'), orderBy("createdAt", "desc"));
    const likeRef = query(collection(db, 'likes'), where("uid", "==", `${user?.uid}`));

    useEffect(() => {
        getDocs(postsRef)
            .then(snapshot => {
                setPosts(snapshot.docs.map(doc => (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )))
            });
    }, [changes]);
    useEffect(() => {
        getDocs(likeRef)
            .then(snapshot => {
                setLikes(snapshot.docs.map(likePost =>(
                    {
                        post_id: likePost.data().post_id
                    }
                )))
            })
    }, [user, changes])


    const handleLike = (post_id, like, photo, post_uid) => {
        if (!user) {
            setMsg("You need login to unlock this feature");
            return false
        }
        const likePostRef = doc(db, "posts", `${post_id}`);
        const addDocRef = collection(db, "likes");

        addDoc(addDocRef, {
            post_id,
            uid: user.uid,
            username: user.displayName,
            photo,
            post_uid
        }).then(() => {
            updateDoc(likePostRef, {
                like: like + 1
            }).then(() => {
                setChanges(current => current + 1);
            });
        });
    }

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setMsg("Copied!")
        setTimeout(() => {
            setMsg('');
        }, 1000);
    }
    return ( 
        <>
            {posts.map(post => (
                <div key={post.id} className="mb-3">
                    <Link to={`/${post.uid}`} className="flex items-center mt-1 mb-1 gap-2 md:mt-3 md:mx-5">
                        <img className="w-10 rounded-full" src={post.profile_pic} alt="user-profile" referrerPolicy="no-referrer" />
                        <h5 className="font-semibold text-2xl italic">@{post.username}</h5>
                    </Link>
                    <div>
                        <ScrollView photo={post.photo} />
                    </div>
                    <div className="flex gap-3 md:mt-3 md:mx-5">
                        {likes.some(e => e.post_id === post.id) ? <i className="fas fa-heart text-4xl text-red-700"></i> : <i onClick={() => handleLike(post.id, post.like, post.photo[0], post.uid)} className="far fa-heart text-4xl"></i>}
                        <Link to={`/comments/${post.id}`}>
                            <i className="far fa-comment text-4xl"></i>
                        </Link>
                        <i onClick={() => handleCopy(post.uid)} className="far fa-paper-plane text-4xl"></i>
                    </div>
                        <p className="text-xl ml-3 font-semibold md:mt-3 md:mx-5">{post.like} likes</p>
                    <div className="md:mt-3 md:mx-5">
                        <p className="font-bold">{post.username} <span className="font-medium">{post.caption}</span> </p>
                        {/* <h1>{post.caption}</h1> */}
                    </div>
                </div>
            ))}
        </>
     );
}
 
export default Home;