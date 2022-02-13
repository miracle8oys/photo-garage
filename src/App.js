import {auth, signInWithGoogle} from "./config/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from 'react';
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Search from "./pages/Search";
import UserPost from "./pages/UserPost";
import Comments from "./pages/Comments";
import Message from "./pages/Message";
import MessageRoom from "./pages/MessageRoom";
import Protected from "./hoc/Protected";
import { useEffect } from "react";

function App() {

  const [msg, setMsg] = useState('');
  const [user, setUser] = useState({});
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const handleLogin = () => {
    signInWithGoogle();
  }

  const handleLogout = () => {
    signOut(auth).then(() => {
      setMsg("Logout Success")
    });
  }

  useEffect(() => {
    setTimeout(() => {
      setMsg('');
    }, 2000);
  }, [msg])

  return (
    <div className="my-3 mx-2 flex justify-center flex-col md:mt-3 md:mx-12">
        <BrowserRouter>
        <div className="sticky top-0 bg-white">
          <div className="flex z-10 items-center mb-1 py-2 px-2 font-semibold rounded-md place-items-stretch">
              <h1 className="flex-1 italic text-3xl"><Link to="/">PhotoGalerry</Link></h1>
            <div className="flex gap-3 md:gap-8 items-center mt-1">
              <Link to="/upload">
                <i className="far font-medium fa-plus-square text-3xl"></i>
              </Link>
              <Link to="/activity">
                <i className="far font-medium fa-heart text-3xl"></i>
              </Link>
              <Link to="/message">
                <i className="far font-medium fa-comment text-3xl"></i>
              </Link>
              <Link to="/search">
                  <i className="fas fa-search text-3xl md:inline hidden"></i>
              </Link>
              <Link to="/settings" className="md:inline hidden">
                  {user &&
                      <img className='rounded-full w-10 sticky' src={`${user.photoURL}`} alt="profile-pic" referrerPolicy="no-referrer" />
                  }
                  {!user && 
                      <img className='rounded-full w-10 sticky' src="https://firebasestorage.googleapis.com/v0/b/photo-garage.appspot.com/o/24-248253_user-profile-default-image-png-clipart-png-download.png?alt=media&token=4ab19b20-84db-483d-8b21-27f21e0ff1ec" alt="profile-unauthenticated" />
                  }
              </Link>
            </div>
          </div>
          <hr />
        </div>
          {!user && 
            <div className="flex w-screen md:-mx-12 justify-center sticky top-14">
              <button className='py-3 mx-2 bg-blue-500 w-28 rounded-md' onClick={handleLogin}>Login</button>
            </div>
          }
            <div className="flex justify-center">
              {msg && <h1 className="sticky top-12 md:h-12 md:w-2/4 bg-slate-300 py-3 rounded-md text-xl text-center">{msg}</h1>}
            </div>
            <Routes>
              <Route path="/" element={<Home user={user} setMsg={setMsg} />} />
              <Route element={<Protected user={user} />}>
                <Route path="/upload" element={<Upload user={user} />} />
                <Route path="/activity" element={<Activity user={user} />} />
              </Route>
              <Route path="/settings" element={<Settings handleLogout={handleLogout} user={user} />} />
              <Route path="/search" element={<Search />} />
              <Route path="/comments/:post_id" element={<Comments user={user} setMsg={setMsg} />} />
              <Route element={<Protected user={user} />}> 
                <Route path="/message" element={<Message user={user} setMsg={setMsg} />} />
                <Route path="/message/:message_id" element={<MessageRoom user={user} />} />
              </Route>
              <Route path="/:post_uid" element={<UserPost user={user} />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
