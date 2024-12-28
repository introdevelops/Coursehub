
"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";


const UserLandingPage = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/auth/user/signup");
  };

  return (<>
    <Navbar/>

    <div
      className="relative h-screen flex items-center justify-center bg-cover bg-center top-0 "
      style={{
        backgroundImage: "url('/user_side2.jpg')",
       
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 bg-white bg-opacity-90 text-black p-8 rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-red-500">Unlock</span> Your Learning Journey
          Today
        </h1>
        <button
          onClick={handleButtonClick}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          Start Learning
        </button>
      </div>
    </div>
    </>);
};

export default UserLandingPage;


