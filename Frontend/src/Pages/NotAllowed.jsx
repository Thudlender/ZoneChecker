import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotAllowing from "../assets/iwillnotallowit.gif";
// import NotAllowing from "../assets/say-no.png";

const NotAllowed = () => {
  const [counter, setCounter] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    const countDown = setInterval(() => {
      setCounter((prevCounter) => {
        if (prevCounter <= 1) {
          clearInterval(countDown);
          return 0;
        }
        return prevCounter - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countDown);
    };
  }, [navigate]);

  return (
    <div className="container flex flex-col items-center p-8 mx-auto space-y-6">
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 py-10">
        {/* NotAllowing มากจากการ import ในโฟลเดอร์ assets */}
          <img src={NotAllowing} alt="Shoes" className="rounded-xl" />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">
            Page Not Alloweded!
            <div className="badge badge-secondary">Error</div>
          </h2>
          <p>You are not allowed to access this page.</p>
        </div>
        {/* items countdown นับถอยหลัง */}
        <span className="countdown font-mono text-6xl items-center justify-center">
          {/* counter มากจาก useState */}
          <span style={{ "--value": counter }}></span>
        </span>
        <div className="text-center">sec</div>
      </div>
    </div>
  );
};

export default NotAllowed;