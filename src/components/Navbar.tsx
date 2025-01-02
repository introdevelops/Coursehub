"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";


interface NavItem {
  key: string;
  label: string;
  route?: string;
  isEnabled: boolean;
  onClick?: () => void;
  btnClass?: string;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession(); 
  const context = useAuth();
  const { cart, removeFromCart } = useCart();
  const [isCart, setIsCart] = useState(false);

  
  const isLoading = status === "loading"; 
  const authStatus = !!session;
  const isTutor = pathname.includes("/tutor") || context.isTutor;

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
    router.push("/");
  };

  const commonNavs = (customNavs: NavItem[]): NavItem[] => [
    {
      key: "courses",
      label: "Courses",
      route: "/courses",
      isEnabled: authStatus,
      btnClass:
        "py-2.5 px-5 me-2 my-1 text-sm font-medium text-gray-900 focus:outline-none bg-slate-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100",
    },
    ...customNavs,
    {
      key: "logout",
      label: "Logout",
      route: "/",
      isEnabled: authStatus,
      onClick: logout,
      btnClass: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 my-1",
    },
  ];

  const userNavItems: NavItem[] = [
    {
      key: "login",
      label: "Login",
      route: "/auth/user/login",
      isEnabled: !authStatus,
      btnClass:
        "text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-2.5 me-2 my-1 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700 translate-x-6",
    },
    {
      key: "signup",
      label: "Sign Up",
      route: "/auth/user/signup",
      isEnabled: !authStatus,
      btnClass:
        "text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-1 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700 translate-x-2",
    },
    {
      key: "joinAsTutor",
      label: "Join as Tutor",
      route: "/tutor",
      isEnabled: !authStatus,
      btnClass:
        "bg-blue-700 text-white px-3 py-2 rounded hover:bg-blue-600 transition",
    },
    {
      key: "myCourses",
      label: "My Courses",
      route: "/my-courses",
      isEnabled: authStatus,
      btnClass:
        "py-2.5 px-5 me-2 my-1 text-sm font-medium text-gray-900 focus:outline-none bg-slate-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100",
    },
    {
      key: "cart",
      label: "Cart",
      onClick: () => {
        setIsCart(!isCart);
      },
      isEnabled: authStatus,
      btnClass:
        "inline-flex items-center px-5 py-2.5 my-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
  ];

  const tutorNavItems: NavItem[] = [
    {
      key: "login",
      label: "Login",
      route: "/auth/tutor/login",
      isEnabled: !authStatus,
      btnClass:
        "text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-6 py-2.5 me-2 my-1 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700 translate-x-6",
    },
    {
      key: "signup",
      label: "Sign Up",
      route: "/auth/tutor/signup",
      isEnabled: !authStatus,
      btnClass:
        "text-gray-900 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 my-1 bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-600 focus:ring-gray-700 translate-x-2",
    },
    {
      key: "joinAsUser",
      label: "Join as User",
      route: "/",
      isEnabled: !authStatus,
      btnClass:
        "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition",
    },
  ];

  const navItemsByRole = isTutor ? tutorNavItems : userNavItems;
  const navItems = commonNavs(navItemsByRole);

  if(isLoading) {
      return <></>
  }


  return (
    <>
      <header className="bg-white shadow-md fixed top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 ">
          <div
            className="flex items-center text-lg font-bold cursor-pointer text-black ml-4"
            onClick={() => {
              if(isTutor){
                router.push("/tutor");
              }else{
            router.push("/");
            }
          }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
              />
            </svg>
            CourseHub
          </div>

          <nav className="flex space-x-4 text-black">
            { (
              navItems
                .filter((item) => item.isEnabled)
                .map((item) => (
                  <button
                    key={item.key}
                    className={item.btnClass || "px-4 py-2 hover:underline"}
                    onClick={
                      item.onClick || (() => router.push(item.route || ""))
                    }
                  >
                    {item.label}
                    {item.key === "cart" && (
                      <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </button>
                ))
            )}
          </nav>
        </div>
      </header>
      {isCart && (
  <div className="fixed top-16 right-16 w-80 bg-white shadow-lg rounded-lg z-50 border">
    {/* Cart Header */}
    <div className="flex justify-between items-center p-4 border-b">
      <h3 className="text-lg font-semibold text-black">Cart</h3>
      <button
        onClick={() => setIsCart(false)}
        className="text-gray-500 hover:text-red-600 text-3xl focus:outline-none"
        aria-label="Close Cart"
      >
        &times;
      </button>
    </div>

    
    <div className="p-4">
      {cart.length > 0 ? (
        <>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center text-sm text-gray-700"
              >
                <span className="font-medium truncate w-3/4">{item.title}</span>
             
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-2  rounded text-lg font-bold hover:bg-red-600 focus:outline-none"
                  aria-label={`Remove ${item.title}`}
                >
                   &times;
                </button>
              </li>
            ))}
          </ul>
          
          <button
            
            onClick={() => {
              
              router.push("/checkout");
            }}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition focus:outline-none"
          >
            Checkout
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-sm text-center">Your cart is empty.</p>
      )}
    </div>
  </div>
)}

    </>
  );
};

export default Navbar;

