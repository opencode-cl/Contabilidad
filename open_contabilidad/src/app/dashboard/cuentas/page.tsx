    "use client"
    import MenuButton from "@/componentes/Utils/MenuButton"
    import { CubeIcon, DocumentIcon, IdentificationIcon, RectangleGroupIcon, BookOpenIcon, BuildingStorefrontIcon, BuildingOfficeIcon, ClipboardDocumentCheckIcon, PresentationChartBarIcon, ChartPieIcon, ChartBarSquareIcon, PresentationChartLineIcon, BuildingOffice2Icon, KeyIcon, BanknotesIcon } from "@heroicons/react/24/solid"
    import { usePathname } from "next/navigation"

    export default function Cuentas() {

    const path = usePathname()

    const buttons = [
        {name:"Empresas", href:"/empresas", Icon:BuildingOfficeIcon, error: false},
        {name:"Itemes", href:"/itemes", Icon: CubeIcon },
        {name:"Tipos de documentos", href:"/documentos", Icon: DocumentIcon },
        {name:"Grupos de cuentas", href:"/grupoCuentas", Icon: RectangleGroupIcon},
        {name:"Ruts", href:"/ruts", Icon:IdentificationIcon},
        {name:"Glosas de Pagos", href:"/glosaspagos", Icon:DocumentIcon},
        {name:"Cuentas", href:"/cuentas", Icon:BookOpenIcon},   
        {name:"Códigos financieros", href:"/codfinancieros", Icon:ChartPieIcon },
        {name:"Sucursales", href:"/sucursales", Icon:BuildingStorefrontIcon },
        {name:"Centros de Costo", href:"/centrosdecosto", Icon:BuildingOffice2Icon},
        {name:"Codigos de flujos", href:"/flujos", Icon:ChartBarSquareIcon},
        {name:"Clasificación IFRS", href:"/ifrs", Icon:PresentationChartLineIcon},
        {name:"Proyectos", href:"/proyectos", Icon:PresentationChartBarIcon},
        {name:"Códigos CP", href:"/codigoscp", Icon:KeyIcon},
        {name:"Bancos", href:"/bancos", Icon:BanknotesIcon}
    ]
        return (       
        <section>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((item, index) => (
            <div className="md:mx-10 lg:mx-14" key={index}>
                <MenuButton 
                    name={item.name}
                    href={path + item.href}
                    Icon = {item.Icon}
                    error= {item.error ? true : false}
                />
            </div>
                ))}
        </div>
        </section>

        )
    }