import {auth, signInWithGoogle} from "./config/firebase";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from 'react';
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Settings from "./pages/Settings";
import Activity from "./pages/Activity";
import Search from "./pages/Search";
import Footer from "./pages/Footer";
import UserPost from "./pages/UserPost";
import Comments from "./pages/Comments";
import Message from "./pages/Message";
import MessageRoom from "./pages/MessageRoom";

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
    setTimeout(() => {
      setMsg('');
    }, 1000);
  }


  return (
    <div className="my-3 mx-2 flex justify-center flex-col md:mt-3 md:mx-12">
        <BrowserRouter>
          {!user && 
            <button className='py-3 mx-2 bg-blue-500 w-28 rounded-md' onClick={handleLogin}>Login</button>
          }
          <div className="flex items-center mb-1 py-2 px-2 font-semibold rounded-md place-items-stretch sticky top-0 bg-cyan-500">
            
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
            </div>
          </div>
            {msg && <h1 className="sticky top-12 bg-slate-300 py-3 rounded-md text-xl text-center">{msg}</h1>}
            <Routes>
              <Route path="/" element={<Home user={user} setMsg={setMsg} />} />
              <Route path="/upload" element={<Upload user={user} />} />
              <Route path="/settings" element={<Settings handleLogout={handleLogout} />} />
              <Route path="/activity" element={<Activity user={user} />} />
              <Route path="/search" element={<Search />} />
              <Route path="/comments/:post_id" element={<Comments user={user} setMsg={setMsg} />} />
              <Route path="/message" element={<Message user={user} />} />
              <Route path="/message/:message_id" element={<MessageRoom user={user} />} />
              <Route path="/:post_uid" element={<UserPost />} />
            </Routes>
        <Footer user={user} />
        </BrowserRouter>
    </div>
  );
}

export default App;
