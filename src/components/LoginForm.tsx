

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface LoginFormProps {
  role: string;
}

const LoginForm = ({ role }:LoginFormProps) => {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    
    const response = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role, 
    });

    if (response?.error) {
      setError(response.error); 
    } else {
      
      if (role === 'user') {
        router.push('/');
      } else {
        router.push(`/${role}/`); 
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-black">
      <h2 className="text-2xl font-bold text-center mb-4">Login as {role}</h2>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don``t have an account?{' '}
        <a href={`/auth/${role}/signup`} className="text-indigo-600 hover:text-indigo-700">
          Sign up here
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
