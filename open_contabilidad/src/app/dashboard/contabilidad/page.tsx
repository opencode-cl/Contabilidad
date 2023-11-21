"use client"
import MenuButton from "@/componentes/Utils/MenuButton"
import { CubeIcon, DocumentIcon, IdentificationIcon, RectangleGroupIcon, BookOpenIcon, BuildingStorefrontIcon, BuildingOfficeIcon, ClipboardDocumentCheckIcon, PresentationChartBarIcon, ChartPieIcon, ChartBarSquareIcon, PresentationChartLineIcon, BuildingOffice2Icon, KeyIcon, BanknotesIcon, DocumentTextIcon, ArrowDownOnSquareStackIcon } from "@heroicons/react/24/solid"
import { usePathname } from "next/navigation"

export default function Contabilidad() {

const path = usePathname()

const buttons = [
    {name:"Ingreso de comprobantes contables", href:"/comprobantesContables", Icon:ArrowDownOnSquareStackIcon, error: false},
    {name:"Balance de 8 Columnas", href:"/balance/8columnas", Icon: CubeIcon },
    {name:"Lista Estado de resultados corporativo", href:"/estadoResultados/Corporativo", Icon: DocumentIcon },
    {name:"Libro Diario", href:"/libroDiario", Icon: BookOpenIcon},
    {name:"Balance de 8 Columnas Clasificado", href:"/balance/8ColumnasClasificado", Icon:IdentificationIcon},
    {name:"Estado de Resultados mes/acumulado", href:"/estadoResultados/mesAcumulado", Icon:DocumentIcon},
    {name:"Libro Mayor", href:"/libro/mayor", Icon:BookOpenIcon},
    {name:"Genera Comprobante de Apertura", href:"/comprobanteApertura", Icon:DocumentIcon},
    {name:"Estado de Resultados mensuales", href:"/estadoResultados/Mensuales", Icon:DocumentIcon},
    {name:"Saldos Mensuales por Cuenta", href:"/saldosMensualesCuenta", Icon:DocumentTextIcon},   
    {name:"Balance Clasificado", href:"/balance/Clasificado", Icon:ChartPieIcon },
    {name:"Balance Auxiliar Clasificado", href:"/balance/auxiliarClasificado", Icon:BuildingStorefrontIcon },
    {name:"Libro inventario y balance", href:"/libro/InventarioBalance", Icon:BuildingOffice2Icon},
    {name:"Balance Clasificado Comparativo", href:"/balance/clasificadoComparativo", Icon:BuildingStorefrontIcon },
    {name:"Balance de comprobación y saldos", href:"/balance/comprobacionSaldos", Icon:BuildingStorefrontIcon },
    {name:"Libro mayor esquematico", href:"/libro/mayorEsquematico", Icon:BuildingStorefrontIcon },
    {name:"Estado de Resultados", href:"/estadoResultados", Icon:BuildingStorefrontIcon },
    {name:"Resumen Mensual Impuestos", href:"/resumenMensualImpuestos", Icon:BuildingStorefrontIcon },
    {name:"Balance Clasificado IFRS", href:"/balance/clasificadoIFRS", Icon:BuildingStorefrontIcon },
    {name:"Estado de Resultados IFRS", href:"/estadoResultados/IFRS", Icon:BuildingStorefrontIcon },
    {name:"Estado de Flujo de Efectivo", href:"/estadoFlujoEfectivo", Icon:BuildingStorefrontIcon },
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