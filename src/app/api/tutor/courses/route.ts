import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { fetchYouTubePlaylist } from "@/lib/utility";





export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "tutor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const tutorId = session.user.id;
  const data = await req.json();

  

  const { title, description, price, playlistLink } =data;
  

  if (!title || !description || !price || !playlistLink) {
    return NextResponse.json(
      { error: "Please provide all required fields." },
      { status: 400 }
    );
  }


  try {
    
    const existingCourse = await prisma.course.findFirst({
      where: { playlistLink, deleted: false },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: "A non-deleted course with the same playlist link already exists." },
        { status: 400 }
      );
    }

    
    const videos = await fetchYouTubePlaylist(playlistLink);

    if (!videos.length) {
      return NextResponse.json(
        { error: "No videos found in the playlist." },
        { status: 400 }
      );
    }
   

    

    try {
      const newCourse = await prisma.course.create({
        data: {
          title,
          description,
          thumbnail: videos[0]?.thumbnail || "",
          price: parseInt(price,10),
          playlistLink,
          tutorId,
          videos: {
            createMany: { data: videos },
          },
        },
        include: { videos: true },
      });
      
      return NextResponse.json(newCourse, { status: 201 });

    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      throw prismaError; 
    }
    

  } catch (e: unknown) {
    if(e instanceof Error) console.error("Error creating course:", e);

    return NextResponse.json(
      { error: "An error occurred while creating the course." },
      { status: 500 }
    );
  }
}



export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "tutor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const tutorId = session.user.id;

  try {
    const courses = await prisma.course.findMany({
      where: { 
        tutorId,
        deleted:false
       },
      include: {
        videos: true, 
      },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
