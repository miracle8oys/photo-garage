import { collection, getDoc, doc, getDocs, query, where, orderBy } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";
import { db } from "../config/firebase";
import ScrollView from "./ScrollView";

const UserPost = () => {

    const {post_uid} = useParams();
    const userRef = doc(db, "users", `${post_uid}`);
    const userPostRef = query(collection(db, "posts"), where("uid", "==", `${post_uid}`), orderBy("createdAt", "desc"));
    const [postUser, setPostUser] = useState({});
    const [posts, setPosts] = useState([]);

    const [display, setDisplay] = useState([]);
    const [displayUsername, setDisplayUsername] = useState('');
    const [displayCaption, setDisplayCaption] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getDoc(userRef)
            .then(snapshot => {
                setPostUser(snapshot.data())
            });
    }, [post_uid]);

    useEffect(() => {
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
        padding: '0.5rem',
        zIndex: 1000
      }

    return ( 
        <div className="min-h-[85vh] md:min-h-[80vh]">
            {isOpen && 
                <div className="mt-16 md:mt-0" style={MODAL_STYLES}>
                    <ScrollView photo={display} />
                    <div className="sm:flex sm:justify-center w-screen">

                        <p className="w-fit"><span className="font-bold">@{displayUsername}</span> {displayCaption}</p>
                    </div>
                    <div className="flex w-screen justify-center">
                        <i onClick={() => setIsOpen(false)} className="far fa-times-circle text-3xl"></i>
                    </div>
                </div>
            }
            <div className="flex items-center gap-10 mx-3">
                <img className="rounded-full w-12" src={postUser.profile_pic} alt="photo-profile" />
                <div>
                    <p className="text-xl font-bold italic">@{postUser.username}</p>
                    <p className="font-medium text-xl">{posts.length} Post</p>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-3">
                {posts.map(post => (
                    <div key={post.id} onClick={() => handlePopUpDisplay(post.photo, postUser.username, post.caption)}>
                        <img className="w-fit h-fit" src={post.photo[0]} alt="image-detail-preview" />
                    </div>
                ))}
            </div>
        </div>
     );
}
 
export default UserPost;