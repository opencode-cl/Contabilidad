"use client"
import Button from "@/componentes/Utils/Button"
import { useState, useContext, useEffect } from "react"
import DataTable, { TableColumn, ExpanderComponentProps } from "react-data-table-component"
import { gridStyle } from "@/globals/tableStyles"
import axios from "axios"
import { API_CONTABILIDAD, SESSION_NAMES } from "@/variablesglobales"
import secureLocalStorage from "react-secure-storage"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import { IBalance8Columnas } from "@/interfaces/IBalance8Columnas"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"


export default function balance8Columnas() {

    function getDate() {
      const periodo =Number(String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, '')); 
      const mes = Number(String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH))!.replace(/"/g, '')); 
      const lastDayOfMonth = new Date(Number(periodo), Number(mes), 0);
      const year = lastDayOfMonth.getFullYear();
      const month = lastDayOfMonth.getMonth() + 1; 
      const day=lastDayOfMonth.getDate();
      const fecha = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
      return fecha;
    }
    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext)

    const [empresa_name, setEmpresa_name] = useState("");
    const [fechaCorte, setFechaCorte] = useState(getDate());
    const [acumulado, setAcumulado] = useState(false);
    const [dataBalance8Columnas, setDataBalance8Columnas] = useState([]);
    
    useEffect(() =>{
      setEmpresa_name(String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_NAME))!.replace(/"/g, ''));
    }),[];

    const handleSubmitParams = () =>{
        const params = {
            empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
            periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
            fechaCorte: fechaCorte,
            acumulado: acumulado,
          };
      
          axios
            .get(API_CONTABILIDAD + "/Balance8Columnas", { params: params, headers: getHeaders() })
            .then((response) => {

              setDataBalance8Columnas(response.data); 

            })
            .catch((err) => {
              //// Handle any errors
            });
    }

    const columnsBalance8Columnas:TableColumn<IBalance8Columnas>[] = [
        { 
        id: 'cuenta',
        name: 'Cuenta', 
        sortable:true,
        selector:(row) => row.cuenta
      },        { 
        id: 'codigocp',
        name: 'CodigoCp', 
        sortable:true,
        selector:(row) => row.codigocp
      },
      { 
        id: 'nombre',
        name: 'Nombre', 
        sortable:true,
        selector:(row) => row.nombre
      },        { 
        id: 'debitos',
        name: 'Debitos', 
        right:true,
        selector:(row) => row.debitos,
        format:(row) => row.debitos.toLocaleString()
      },        { 
        id: 'creditos',
        name: 'Créditos', 
        right:true,
        selector:(row) => row.creditos,
        format:(row)=> row.creditos.toLocaleString()
      },{ 
        id: 'deudor',
        name: 'Deudor', 
        right:true,
        selector:(row) => row.deudor,
        format:(row)=>row.deudor.toLocaleString()
      },{ 
        id: 'acreedor',
        name: 'Acreedor', 
        right:true,
        selector:(row) => row.acreedor,
        format:(row)=> row.acreedor.toLocaleString()
      },{ 
        id: 'activos',
        name: 'Activos', 
        right:true,
        selector:(row) => row.activos,
        format:(row)=> row.activos.toLocaleString()
      },{ 
        id: 'pasivos',
        name: 'Pasivos', 
        right:true,
        selector:(row) => row.pasivos,
        format:(row)=> row.pasivos.toLocaleString()
      },{ 
        id: 'perdida',
        name: 'Pérdida', 
        right:true,
        selector:(row) => row.perdida,
        format:(row)=> row.perdida.toLocaleString()
      },{ 
        id: 'ganancia',
        name: 'Ganancia', 
        right:true,
        selector:(row) => row.ganancia,
        format:(row)=>row.ganancia.toLocaleString()
      },

    ]

     return (       
        <section>
            <h1 className="dark:text-white text-xl mb-4">Balance 8 Columnas dentro de la empresa {empresa_name}</h1>
            
            <div className="flex my-4 items-center gap-2">
                  <label className=" ml-4 dark:text-white text-gray-700 text-l font-bold" htmlFor="fechares">
                    Fecha de Corte
                  </label>

                  <input
                    type="date"
                    placeholder="2018-01-01"
                    className="mr-5 border shadow px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="fechares"
                    value={fechaCorte}
                    onChange={(e) => setFechaCorte(e.target.value)}
                  />

                  <label className="dark:text-white text-gray-700 text-l font-bold" htmlFor="acumulado">
                    Acumulado
                  </label>
                  <input
                    type="checkbox"
                    id="acumulado"
                    className="mr-5 w-5 h-5"
                    checked={acumulado}
                    onChange={() => setAcumulado(!acumulado)}
                  />

                <Button text="Enviar" onClick={handleSubmitParams}/>
            </div>

            <DataTable 
                columns={columnsBalance8Columnas}
                data = {dataBalance8Columnas}
                customStyles={gridStyle}
                dense
                className="mt-2"
                theme = {theme}
            />

        </section>
    )
}