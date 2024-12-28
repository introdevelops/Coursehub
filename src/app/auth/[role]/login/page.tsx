'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {

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

  if (!role) return <div>Loading...</div>; 

  return (<div className="flex justify-center items-center min-h-screen bg-gray-50">
      <LoginForm role={role} />
    </div>
  );
};


export default LoginPage;

