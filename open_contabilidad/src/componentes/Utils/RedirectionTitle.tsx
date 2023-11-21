import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

const RedirectionTitle = () =>{

    const paths = usePathname().split("/");

    return(
        <div className="">
            <p className="text-xs text-amber-800 flex dark:text-gray-300">
                {paths.map((item,index)=>{
                    return(<span key={index}>
                        <Link href={paths.slice(0, index + 1).join("/")} className="capitalize flex">
                            {item}
                            <ChevronRightIcon className="w-3 mx-0.5 mt-0.5 h-3"/>
                         </Link>
                    </span>)
                })}
            </p>
            <p className="text-2xl dark:text-white capitalize">{paths[2]===null? paths[1]:paths[2]}</p>
        </div>
    )

}

export default RedirectionTitle;