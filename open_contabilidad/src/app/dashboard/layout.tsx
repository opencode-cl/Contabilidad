"use client"
import LoginProvider from "@/componentes/Providers/LoginProvider"
import RedirectionTitle from "@/componentes/Utils/RedirectionTitle"
import SessionTitle from "@/componentes/Utils/SessionTitle"
import Sidebar from "@/componentes/Utils/Sidebar"
import secureLocalStorage from "react-secure-storage"
import { useRouter } from 'next/navigation';
import background from "@/public/images/fondo.jpg"
import DarkModeSwitcher from "@/componentes/Utils/darkModeSwitcher"
import CompanyParams from "@/componentes/Utils/CompanyParameters"
import { SESSION_NAMES } from '@/variablesglobales';


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    const router = useRouter();

    const onLogout = () =>{
      secureLocalStorage.removeItem("USER");
      secureLocalStorage.removeItem(SESSION_NAMES.EMPRESA_ID);
      secureLocalStorage.removeItem(SESSION_NAMES.EMPRESA_NAME);
      secureLocalStorage.removeItem(SESSION_NAMES.PERIODO_YEAR);
      secureLocalStorage.removeItem(SESSION_NAMES.PERIODO_MONTH);
    }

    const backgroundStyle={
      backgroundImage: `url(${background.src})`,
      backgroundSize: 'cover', // You can adjust this based on your needs
      backgroundPosition: 'center', // You can adjust this based on your needs
      backgroundRepeat: 'no-repeat',
    }

    return (
      <section className="flex">
        
        <Sidebar onLogout={onLogout} />
        
        <div style={backgroundStyle} className="p-4 grow overflow-hidden">

        <div className="flex items-center shadow-md bg-gradient-to-t from-amber-400 to-yellow-400 dark:from-slate-800 dark:to-slate-800 p-2 px-4 rounded-md">
          <RedirectionTitle />
          <div className="ml-auto p-2">
            <div className="flex space-x-4 items-center">
              <div className="bg-yellow-200 dark:bg-gray-900 p-1 rounded-md shadow-md">
                <DarkModeSwitcher />
              </div>
              <SessionTitle />
            </div>
          </div>
        </div>
            <div className="bg-white w-full dark:bg-slate-800 shadow-md rounded-md mt-2 p-4">
              <LoginProvider>
                <CompanyParams>
                  {children}
                </CompanyParams>
              </LoginProvider>
            </div>
      
            
        </div>
        
      </section>
    )
  }