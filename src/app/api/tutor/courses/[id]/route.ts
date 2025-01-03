
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { fetchYouTubePlaylist } from "@/lib/utility";

export async function GET(req: Request, { params }: { params:Promise< { id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session || session.user.role !== "tutor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const course = await prisma.course.findUnique({
    where: { id },
    include: { videos: true },
  });

  if (!course || course.deleted) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}



export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const existingCourse = await prisma.course.findUnique({
      where: { id }, 
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

 
      await prisma.course.update({
        where: { id },
        data: {
          deleted: true,
          playlistLink: `${existingCourse.playlistLink}-${Date.now()}`, 
        },
      });
    
     

    return NextResponse.json(
      { message: "Course and playlist updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking course as deleted:", error);
    return NextResponse.json({ error: "Failed to mark course as deleted." }, { status: 500 });
  }
}




export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();

    type CourseUpdateData = {
      title?: string;
      description?: string;
      price?: number;
      thumbnail?: string;
      playlistLink?: string;
    };

    const updateData: CourseUpdateData = {};

    
    const existingCourse = await prisma.course.findUnique({ where: { id } });

    if (!existingCourse || existingCourse.deleted) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseInt(body.price);

    
    if (body.playlistLink !== undefined && body.playlistLink !== existingCourse.playlistLink) {
      updateData.playlistLink = body.playlistLink;

      try {
        
        const videos = await fetchYouTubePlaylist(body.playlistLink);

        if (videos.length > 0) {
          
          updateData.thumbnail = videos[0].thumbnail;

          
          await prisma.video.deleteMany({ where: { courseId: id } });
          await prisma.video.createMany({
            data: videos.map((video) => ({
              id: video.videoId,
              title: video.title,
              description: video.description || "",
              thumbnail: video.thumbnail,
              videoId: video.videoId,
              courseId: id,
            })),
          });
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          return NextResponse.json({ error: "Invalid playlist link or failed to fetch playlist data." }, { status: 400 });
        }
      }
    }

    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided for update." }, { status: 400 });
    }


    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCourse, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course." }, { status: 500 });
  }
}
  

