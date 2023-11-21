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
      data={data.lineasMensuales}
      customStyles={gridStyle}
      dense/>
      
    )
};

const itemsColumns:TableColumn<any>[] = [
  { 
    name: 'Mes', 
    selector:(row) => row.mes
  },
  { 
  name: 'Débito',
  right:true, 
  selector:(row) => row.debito,
  format: (row) => row.debito.toLocaleString()
  },
  { 
    name: 'Crédito',
    right:true, 
    selector:(row) => row.credito,
    format: (row) => row.credito.toLocaleString()
  },
  { 
    name: 'Saldo',
    right:true, 
    selector:(row) => row.saldo,
    format:(row) => row.saldo < 0 ? <p className="text-red-700">{row.saldo.toLocaleString()}</p> : row.saldo.toLocaleString()
  },

]

export default function libroMayorEsquematico() {

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext)

    const [cuentaInicio, setCuentaInicio] = useState(0);
    const [cuentaFinal, setCuentaFinal] = useState(0);
    const [mes, setMes] = useState(0);

    const [dataLibroMayorEsquematico, setDataLibroMayorEsquematico] = useState([]);

    const handleSubmitParams = () =>{
        const params = {
            empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
            periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
            cuentaInicial: cuentaInicio,
            cuentaFinal: cuentaFinal,
            mes: mes
          };
      
          axios
            .get(API_CONTABILIDAD + "/LibroMayorEsquematico", { params: params, headers: getHeaders() })
            .then((response) => {

              setDataLibroMayorEsquematico(response.data); 

            })
            .catch((err) => {
              //// Handle any errors
            });
    }

    const columnsLibroMayorEsquematico:TableColumn<any>[] = [
        { 
        id: 'codigo',
        name: 'Codigo', 
        sortable:true,
        selector:(row) => row.codigo
      },
      { 
        id: 'nombre',
        name: 'Nombre', 
        sortable:true,
        selector:(row) => row.nombre
      },

    ]

     return (       
        <section>
            <h1 className="dark:text-white">Libro Mayor Esquemático</h1>
            
            <div className="flex gap-2">
                <input type="number" value={cuentaInicio} onChange={(e) => setCuentaInicio(Number(e.target.value))}/>
                <input type="number" value={cuentaFinal} onChange={(e) => setCuentaFinal(Number(e.target.value))}/>
                <input type="number" name="mes" value={mes} onChange={(e) => setMes(Number(e.target.value))}/>
                <Button text="Enviar" onClick={handleSubmitParams}/>
            </div>

            <DataTable 
                columns={columnsLibroMayorEsquematico}
                data = {dataLibroMayorEsquematico}
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