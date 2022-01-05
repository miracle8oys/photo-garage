import { Link } from "react-router-dom";
const Footer = ({user}) => {
    return ( 
        <div className="flex justify-between items-center sticky bottom-0 right-0 bg-cyan-500 py-2 px-2 rounded-md md:py-1">
            
                <Link to="/">
                    <i className="fas fa-home text-4xl"></i>
                </Link>
                <Link to="/search">
                    <i className="fas fa-search text-4xl"></i>
                </Link>
                <Link to="/settings">
                {user &&
                    <img className='rounded-full w-10 sticky' src={`${user.photoURL}`} alt="profile-pic" referrerPolicy="no-referrer" />
                }
                {!user && 
                    <img className='rounded-full w-10 sticky' src="https://firebasestorage.googleapis.com/v0/b/photo-garage.appspot.com/o/24-248253_user-profile-default-image-png-clipart-png-download.png?alt=media&token=4ab19b20-84db-483d-8b21-27f21e0ff1ec" alt="profile-unauthenticated" />
                }
                </Link>
                
        </div>
     );
}
 
export default Footer;