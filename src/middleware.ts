import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); 
  const pathname = url.pathname; 

<<<<<<< HEAD
    
=======
   console.log("Cookies:", req.cookies);
>>>>>>> 77f675a55a12dfc01e460a7e31820c84e12b1a9b
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("Middleware Token:", token);

  
  if (!token) {

    if (
      pathname.startsWith("/auth/tutor/login") ||
      pathname.startsWith("/auth/tutor/signup") ||
      pathname.startsWith("/auth/user/login") ||
      pathname.startsWith("/auth/user/signup")
    ) {
      return NextResponse.next();
    }


    if (pathname === "/" || pathname === "/tutor") {
      return NextResponse.next();
    }

    
    if (pathname.startsWith("/mycourses") || pathname.startsWith("/courses")) {
      url.pathname = "/auth/user/login";
    } else if (pathname.startsWith("/tutorcourses")) {
      url.pathname = "/auth/tutor/login"; 
    }
    return NextResponse.redirect(url);
  }

  
  const role = token.role;

  
  if (pathname.startsWith("/auth")) {
    if (role === "tutor") {
      return NextResponse.redirect(new URL("/tutorcourses", req.url));
    } else if (role === "user") {
      return NextResponse.redirect(new URL("/courses", req.url));
    }
  }

  
  if (role === "tutor") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/tutorcourses", req.url));
    }
    if (pathname === "/tutor") {
      return NextResponse.redirect(new URL("/tutorcourses", req.url));
    }
    if (pathname.startsWith("/tutorcourses")) {
      return NextResponse.next(); 
    }
    if (pathname.startsWith("/mycourses") || pathname.startsWith("/courses")) {
      return NextResponse.redirect(new URL("/tutorcourses", req.url));
    }
  }

  
  if (role === "user") {
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/courses", req.url));
    }
    if (pathname.startsWith("/tutor") || pathname.startsWith("/tutorcourses")) {
      return NextResponse.redirect(new URL("/courses", req.url));
    }
    if (pathname.startsWith("/mycourses") || pathname.startsWith("/courses")) {
      return NextResponse.next(); // Allow users to access their routes
    }
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/tutor",
    "/auth/tutor/:path*",
    "/auth/user/:path*",
    "/mycourses",
    "/courses",
    "/tutorcourses",
  ],
};
