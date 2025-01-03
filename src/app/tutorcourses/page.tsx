"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { toast } from "react-toastify";

interface Course {
  id: string;
  title: string;
  thumbnail: string; 
  description:string;
  price: string;
  playlistLink: string;
}

 export default function TutorCoursesPage() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    price: "", 
    playlistLink: "",
    thumbnail:"",
  });
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [isLoading,setIsLoading]=useState(true);
  
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/tutor/courses", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setCourses(data);
          setIsLoading(false);
        } else {
          toast.error("Failed to fetch courses:");
        }
      } catch (error) {
       if(error instanceof Error) toast.error("Error fetching courses:");
      }
    };

    fetchCourses();
  }, []);

  
  const handleDeleteCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/tutor/courses/${id}`, { method: "DELETE" });
      if (response.ok) {
        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== id));
      } else {
        toast.error("Failed to delete course:");
      }
    } catch (error) {
      if(error instanceof Error) toast.error("Error deleting course:");
    }
  };

  
  const handleCreateCourse = async () => {
 
    if (!newCourse.title || !newCourse.price || !newCourse.playlistLink) {
     toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const newCourseData = {
        ...newCourse,
        price: parseInt(newCourse.price), 
      };

      const response = await fetch("/api/tutor/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourseData),
      });

      if (response.ok) {
        const createdCourse = await response.json();
        setCourses((prevCourses) => [...prevCourses, createdCourse]);
        setIsModalOpen(false);
        setNewCourse({
          title: "",
          description: "",
          price: "",
          playlistLink: "",
          thumbnail:""
        });
      } else {
        
        toast.error(`Failed to create course: try again`);
      }
    } catch (error) {
      if(error instanceof Error) {
        
      toast.error(`Error creating course`);
      }
    }
  };

  const handleEditCourse = async () => {
    if (!editCourse || !newCourse.title || !newCourse.price || !newCourse.playlistLink) {
      toast.info("Please fill in all required fields.");
      return;
    }
  
    
    if (
      newCourse.title === editCourse.title &&
      newCourse.price === editCourse.price.toString() &&
      newCourse.playlistLink === editCourse.playlistLink &&
      newCourse.description === editCourse.description &&
      newCourse.thumbnail === editCourse.thumbnail
    ) {
      
      toast.info("No changes made to the course.");
      return;
    }
  
    try {
      
      const updatedCourseData = {
        ...newCourse,
        price: parseFloat(newCourse.price), 
      };
  
      
      if (newCourse.playlistLink === editCourse.playlistLink) {
        updatedCourseData.playlistLink = editCourse.playlistLink;
      }
  
      const response = await fetch(`/api/tutor/courses/${editCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourseData),
      });
  
      if (response.ok) {
        const updatedCourse = await response.json();
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
        setIsModalOpen(false);
        setEditCourse(null);
        setNewCourse({
          title: "",
          description: "",
          price: "",
          playlistLink: "",
          thumbnail: "",
        });
      } else {
        
        toast.error(`Failed to edit course : Try again`);
      }
    } catch (error) {
      if (error instanceof Error) toast.error(`Error editing course: Try again`);
    }
  };
  
  


  return (
    <>
      <Navbar />
     {(isLoading)?
     (<div className="w-screen h-screen flex items-center justify-center bg-black ">
                     <Image
                     width={100}
                     height={100}
                     src="/loading.gif"
                     alt="loading"
                     className="mt-10"
                     />
                 
                   </div>) : 
      (<div className="p-4 mt-20 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Your Courses</h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() =>{
              setNewCourse({ title: "", description: "", price: "", playlistLink: "", thumbnail: "" });
               setIsModalOpen(true)}}
          >
            Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border p-4 rounded shadow hover:shadow-lg flex flex-col justify-between"
            >
              <div className="cursor-pointer"
               onClick={() => router.push(`/tutorcreatedcourses/${course.id}`)}>
                <Image
                  width="400"
                  height="500"
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-32 object-cover rounded"
                />
                <h2 className="mt-2 text-lg font-medium whitespace-nowrap text-ellipsis overflow-hidden">{course.title}</h2>
                <p className="mt-1 text-sm text-gray-500">Price: ₹{course.price}</p>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => {
                    setEditCourse(course);
                    setNewCourse({
                      title: course.title,
                      description: course.description,
                      price: course.price.toString(),
                      playlistLink: course.playlistLink,
                      thumbnail:course.thumbnail
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-black">
              <h2 className="text-xl font-semibold mb-4">
                {editCourse ? "Edit Course" : "Create a New Course"}
              </h2>

              <input
              
                type="text"
                name="title"
                placeholder="Course Title"
                value={newCourse?.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full border p-2 mb-2 rounded"
              />
              <textarea
                name="description"
                placeholder="Course Description"
                value={newCourse?.description}
                onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Course Price"
                value={newCourse?.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="url"
                name="playlistLink"
                placeholder="YouTube Playlist Link"
                value={newCourse?.playlistLink}
                onChange={(e) => setNewCourse({ ...newCourse, playlistLink: e.target.value })}
                className="w-full border p-2 mb-2 rounded"
              />

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditCourse(null);
                    setNewCourse({ title: "", description: "", price: "", playlistLink: "", thumbnail: "" });
                  }}
                  
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={async()=>{
                    if(editCourse){
                      await handleEditCourse()
                  
                    }else{
                      handleCreateCourse()
                    }
                   }
                  }
                >
                  {editCourse ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>)}
    </>
  );
}