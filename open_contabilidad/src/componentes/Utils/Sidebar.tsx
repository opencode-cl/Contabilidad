"use client"
import React, {useState, useEffect} from 'react';
import SidebarItem from './SidebarItem';
import { BuildingLibraryIcon, CalculatorIcon, ChevronLeftIcon, CircleStackIcon, Cog6ToothIcon, CurrencyDollarIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentCheckIcon, MagnifyingGlassIcon, PowerIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/public/images/opencodeicon.png'
import secureLocalStorage from 'react-secure-storage';

export type sidebarProps = {
    onLogout?: ()=> void;
}

const Sidebar: React.FC<sidebarProps> = ({onLogout}) => {
  
    const[isCollapsed, setCollapsed] = useState(false);
    const[activeItem, setActiveItem] = useState("");

    const paths = usePathname().split("/");

    useEffect(() => {
        
        setActiveItem("/"+paths[2])

        const savedIsCollapsed = localStorage.getItem('isCollapsed');
        if (savedIsCollapsed !== null) {
          setCollapsed(savedIsCollapsed === 'true');
        }
      }, []);
    
    
      useEffect(() => {
        localStorage.setItem('isCollapsed', isCollapsed.toString());
      }, [isCollapsed]);

    const collapseClass = isCollapsed ? ' w-[3.5rem] ' : ' w-56 shadow-lg ';

    const handleCollapseSidebar = () =>{
        setCollapsed(!isCollapsed);
    }

    const sidebarItems = [
        { name: "Cuentas", href: "/cuentas", Icon: CircleStackIcon },
        { name: "Contabilidad", href: "/contabilidad", Icon: CalculatorIcon },
        { name: "Análisis", href: "/analisis", Icon: MagnifyingGlassIcon },
        { name: "Libro Compras", href: "/compras", Icon: DocumentArrowDownIcon },
        { name: "Libro Ventas", href: "/ventas", Icon: DocumentArrowUpIcon },
        { name: "Honorarios", href: "/honorarios", Icon: DocumentCheckIcon },   
        { name: "Tesorería", href: "/tesoreria", Icon: BuildingLibraryIcon },
        { name: "Activos", href: "/activos", Icon: CurrencyDollarIcon },
      ];

    const handleItemClick = (itemName:string) => {
        setActiveItem(itemName);
     };

    return(
        <div className="min-h-screen bg-gray-100">
        <div className={"transition-all shadow-md duration-300 ease-in-out "+collapseClass +"sidebar h-full min-h-screen overflow-hidden bg-white dark:bg-slate-800 "}>
            <div className="flex h-screen flex-col justify-between pt-5 pb-6">
            <div>
                <div className="w-max p-1 flex" onClick={handleCollapseSidebar}>
                    <Image src={logo} className="w-12" alt="" />
                    <span className="font-semibold text-xl -mr-1 ml-5 mt-2.5 text-amber-800 dark:text-slate-400 flex">
                    Contabilidad
                    </span>
                    
                </div>
                <ul className="mt-3 space-y-2 tracking-wide">

                    {sidebarItems.map((item, index) => (
                        <SidebarItem 
                            key={index}
                            name={item.name}
                            href={item.href}
                            Icon = {item.Icon}
                            active = {activeItem === item.href}
                            onClick={()=>handleItemClick(item.href)}
                            />
                    ))}

                </ul>
                
            </div>
            
            <div>
                <ul className="mt-3 space-y-2 tracking-wide">
                    <SidebarItem 
                    name="Configuración" 
                    href="/configuracion" 
                    Icon={Cog6ToothIcon} 
                    active = {activeItem === "/configuracion"}
                    onClick={()=>handleItemClick("/configuracion")}
                    />

                    <SidebarItem name="Cerrar Sesión" href="/" Icon={PowerIcon} onClick={onLogout}/>
                </ul>
            </div>

            </div>
        </div>
        </div>
    );

};

export default Sidebar;