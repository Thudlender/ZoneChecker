import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const AdminPage = ({ children }) => {
    const {user} = useAuthContext();
    if (!user) {
        return <Navigate to="/login"/>
    }
    if(user.roles.includes("ROLE_ADMIN")){
        return children;
    }
    return <Navigate to="/not-allowed"/>
}

export default AdminPage;