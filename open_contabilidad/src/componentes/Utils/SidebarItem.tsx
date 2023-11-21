'use client'
import React from 'react';
import Link from 'next/link';

export type sidebarItemProps = {
    name: string;
    href: string;
    Icon: React.ElementType;
    active?: boolean;
    onClick?: ()=>void;
}

const SidebarItem: React.FC<sidebarItemProps> = ({name, href, Icon, active, onClick}) => {

    const activeClass = active ? " from-amber-600 to-yellow-400 text-white dark:to-sky-700 dark:from-sky-900 " : " text-gray-600 dark:text-slate-300";
    const activeIconClass = active ? " " : " group-hover:text-amber-600 dark:group-hover:text-sky-700";
    const activeTextClass = active ? " " : " group-hover:text-gray-700 dark:group-hover:text-sky-500";

    const handleClick = () => {
        if (onClick) {
          onClick();
        }
      };

    return(
        <li className="min-w-max">
            
            <Link href={href !== "/"? "/dashboard/" + href : "/login"}  onClick={handleClick} className={"group transition-colors duration-500 ease-in-out relative flex items-center space-x-4 bg-gradient-to-r px-4 py-3" + activeClass}>
                    <Icon className={"w-6 h-6" + activeIconClass}/>
                    <span className={"-mr-1 font-medium" + activeTextClass}>{name}</span>
            </Link>

        </li>
    );

}

export default SidebarItem;