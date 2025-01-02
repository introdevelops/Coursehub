"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";



interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  tutorId: string;
}

const MyCoursesPage = () => {


  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/mycourses");

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();

        setCourses(data.courses);

      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 mt-32 text-white">

        {loading &&   (<> 
        
          <div className="w-[100%] h-[100%] flex items-center justify-center bg-black mt-36">
                        <Image
                        width={100}
                        height={100}
                        src="/loading.gif"
                        alt="loading"
                        />
                    
                      </div></>)}
        
        {error && <p className="text-red-500">{error}</p>}

        {!loading &&  <h1 className="text-2xl font-bold mb-4">My Courses</h1>}
        {!loading && courses.length === 0 && <p>No courses purchased yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              onClick={() => router.push(`/courses/${course.id}`)}
              key={course.id}
              className="bg-gray-800 p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
            >
              <Image
              width={400}
              height={200}
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{course.title}</h2>
              <p className="text-gray-400 text-sm overflow-hidden text-ellipsis whitespace-nowrap">{course.description}</p>
              <p className="text-blue-500 font-bold mt-2">₹{course.price}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyCoursesPage;
