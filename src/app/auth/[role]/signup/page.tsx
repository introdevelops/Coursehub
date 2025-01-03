

'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SignUpForm from '@/components/SignupForm';
import Image from 'next/image';


const SignUpPage = () => {

  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {

    const { pathname } = window.location;
    const parts = pathname.split('/');
    const roleFromPath = parts[2]; 
    
    if (roleFromPath === 'user' || roleFromPath === 'tutor') {
      setRole(roleFromPath);
    } else {
      router.push('/error'); 
    }
  }, [router]);

  if (!role) return <div className="w-[100%] h-screen flex items-center justify-center bg-black">
                                  <Image
                                  width={100}
                                  height={100}
                                  src="/loading.gif"
                                  alt="loading"
                                  />
                              
                                </div>; 

  return (<>
  
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUpForm role={role} />
    </div>
    </>
  );
};

export default SignUpPage;
