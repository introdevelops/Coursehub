import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma"; 
import { authOptions } from "@/lib/auth"; 




export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    
    const orders = await prisma.order.findMany({
      where: { user: { email: userEmail }, status: "COMPLETED" },
      include: { course: true },
    });

    const purchasedCourses = orders.map((order) => ({
      id: order.course.id,
      title: order.course.title,
      description: order.course.description,
      price: order.course.price,
      thumbnail: order.course.thumbnail,
      tutorId: order.course.tutorId,
    }));

    return NextResponse.json({ courses: purchasedCourses });
  } catch (error) {
    console.error("Error fetching purchased courses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
