import Footer from "./Footer";

const Settings = ({handleLogout, user}) => {
    return ( 
        <>
            <div className="flex justify-center min-h-[85vh]">
                {user &&
                    <div>
                        <button onClick={handleLogout} className="py-3 px-2 bg-red-500 rounded-md">Logout</button>
                    </div>
                }
            </div>
            <Footer />
        </>
     );
}
 
export default Settings;