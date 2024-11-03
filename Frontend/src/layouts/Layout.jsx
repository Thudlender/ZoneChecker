import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
const Layout = () => {
    return (
      <>
      <AuthProvider>
      <div className="container mx-auto">
        <Navbar />
      </div>
      <main>
          <Outlet />
        </main>
        <Footer />
        </AuthProvider>
        </>
      
    );
  };

  export default Layout
