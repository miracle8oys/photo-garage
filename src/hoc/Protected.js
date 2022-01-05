import { Outlet, Navigate } from "react-router-dom";
const Protected = ({user}) => {
    return user ? <Outlet /> : <Navigate to="/" />
}
 
export default Protected;