
"use client";

import Navbar from "@/components/Navbar";

import { useRouter } from "next/navigation";
import { useSession } from 'next-auth/react';
import Image from "next/image";

const TutorLandingPage = () => {
  const router = useRouter();
  const {status}=useSession();

  const handleButtonClick = () => {
    router.push("/auth/tutor/login");
  };

  return (<>
    <Navbar />
   {(!(status==="loading"))?(<div
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/tutor_landing.jpeg')",
       
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>
      <div className="relative z-10 bg-white bg-opacity-90 text-black p-8 rounded-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-6">
          <span className="text-red-500">Inspire</span> the Next Generation of
          Learners
        </h1>
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Go to Courses
        </button>
      </div>
    </div>):
    (
       <div className="w-[100%] h-screen flex items-center justify-center bg-black">
                                    <Image
                                    width={100}
                                    height={100}
                                    src="/loading.gif"
                                    alt="loading"
                                    />
                                
                                  </div>  
    )
    }
    </>
  );
};

export default TutorLandingPage;
