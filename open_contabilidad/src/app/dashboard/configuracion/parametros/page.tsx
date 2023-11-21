"use client"
import React from "react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_CONTABILIDAD } from "@/variablesglobales";
import Input from "@/componentes/Utils/Input";
import Select from "@/componentes/Utils/Select";
import secureLocalStorage from "react-secure-storage";
import { SESSION_NAMES } from "@/variablesglobales";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { Registro } from "@/interfaces/Registro";

interface IEmpresa{
  value: string | number;
  text: string;
}
export default function paramsConfiguracion(){

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const[empresasList, setEmpresasList] = useState<IEmpresa[]>([])
    const[empresa, setEmpresa] = useState(0)
    const[empresaNombre, setEmpresaNombre] = useState("")
    const[year, setYear] = useState<number | undefined>(undefined);
    const[month, setMonth] = useState<number | undefined>(undefined);


    useEffect(() => {
        const fetchData = async () => {
            try {
              const empresasResponse = await axios.get(`${API_CONTABILIDAD}/Empresas/`, {headers: getHeaders()});
             setEmpresasList(empresasResponse.data.map((item:any)=>{
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

    useEffect(() => {
      const getDataRegistro = async ()=> {
        try {
          const stringValue = secureLocalStorage.getItem(SESSION_NAMES.USER_NAME) as string;    
          const usuario= stringValue.replace(/^"(.*)"$/, '$1');
          const lastRegistroResponse = await axios.get(`${API_CONTABILIDAD}/Usuarios/lastRegistro/${usuario}`, { headers: getHeaders() });
          const lastRegistroData = lastRegistroResponse.data as Registro;
          
          setEmpresa(lastRegistroData.empresa); // O ajusta según cómo quieras mostrar el nombre de la empresa
          setYear(lastRegistroData.periodo);
          setMonth(lastRegistroData.mes);

          if (lastRegistroData.empresa!==0) {
            const c_empresa=empresasList.find(value => value.value === lastRegistroData.empresa);
            setEmpresaNombre(c_empresa?.text || "")
          }

        } catch (error) {
          console.error('Fetch lastRegistro error:', error);
        }
      }
      getDataRegistro();
      
     
    }, [empresasList])

    async function sendRequest(data:any){
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

    const handleSubmit = () =>{
      secureLocalStorage.setItem(SESSION_NAMES.EMPRESA_ID, JSON.stringify(empresa));
      secureLocalStorage.setItem(SESSION_NAMES.EMPRESA_NAME, JSON.stringify(empresaNombre));
      secureLocalStorage.setItem(SESSION_NAMES.PERIODO_YEAR, JSON.stringify(year));
      secureLocalStorage.setItem(SESSION_NAMES.PERIODO_MONTH, JSON.stringify(month));
    }

    return(
      <div>
                      <div className="">
                <h1 className="text-xl dark:text-white">Parámetros</h1>
              </div>
        <div className="px-80">
          <form onSubmit={handleSubmit}>

            <div className="mb-4">
              <Select 
                    name="Empresa"
                    options={empresasList}
                    label="Empresa"
                    title="Empresa"
                    error={false}
                    selected={empresasList.find(select => select.value === empresa)}
                    onChange={(e:any)=>{
                      setEmpresa(e.target.value)
                      setEmpresaNombre(e.target.selectedOptions[0].text)
                    }}
                />
            </div>
              
            <div className="grid grid-cols-2 gap-4">

              <div className="">              
              <Input 
                  type="number"
                  name="month"
                  label="Mes"
                  value={month}
                  onChange={(e:any) => setMonth(e.target.value)}
                  error={false}
                  required/>
              </div>

              <div className="">
              <Input 
                  type="number"
                  name="year"
                  label="Año"
                  value={year}
                  onChange={(e:any) => setYear(e.target.value)}
                  error={false}
                  required/>
              </div>
            </div>
            
              <div className="flex justify-end mt-4">
                <button onClick={sendRequest}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md">Guardar</button>
              </div>
             
    
              
              </form>
            </div>     
            </div>
    )
}