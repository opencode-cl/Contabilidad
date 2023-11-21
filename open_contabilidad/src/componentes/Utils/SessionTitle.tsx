"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/24/solid";
import secureLocalStorage from "react-secure-storage";
import { SESSION_NAMES } from "@/variablesglobales";

const SessionTitle = () =>{

    const [empresaNombre, setEmpresaNombre] = useState("")
    const [year, setYear] = useState(0)
    const [month, setMonth] = useState(0)

    useEffect(()=>{
      var nombreEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_NAME);
      var periodoYear = secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR);
      var periodoMonth = secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH);
      setEmpresaNombre(nombreEmpresa !== null ? JSON.parse(String(nombreEmpresa)) : "");
      setYear(periodoYear !== null ? JSON.parse(String(periodoYear)): 0);
      setMonth(periodoMonth !== null ? JSON.parse(String(periodoMonth)): 0);
    },[])

    return(

            <p className="text-xs text-amber-800 dark:text-gray-300">
              <Link href="/dashboard/configuracion/parametros">
                <span className="flex"><UserIcon className="w-4 h-4"/> {empresaNombre}</span>
                <span>Periodo: {month + "-" + year}</span>
              </Link>
            </p>

    )

}

export default SessionTitle;