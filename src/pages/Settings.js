const Settings = ({handleLogout}) => {
    return ( 
        <div className="flex justify-center min-h-[85vh]">
            <div>
                <button onClick={handleLogout} className="py-3 px-2 bg-red-500 rounded-md">Logout</button>
            </div>
        </div>
     );
}
 
export default Settings;