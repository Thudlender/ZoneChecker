import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routers/Router";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SuspenseContent from "./components/SuspenseContent";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<SuspenseContent />}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  </StrictMode>
);