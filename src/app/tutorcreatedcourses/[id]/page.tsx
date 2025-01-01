"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
}

interface Course {
  title: string;
  description: string;
  videos: Video[];
}

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {

  const { id } = use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading,setIsLoading]=useState(true);

 
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(`/api/tutor/courses/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setIsLoading(false);
        } else {
          toast.error("Failed to fetch course details");
        }
      } catch (error) {
        if(error instanceof Error ) toast.error("Error fetching course details:");
      }
    };

    fetchCourseDetails();
  }, [id]);

  const openModal = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

  

  return (<>
    <Navbar/>

   {(isLoading)?      
    ( <div className="w-[100%] h-screen flex items-center justify-center bg-black ">
                   <Image
                   width={100}
                   height={100}
                   src="/loading.gif"
                   alt="loading"
                   className="mt-10"
                   />
               
                 </div>)
   
  
  
  : (<div className="p-4 text-white mt-20">
     
      <h1 className="text-2xl font-semibold mb-6">{course?.title}</h1>
      <p className="mb-8">{course?.description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {course?.videos.map((video) => (
          <div
            key={video.id}
            className="border p-4 rounded shadow hover:shadow-lg flex flex-col justify-between h-full"
          >
            <div>
              <Image
                width={400}
                height={250}
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-32 object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-medium">{video.title}</h2>
            </div>
            <button
              onClick={() => openModal(video)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            >
              Play Video
            </button>
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
            <h2 className="text-xl text-white font-semibold mb-4 line-clamp-1">{selectedVideo.title}</h2>
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
    </div>)}
    </> );
}
