import React from "react";
import Link from "next/link";

interface MenuButtonProps {
  Icon: React.ElementType; // This assumes the icon is a JSX element
  name: string;
  href: string;
  error?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ Icon, name, href, error}) => {
  return (
    <Link
      href={href}
      className={"grid grid-cols-4 transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 justify-center items-center border-2 shadow-md rounded-lg p-2 " + (error? "bg-red-600 border-red-800" : "bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-900")}
    >

    <div className="bg-amber-400 rounded-md dark:bg-gray-800 dark:text-white text-gray-800 flex justify-center items-center">
        <Icon className="p-3 md:p-2 w-12 h-12"/>
    </div>

    <div className="col-span-3 text-gray-700 dark:text-white ml-2">
     <span className="font-medium text-lg">{name}</span>
    </div>

      
    </Link>
  );
};

export default MenuButton;