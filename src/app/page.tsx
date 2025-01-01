"use client";

import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserLandingPage = () => {
  const router = useRouter();
  const { status } = useSession();

  const handleButtonClick = () => {
    router.push("/auth/user/signup");
  };

  return (
    <>
      <Navbar />
      {status !== "loading" ? (
        <div className="relative h-screen flex items-center justify-center top-0">
          {/* Background Image */}
          <Image
            src="/user_side2.jpg"
            alt="User Landing Background"
            layout="fill"
            objectFit="cover"
            priority
            placeholder="blur"
            blurDataURL="/path-to-blurred-image.jpg" // Replace with your blurred image
            className="z-0"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

          {/* Content */}
          <div className="relative z-20 bg-white bg-opacity-90 text-black p-8 rounded-lg flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mb-6">
              <span className="text-red-500">Unlock</span> Your Learning Journey Today
            </h1>
            <button
              onClick={handleButtonClick}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Start Learning
            </button>
          </div>
        </div>
      ) : (
        <div className="w-[100%] h-screen flex items-center justify-center bg-black">
          <Image
            width={100}
            height={100}
            src="/loading.gif"
            alt="loading"
          />
        </div>
      )}
    </>
  );
};

export default UserLandingPage;
