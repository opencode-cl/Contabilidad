"use client"
import MenuButton from "@/componentes/Utils/MenuButton"
import ComprobantesContables from "@/componentes/Utils/contabilidad/comprobantesContables"
import { CubeIcon, DocumentIcon, IdentificationIcon, RectangleGroupIcon, BookOpenIcon, BuildingStorefrontIcon, BuildingOfficeIcon, ClipboardDocumentCheckIcon, PresentationChartBarIcon, ChartPieIcon, ChartBarSquareIcon, PresentationChartLineIcon, BuildingOffice2Icon, KeyIcon, BanknotesIcon } from "@heroicons/react/24/solid"
import { usePathname } from "next/navigation"

export default function comprobantesContables() {

    return (       
        <section>
            <ComprobantesContables />
        </section>
    )
}