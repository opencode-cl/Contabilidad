"use client"
import MenuButton from "@/componentes/Utils/MenuButton"
import { Cog6ToothIcon, UserGroupIcon } from "@heroicons/react/24/solid"
import { usePathname } from "next/navigation"

export default function Configuracion() {

const path = usePathname()

const buttons = [
    {name:"Parámetros", href:"/parametros", Icon:Cog6ToothIcon },
    {name: "Usuarios", href:"/usuarios", Icon:UserGroupIcon }
]

    return (
        
    <section>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {buttons.map((item, index) => (
        <div className="md:mx-10 lg:mx-14">
            <MenuButton 
                key={index}
                name={item.name}
                href={path + item.href}
                Icon = {item.Icon}
                />
        </div>
            ))}
    </div>
    </section>

    )
}