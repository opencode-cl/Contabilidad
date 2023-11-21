"use client"
import Button from "@/componentes/Utils/Button"
import { useState, useContext } from "react"
import DataTable, { TableColumn, ExpanderComponentProps } from "react-data-table-component"
import { gridStyle } from "@/globals/tableStyles"
import axios from "axios"
import { API_CONTABILIDAD, SESSION_NAMES } from "@/variablesglobales"
import secureLocalStorage from "react-secure-storage"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"

const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <DataTable
      columns = {itemsColumns}
      data={data.auxiliarGroups}
      customStyles={gridStyle}
      dense
      expandableRows 
      expandableRowsComponent={ExpandedComponentLineas}
      className="ml-12"
      />
      
    )
};

const ExpandedComponentLineas: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
  return (
    <DataTable
    columns = {lineasColumns}
    data={data.lineas}
    customStyles={gridStyle}
    dense
    />
    
  )
};

const itemsColumns:TableColumn<any>[] = [
  { 
  name: 'Rut', 
  selector:(row) => row.auxiliarCodigo
  },
  { 
    name: 'DV', 
    selector:(row) => row.auxiliarDV
  },
  { 
    name: 'Nombre', 
    selector:(row) => row.auxiliarNombre
  },

]

const lineasColumns:TableColumn<any>[] = [
  { 
  name: 'N° Doc', 
  selector:(row) => row.nodoc
  },
  { 
    name: 'Debe', 
    selector:(row) => row.debe
  },
  {
    name: 'Haber', 
    selector:(row) => row.haber
  }

]

export default function libroInventarioBalance() {

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext)

    const [fechaInicio, setFechaInicio] = useState("");     

    const [cuentaInicio, setCuentaInicio] = useState(0);
    const [cuentaFinal, setCuentaFinal] = useState(0);

    const [dataLibroInventarioBalance, setDataLibroInventarioBalance] = useState([]);

    const handleSubmitDates = () =>{
        const params = {
            empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
            periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
            fechaCorte: fechaInicio,
            cuentaInicio: cuentaInicio,
            cuentaFinal: cuentaFinal
          };
      
          axios
            .get(API_CONTABILIDAD + "/LibroInventarioBalance", { params: params, headers: getHeaders() })
            .then((response) => {

              const data = response.data;

              setDataLibroInventarioBalance(data); 
              console.log(data)// Handle the response data
            })
            .catch((err) => {
              //// Handle any errors
            });
    }

    const columnsLibroDiario:TableColumn<any>[] = [
        { 
        id: 'codigo',
        name: 'Codigo', 
        sortable:true,
        selector:(row) => row.cuentaCodigo
      },
      { 
        id: 'nombre',
        name: 'Nombre', 
        sortable:true,
        selector:(row) => row.cuentaNombre
      },

    ]

     return (       
        <section>
            <h1 className="dark:text-white text-xl">Libro Inventario y Balance</h1>
            
            <div className="flex gap-2">
                <input type="date" onChange={(e) => setFechaInicio(e.target.value)}/>
                <input type="number" value={cuentaInicio} onChange={(e) => setCuentaInicio(e.target.value)}/>
                <input type="number" value={cuentaFinal} onChange={(e) => setCuentaFinal(e.target.value)}/>
                <Button text="Enviar" onClick={handleSubmitDates}/>
            </div>

            <DataTable 
                columns={columnsLibroDiario}
                data = {dataLibroInventarioBalance}
                customStyles={gridStyle}
                dense
                expandableRows 
                expandableRowsComponent={ExpandedComponent}
                className="mt-2"
                theme = {theme}
            />

        </section>
    )
}