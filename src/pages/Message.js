import { useEffect, useState } from "react";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../config/firebase";
import { Link, useNavigate } from "react-router-dom";

const Message = ({user}) => {

    const [users, setUsers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const userRef = collection(db, "users");
    const roomRef = collection(db, "messages");
    const selectRoomRef = query(collection(db, "messages"), where("member", "array-contains", `${user.uid}`));
    const navigate = useNavigate();

    useEffect(() => {
        getDocs(userRef)
            .then(snapshot => {
                setUsers(snapshot.docs.map(user => (
                    {
                        ...user.data(),
                        id: user.id
                    }
                )));
            })
    }, []);

    useEffect(() => {
        getDocs(selectRoomRef)
            .then(snapshot => {
                setRooms(snapshot.docs.map(room => (  
                    {
                        ...room.data(),
                        id: room.id
                    }
                )))
            })
    }, [user])

    const createRoom = (user_id, profile_pic, username) => {
        addDoc(roomRef, {
            member: [user.uid, user_id],
            profile_pic: [user.photoURL, profile_pic],
            username: [user.displayName, username]
        }).then(snapshot => {
            navigate(`/message/${snapshot.id}`);
        });
    }

    return ( 
        <div className="min-h-[80vh] mt-5">
            <div className="min-h-[30vh]">
                {rooms.map(room => (
                    <Link to={`/message/${room.id}`} key={room.id}>
                        {room.member[0] === user.uid ? 
                        <div className="flex gap-3 mb-2">
                            <img className="w-12 h-12 rounded-full" src={`${room.profile_pic[1]}`} alt="snipped-pic-user" />
                            <div>
                                <p className="font-semibold">{room.username[1]}</p>
                                <p className="w-fit font-semibold text-lg py-2 px-2 rounded-md bg-sky-300 max-w-[70vw]">{room.last_msg}</p>
                            </div>
                        </div> : 
                        <div className="flex gap-3 mb-2">
                            <img className="w-12 h-12 rounded-full" src={`${room.profile_pic[0]}`} alt="snipped-pic-user" />
                            <div>
                                <p className="font-semibold">{room.username[0]}</p>
                                <p className="w-fit font-semibold text-lg py-2 px-2 rounded-md bg-sky-300 max-w-[70vw]">{room.last_msg}</p>
                            </div>
                        </div>
                        }
                    </Link> 
                ))}
            </div>
            <p className="my-2 text-2xl font-semibold">Recomendation : </p>
            {users.map(user => (
                <div className="flex justify-between items-center mr-20" key={user.id}>
                    <div className="flex items-center gap-3 mb-2">
                        <img className="rounded-full w-12" src={`${user.profile_pic}`} alt="msg-profile" referrerPolicy="no-referrer" />
                        <p className="text-xl font-semibold">{user.username}</p>
                    </div>
                    <i onClick={() => createRoom(user.id, user.profile_pic, user.username)} className="far fa-comment-dots text-4xl"></i>
                </div>
            ))}
        </div>
     );
}
 
export default Message;