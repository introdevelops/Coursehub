
import { AuthProvider } from '../contexts/AuthContext';
import './globals.css'; 
import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '@/lib/auth';

import SessionProviderWrapper from './provider';
import { CartProvider } from '@/contexts/CartContext';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  const isTutor = session?.user.role === 'tutor';
  
  return (
    <html lang="en">
      <body className="bg-black text-black">
        <SessionProviderWrapper>
          <AuthProvider value={{ isTutor }}>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </SessionProviderWrapper>
        
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}
