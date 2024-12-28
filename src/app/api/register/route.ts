import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/utility";
import prisma from "@/lib/prisma";



export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  return NextResponse.json({ message: "User registered successfully", user });
}
