import { addDoc, collection, doc, query, updateDoc, Timestamp, where, orderBy, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase";
import "../App.css";

const MessageRoom = ({user}) => {

    const {message_id} = useParams();
    const [msg, setMsg] = useState('');
    const msgRef = doc(db, "messages", message_id);
    const msgDetailRef = collection(db, "messages_detail");
    const getMsgDetail = query(collection(db, "messages_detail"), where("message_id", "==", `${message_id}`), orderBy("createdAt"));
    const [msgData, setMsgData] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentTime = Timestamp.now();
        addDoc(msgDetailRef, {
            message_id,
            uid: user.uid,
            username: user.displayName,
            profile_pic: user.photoURL,
            msg_content: msg,
            createdAt: currentTime
        }).then(() => {
            updateDoc(msgRef, {
                last_msg: msg
            })
        });
        setMsg('');
    } 

    useEffect(() => {
        const subscribtion = onSnapshot(getMsgDetail, (snapshot) => {
            setMsgData(snapshot.docs.map(cht => (
                {
                    ...cht.data(),
                    id: cht.id
                }
            )));
        })

        return () => {
            subscribtion();
        }

    }, []);


    return ( 
        <div className="min-h-[85vh] mb-20">
            {msgData.map(chat => (
                <div key={chat.id}>
                {chat.uid != user.uid ? 
                    <div className="grid grid-rows-3 grid-flow-col">
                            <img className="row-span-3 col-span-1 rounded-full w-12 h-12" src={chat.profile_pic} alt="dm-profile" referrerPolicy="no-referrer" />
                                <div className="row-span-3 col-span-11">
                                    <p className="font-bold">{chat.username}</p>
                                    <p className="mytext w-fit max-w-[70vw] min-w-min text-xl font-semibold bg-sky-300 rounded-md px-2 py-2">{chat.msg_content}</p>
                                </div>
                    </div>
                    :
                    // <div className="grid grid-rows-3 grid-flow-col justify-items-end" key={chat.id}>
                    //         <p className="font-bold row-span-1 col-span-11">{chat.username}</p>
                    //         <p className="mytext row-span-2 col-span-11 w-fit max-w-[70vw] min-w-min text-xl font-semibold bg-sky-300 rounded-md px-2 py-2">{chat.msg_content}</p>
                    //     <img className="row-span-3 col-span-1 rounded-full w-12 h-12" src={chat.profile_pic} alt="my-dm-profile" referrerPolicy="no-referrer" />
                    // </div>
                    <div className="grid grid-rows-3 grid-flow-col justify-items-end">
                                <div className="row-span-3 col-span-11 grid justify-items-end">
                                    <p className="font-bold">{chat.username}</p>
                                    <p className="mytext w-fit max-w-[70vw] min-w-min text-xl font-semibold bg-sky-300 rounded-md px-2 py-2">{chat.msg_content}</p>
                                </div>
                            <img className="row-span-3 col-span-1 rounded-full w-12 h-12" src={chat.profile_pic} alt="dm-profile" referrerPolicy="no-referrer" />
                    </div>
                }
                </div>
            ))}
            <form onSubmit={handleSubmit} className="flex items-center justify-center md:w-screen gap-3 mt-3 fixed bottom-0 mb-16">
                    <textarea value={msg} onChange={(e) => setMsg(e.target.value)} className="border-2 w-72 lg:w-96 h-16"></textarea>
                    <button className="py-3 bg-blue-500 w-14 h-16 rounded-md"><i className="far fa-paper-plane text-2xl"></i></button>
            </form>
        </div>
     );
}
 
export default MessageRoom;