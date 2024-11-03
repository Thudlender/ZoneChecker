import { createBrowserRouter } from "react-router-dom";
import Layout from "../layouts/Layout";
import React, { lazy } from "react";
// import Home from "../pages/Home";
const Home = lazy(() => import("../pages/Home"))
// import AddLocation from "../pages/AddLocation";
const AddLocation  = lazy(() => import("../pages/AddLocation"));
// import Login from "../page/Login";
const Login = lazy(() => import("../pages/Login"));
// import Register from "../page/Register";
const Register = lazy(() => import("../pages/Register"));

const EditLocation = lazy(() => import("../pages/EditLocation"));
const Userprofile = lazy(() => import("../pages/UserProfile"));
const EditStore = lazy(() => import("../pages/EditStore"));
const EditModal = lazy(() => import("../components/EditModal"));

import NotAllowed from "../pages/NotAllowed";
import ModOrAdminPage from "../pages/ModOrAdminPage";
import AdminPage from "../pages/AdminPage";

import RegisterPotected from "../pages/RegisterProtection";


const router = createBrowserRouter([
    {
        path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element:(
          <RegisterPotected>
            <Register />
          </RegisterPotected>
          ),
      },
    ]
    }
]);

export default router;
