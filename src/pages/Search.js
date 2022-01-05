import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase";

const Search = () => {

    const [keyword, setKeyword] = useState('');
    const [userDis, setUserDis] = useState([]);
    
    useEffect(() => {
        const postsRef = query(collection(db, "users"), where("username", ">=", keyword), where("username", "<=", keyword+ 'uf8ff'));
        if (keyword) {
        getDocs(postsRef)
            .then(snapshot => {
                setUserDis(snapshot.docs.map(userDis => (
                    {
                        uid: userDis.id,
                        username: userDis.data().username,
                        profile_pic: userDis.data().profile_pic
                    }
                )));
            })
        }
    }, [keyword]);


    return (
        <> 
        <form className="my-3 flex sticky top-12 justify-center gap-2 items-center">
            <Link to="/">
                <i className="fas fa-arrow-left text-2xl"></i>
            </Link>
            <input onChange={(e) => setKeyword(e.target.value)} type="search" className="h-10 border-2 w-full md:w-96" placeholder="Search.." />
        </form>
        <div className="min-h-[75vh] md:min-h-[70vh]">
        {userDis.map((usr, i) => (
            <div key={i} className="mx-3">
                <Link className="flex items-center gap-3" to={`/${usr.uid}`}>
                    <img src={`${usr.profile_pic}`} className="rounded-full w-14" alt="preview-profile" referrerPolicy="no-referrer" />
                    <h1 className="font-semibold text-xl">{usr.username}</h1>
                </Link>
            </div>
        ))}
        </div>
        </>
     );
}
 
export default Search;