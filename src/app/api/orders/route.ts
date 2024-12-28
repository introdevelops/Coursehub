import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { courseIds } = body; 

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: "No courses provided" }, { status: 400 });
    }

    
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds }, deleted: false },
    });

    if (courses.length !== courseIds.length) {
      return NextResponse.json({
        error: "Some courses are invalid or deleted",
      }, { status: 400 });
    }

    
    const totalAmount = courses.reduce((sum, course) => sum + course.price, 0);

    
    const orders = await prisma.$transaction(
      courses.map((course) =>
        prisma.order.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "COMPLETED", 
          },
        })
      )
    );

    return NextResponse.json({
      message: "Order(s) created successfully",
      orders,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating order: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
