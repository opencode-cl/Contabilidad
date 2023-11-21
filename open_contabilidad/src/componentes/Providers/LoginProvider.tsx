"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import secureLocalStorage from 'react-secure-storage';

interface LoginProviderProps {
  children: React.ReactNode;
}

const LoginProvider: React.FC<LoginProviderProps> = ({ children }) => {

  const router = useRouter();

  useEffect(() => {
    const user = secureLocalStorage.getItem('USER');

    if (!user || user === "") {
      router.push('/login');
    }
  }, []);
  
  return <>{
    children
    }</>;
};

export default LoginProvider;