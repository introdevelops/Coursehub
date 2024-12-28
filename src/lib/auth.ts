import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

interface CustomUser {
  id: string;
  email: string;
  role: string;
}

interface CustomCredentials {
  email: string;
  password: string;
  role: string; 
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }, 
      },
      async authorize(credentials): Promise<CustomUser> {


        const { email, password, role } = credentials as CustomCredentials;

        if (!email || !password || !role) {
          throw new Error("Invalid credentials");
        }

        
        const user = await prisma.user.findUnique({
          where: { email },
        });

      

        if (!user) {
          throw new Error("No user found with this email");
        }

        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        
        if (user.role !== role) {
          throw new Error(`Unauthorized login attempt as ${role}`);
        }

        
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
      
        token.id = user.id;
        token.role = user.role;
      }
    
      return token;
    },
    session({ session, token }) {
    
      session.user = {
        id: token.id,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};
