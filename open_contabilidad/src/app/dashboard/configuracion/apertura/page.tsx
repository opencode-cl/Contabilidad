"use client"
import React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_CONTABILIDAD } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import { SESSION_NAMES } from "@/variablesglobales";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { TrashIcon,DocumentMinusIcon, PencilSquareIcon } from '@heroicons/react/24/solid';
import { ThemeContext } from '@/componentes/Providers/darkModeContext';
import DataTable from 'react-data-table-component';


export default function aperturaConfiguracion(){

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const[empresa, setEmpresa] = useState(0)
    const[year, setYear] = useState<number | undefined>(undefined);
    const[month, setMonth] = useState<number | undefined>(undefined);
    const[periodos,setPeriodos] = useState([]);
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        const fetchData = async () => {
            try { // CAMBIAR A OBTENER TODOS LAS FECHAS DE APERTURA Y CIERRE 
              const empresasResponse = await axios.get(`${API_CONTABILIDAD}/Empresas/`, {headers: getHeaders()});
             setPeriodos(empresasResponse.data.map((item:any)=>{
                let newData ={
                  value: item.codigo,
                  text: item.nombre
                  }
                return(newData)
             }))
      
            } catch (error) {
              console.error('Fetch error:', error);
            }
          };
          
        fetchData();

    }, [])

    async function sendRequest(data:any){ // REALIZAR FUNCION PARA GUARDAR TODOS LAS APERTURAS Y CIERRES, HACER UNA FUNCION PARA MODIFICACION Y CREACION TODA EN UNA EN EL BACKEND
      const stringValue = secureLocalStorage.getItem(SESSION_NAMES.USER_NAME) as string; 
      const usuario= stringValue.replace(/^"(.*)"$/, '$1');
      const fechaActual = new Date();

      const registro={
          "equipo": "equipo web",
          "fecha": fechaActual,
          "usuario": usuario,
          "empresa": empresa,
          "sucursal": 0,
          "periodo": year,
          "mes": month,
          "menu": "Establecer perfil",
          "opcion": "?"  
      }
      const requestOptions = {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(registro) // Convert request data to JSON string if needed
        };
      
      try { 
          const response = await fetch(API_CONTABILIDAD + "/Usuarios/addRegistro", requestOptions)
          if(!response.ok){
              throw new Error("Error en la petición.")
          }
      }catch(error){
          throw error;
      }
      
  }

  const columns = [
    { id: 'periodo',
      name: 'Periodo', 
      width:"6rem",
      sortable:true,
      right: true,
      selector:(row:any) => row.periodo, },
    { 
      id:"mes",
      name: 'Mes', 
      right: true,
      selector:(row:any) => row.mes,
      wrap: true},
    { 
      id:"libros",
      name: 'Libros', 
      center:true,
      selector:(row:any) => row.libros, // Nose si sea libro puede ser tipo 
      wrap: true},
    { 
      id:"estado",
      name:"Estado", 
      width:"6rem",
      center:true,
        
    },
    { name:"Editar", 
      width:"5rem",
      center:true,
      cell: (row:any)=>(
      <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
      onClick={() => 
      {
        
      }}>
        <PencilSquareIcon className='w-4 h-4'/>
      </button>
    )},
    { name:"Eliminar", 
      width:"5rem",
      center:true,
      cell: (row:any)=>(
      <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
       onClick={()=>{
        
       }}>
        <TrashIcon className='w-4 h-4'/>
      </button>
    )}
  ];

    const handleSubmit = () =>{
      secureLocalStorage.setItem(SESSION_NAMES.EMPRESA_ID, JSON.stringify(empresa));
      secureLocalStorage.setItem(SESSION_NAMES.PERIODO_YEAR, JSON.stringify(year));
      secureLocalStorage.setItem(SESSION_NAMES.PERIODO_MONTH, JSON.stringify(month));
    }

    return(
      <div>
        <div className=" text-center">
            <h1 className="text-xl dark:text-white">Apertura y Cierre de Comprobantes contables</h1>
        </div>
        <div style={{ maxHeight: '300px', overflowY: 'scroll'  }}>
            <DataTable
              columns={columns}
              data={periodos}
              dense
              className='border dark:border-slate-900'
              theme={theme}
            />
          </div>   
      </div>  
    )
}