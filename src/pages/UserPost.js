import { collection, getDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";
import Footer from "./Footer";
import ScrollViewDetail from "./ScrollViewDetail";

const UserPost = ({user}) => {

    const {post_uid} = useParams();
    const [postUser, setPostUser] = useState({});
    const [posts, setPosts] = useState([]);

    const [display, setDisplay] = useState([]);
    const [displayUsername, setDisplayUsername] = useState('');
    const [displayCaption, setDisplayCaption] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const userRef = doc(db, "users", `${post_uid}`);
        getDoc(userRef)
            .then(snapshot => {
                setPostUser(snapshot.data())
            });
    }, [post_uid]);

    useEffect(() => {
        const userPostRef = query(collection(db, "posts"), where("uid", "==", `${post_uid}`), orderBy("createdAt", "desc"));
        getDocs(userPostRef)
            .then(snapshot => {
                setPosts(snapshot.docs.map(post => (
                    {
                        ...post.data(),
                        id: post.id
                    }
                )));
            })
    }, [post_uid]);

    const handlePopUpDisplay = (photo, username, caption) => {
        setDisplay(photo);
        setDisplayUsername(username);
        setDisplayCaption(caption);
        setIsOpen(true);
    }

    const MODAL_STYLES = {
        position: 'fixed',
        height: '100vh',
        width: '100vw',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFF',
        padding: '2rem',
        overflow: 'auto',
        zIndex: 1000
      }


    return ( 
        <>
            <div className="flex justify-center">
                <div className="min-h-[83vh] md:min-h-[80vh] md:w-3/5">
                    {isOpen && 
                        <div className="mt-16 md:mt-0 py-20 grid justify-center" style={MODAL_STYLES}>
                            <div className="pt-20 md:pt-0">
                                <ScrollViewDetail photo={display} />
                            </div>
                            <div className="sm:flex sm:justify-center">
                                <p className="w-fit"><span className="font-bold">@{displayUsername}</span> {displayCaption}</p>
                            </div>
                            <div className="flex justify-center">
                                <i onClick={() => setIsOpen(false)} className="far fa-times-circle text-3xl"></i>
                            </div>
                        </div>
                    }
                    <div className="flex items-center gap-10 mx-3">
                        <img className="rounded-full w-10" src={postUser.profile_pic} alt="profile-preview" />
                        <div>
                            <p className="text-lg font-bold italic">@{postUser.username}</p>
                            <p className="font-medium text-lg">{posts.length} Post</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-3">
                        {posts.map(post => (
                            <div className="col-span-1" key={post.id} onClick={() => handlePopUpDisplay(post.photo, postUser.username, post.caption)}>
                                <img className="h-[8rem] w-[8rem] md:h-60 md:w-60 object-cover" src={post.photo[0]} alt="detail-preview" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer user={user} />
        </>
     );
}
 
export default UserPost;