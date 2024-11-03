import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ModOrAdminPage = ({ children }) => {
    const {user} = useAuthContext();
    if (!user) {
        return <Navigate to="/login"/>
    }
    if(
        user.roles.includes("ROLE_ADMIN") ||
        user.roles.includes("ROLE_MODERATOR")
    ){
        return children;
    }
    return <Navigate to="/not-allowed"/>
};

export default ModOrAdminPage;