import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("inside the courses ");
    const courses = await prisma.course.findMany({
      include: {
         tutor: true ,
        }, 
        where:{
          deleted:false
        }
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}
