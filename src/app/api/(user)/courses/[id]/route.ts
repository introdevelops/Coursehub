

import prisma from "@/lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise< { id: string }> }) {
  const { id } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: { tutor: true,
        videos:true
       }, 
    });

   
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch course details" }, { status: 500 });
  }
}
