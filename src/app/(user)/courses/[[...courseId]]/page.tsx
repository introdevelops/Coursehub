"use client"
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";


interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  videos: Video[];
}

export default function CoursesPage({ params }: { params: Promise<{ courseId?: string[] }>}) {

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseDetails, setCourseDetails] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);

  const router = useRouter();
  
  const courseId = use(params)?.courseId?.[0];

  const {cart,addToCart} = useCart();

 
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
    
      try {
        if (courseId) {
          
          const response = await fetch(`/api/courses/${courseId}`);
          if (response.ok) {
            const data = await response.json();
            setCourseDetails(data);
          } else {
            throw new Error("Failed to fetch course details.");
          }
        } else {
          
          const response = await fetch(`/api/courses`);
          if (response.ok) {
            const data = await response.json();
            setCourses(data);
          } else {
            throw new Error("Failed to fetch courses.");
          }
    
          
          const response2 = await fetch(`/api/mycourses`);
          if (response2.ok) {
            const data = await response2.json();
            setPurchasedCourses(data.courses.map((course: Course) => course.id));
          } else {
            throw new Error("Failed to fetch purchased courses.");
          }
        }
      } catch (err:unknown) {
        if(err instanceof Error){ 
        setError(err.message || "An error occurred while fetching data.");
       
      }
      } finally {
         
         const response2 = await fetch(`/api/mycourses`);
         if (response2.ok) {
           const data = await response2.json();
           setPurchasedCourses(data.courses.map((course: Course) => course.id));
         } else {
           throw new Error("Failed to fetch purchased courses.");
         }
        setLoading(false);
      }
    };
    

    fetchData();
  }, [courseId]);

  

  const openModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

 

 

  const isCourseInCart = (courseId: string) => {
    return cart.some((item) => item.id === courseId);
  };

  const isCoursePurchased = (courseId: string) => purchasedCourses.includes(courseId);


 
  if (courseId && courseDetails) {

    const isPurchased = isCoursePurchased(courseId);
   
   
    return (
      <>
      <div className="p-4 mt-16 text-white">
      <Navbar/>
        <h1 className="text-2xl font-semibold mb-4  whitespace-nowrap overflow-hidden text-ellipsis">{courseDetails.title}</h1>
        <p className="mb-4">{courseDetails.description}</p>
       
        <button
          onClick={() => router.push("/courses")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-6">
          Back to Courses
        </button>

     
        <div className="flex flex-col gap-4">
          {courseDetails?.videos?.map((video,index) => (
            <div
              key={video.id}
              className="flex items-center justify-between border p-4 rounded shadow hover:shadow-lg w-full"
            >
              
              <div className="w-60 h-32 mr-4">
                <Image
                  width={400}
                  height={128}
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
  

              <div className="flex-1">
                <h2 className="text-lg font-medium">{video.title}</h2>
              </div>
  
              
              <div>
              {isPurchased || index === 0 ? (
                  <button
                    onClick={() => openModal(video)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Play Video
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded cursor-not-allowed"
                  >
                    Locked
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>


        {isModalOpen && selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-black p-4 rounded shadow-lg w-full max-w-3xl relative h-[80%]">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 rounded-md bg-red-600 text-white hover:text-black w-7 h-9 text-3xl"
              >
                &times;
              </button>
              <h2 className="text-xl text-white font-semibold mb-4">{selectedVideo.title}</h2>
              <div className="aspect-video mb-4">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
    );
  }

  return (
    <>
     {error && (
    <div className="p-4 text-center">
      <p className="text-red-500 font-bold">{error}</p>
    </div>
   )}
      <Navbar />
      <div className="p-4 mt-20">
      {!loading &&  <h1 className="text-2xl font-bold mb-7 text-center text-white">All Courses</h1>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {(loading) ? 
           
             ( <div className="w-[322%] h-[285%] flex items-center justify-center bg-black -ml-10">
                <Image
                width={100}
                height={100}
                src="/loading.gif"
                alt="loading"
                className="mt-10"
                />
            
              </div>)
          
          
          
          
          :( courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow hover:shadow-lg">
              <Image
                height={300}
                width={400}
                src={course.thumbnail}
                alt={course.title}
                className="object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-medium text-ellipsis text-white overflow-hidden whitespace-nowrap ">{course.title}</h2>
              <p className="mt-1 text-md text-gray-500 text-ellipsis overflow-hidden">{course.description}</p>
              <p className="mt-1 text-md text-green-400 font-bold">Price: ₹{course.price}</p>
             <button 
              onClick={
              (e)=>{
                   e.stopPropagation();
                 router.push(`/courses/${course.id}`)}
            }
             className ="mt-4 px-4 py-2 mr-6 rounded bg-blue-500 text-white hover:bg-blue-600">View</button>
              

            { isCoursePurchased(course.id) ? (
             <div
             onClick={(e)=>{
              e.stopPropagation();    
            }}
             className="mt-4 px-4 py-2 inline-block bg-green-500 text-white rounded text-center cursor-default">
              Purchased
            </div>
          ) : (
            <button
              disabled={isCourseInCart(course.id)}
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  id: course.id,
                  title: course.title,
                  price: course.price,
                });
              }}
              className={`mt-4 px-4 py-2 rounded ${
                isCourseInCart(course.id)
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            > 
              {isCourseInCart(course.id) ? "Added to Cart" : "Add to Cart"}
            </button>)
              
             } </div>
          )))}
        </div>
      </div>
    </>
  );
}
