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
  const { title, description, price, playlistLink } = await req.json();

  try {
    const videos = await fetchYouTubePlaylist(playlistLink);

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail: videos[0]?.thumbnail || "", 
        price: parseInt(price,10),
        playlistLink,
        tutorId,
        videos: {
          createMany: {
            data: videos,
          },
        },
      },
      include: {
        videos: true,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
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
