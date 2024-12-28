
"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const TutorLandingPage = () => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/auth/tutor/login");
  };

  return (<>
    <Navbar />
    <div
      className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/6325954/pexels-photo-6325954.jpeg')",
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
    </div>
    </>
  );
};

export default TutorLandingPage;
