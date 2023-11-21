"use client"
import Button from "@/componentes/Utils/Button"
import { useState, useContext, useEffect } from "react"
import DataTable, { TableColumn, ExpanderComponentProps } from "react-data-table-component"
import { gridStyle } from "@/globals/tableStyles"
import LibroDiario from "@/interfaces/ILibroDiario"
import axios from "axios"
import { API_CONTABILIDAD, SESSION_NAMES } from "@/variablesglobales"
import secureLocalStorage from "react-secure-storage"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import CuentaSelector from "@/componentes/Utils/contabilidad/cuentaSelector"
import { createDarkTheme } from "@/globals/tableThemes"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"
import { createTheme } from "react-data-table-component"

const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    return (
      <DataTable
      columns = {itemsColumns}
      data={data.lineas}
      customStyles={gridStyle}
      dense/>
      
    )
};

const itemsColumns:TableColumn<any>[] = [
  { 
  name: 'Tipo', 
  selector:(row) => row.tipo
  },
  { 
    name: 'Folios', 
    selector:(row) => row.folio
  },
  { 
    name: 'Fecha', 
    selector:(row) => row.fecha.split("T")[0]
  },
  { 
    name: 'Glosa', 
    selector:(row) => row.glosa
  },
  { 
    name: 'Auxiliar', 
    selector:(row) => row.rut
  },
  { 
    name: 'Nombre', 
    selector:(row) => row.nombre !== null ? row.nombre : ""
  },
  { 
    name: 'N°Doc', 
    selector:(row) => row.nodoc
  },  { 
    name: 'Fedoc', 
    selector:(row) => row.fedoc.split("T")[0]
  },  { 
    name: 'Debe', 
    selector:(row) => row.debe.toLocaleString(),
    right:true
  },  { 
    name: 'Haber', 
    selector:(row) => row.haber.toLocaleString(),
    right:true
  },  { 
    name: 'Saldo', 
    selector:(row) => row.saldo,
    format:(row) => row.saldo < 0 ? <p className="text-red-700">{row.saldo.toLocaleString()}</p> : row.saldo.toLocaleString(),
    right:true
  },
  { 
    name: 'Vencim', 
    selector:(row) => row.feven.split("T")[0]
  },

]

export default function libroMayor() {

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const {theme} = useContext(ThemeContext);

    const [fechaInicio, setFechaInicio] = useState("");     
    const [fechaFinal, setFechaFinal] = useState("");

    const [cuentaInicio, setCuentaInicio] = useState(0);
    const [cuentaFinal, setCuentaFinal] = useState(0);

    const [dataLibroMayor, setDataLibroMayor] = useState([]);

    const [cuentas, setCuentas] = useState([]);

    const [isCuentaSelectorVisible, setCuentaSelectorVisible] = useState(false);

    useEffect(() => {
      axios
      .get(API_CONTABILIDAD + "/Cuentas/resumen", { headers: getHeaders() })
      .then((response) => {
        console.log(response.data)
        setCuentas(response.data); // Handle the response data
      })
      .catch((err) => {
        //// Handle any errors
      });
    }, [])
    

    const handleSubmitDates = () =>{
        const params = {
            empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
            periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
            fechaInicio: fechaInicio,
            fechaFinal: fechaFinal,
            cuentaInicio: cuentaInicio,
            cuentaFinal: cuentaFinal,
            IFRS: false
          };
      
          axios
            .get(API_CONTABILIDAD + "/LibroMayor", { params: params, headers: getHeaders() })
            .then((response) => {

              const data = response.data;

              data.forEach((item:any) => {
                // Calcular el saldo inicial para este objeto
                const saldoInicial = item.cuenta.debitos - item.cuenta.creditos;
              
                // Recorrer las líneas y calcular el saldo para cada una
                item.lineas.forEach((linea:any, index:any) => {
                  if (index === 0) {
                    // La primera línea utiliza el saldo inicial
                    linea.saldo = saldoInicial + linea.debe - linea.haber;
                  } else {
                    // Las líneas siguientes utilizan el saldo de la línea anterior
                    linea.saldo = item.lineas[index - 1].saldo + linea.debe - linea.haber;
                  }
                });
              });

              setDataLibroMayor(data); // Handle the response data
            })
            .catch((err) => {
              //// Handle any errors
            });
    }

    const handleCuentaSelect = (selected:{referencia:number, codigo:number, nombre:string}) =>{
      setCuentaInicio(selected.codigo)
      setCuentaFinal(selected.codigo)
      setCuentaSelectorVisible(false)
    }

    const columnsLibroDiario:TableColumn<any>[] = [
        { 
        id: 'codigo',
        name: 'Codigo', 
        sortable:true,
        selector:(row) => row.cuenta.codigo
      },
      { 
        id: 'nombre',
        name: 'Nombre', 
        sortable:true,
        selector:(row) => row.cuenta.nombre
      },
      { 
        id: 'debitos',
        name: 'Débitos', 
        sortable:true,
        selector:(row) => row.cuenta.debitos.toLocaleString(),
        right:true
      },      { 
        id: 'creditos',
        name: 'Créditos', 
        sortable:true,
        selector:(row) => row.cuenta.creditos.toLocaleString(),
        right:true
      },
      { 
        id: 'saldo',
        name: 'Saldo', 
        sortable:true,
        selector:(row) => (row.cuenta.debitos - row.cuenta.creditos).toLocaleString(),
        right:true
    },

    ]

     return (       
        <section>
            <h1 className="dark:text-white">Libro Mayor</h1>
            
            <div className="flex gap-2">
                <input type="date" onChange={(e) => setFechaInicio(e.target.value)}/>
                <input type="date" onChange={(e) => setFechaFinal(e.target.value)}/>
                <input type="number" value={cuentaInicio} onChange={(e) => setCuentaInicio(Number(e.target.value))}/>
                <input type="number" value={cuentaFinal} onChange={(e) => setCuentaFinal(Number(e.target.value))}/>
                <Button text="Enviar" onClick={handleSubmitDates}/>
                <Button text="Cuentas" onClick ={() => setCuentaSelectorVisible(true)}/>
            </div>

            <DataTable 
                columns={columnsLibroDiario}
                data = {dataLibroMayor}
                customStyles={gridStyle}
                dense
                expandableRows 
                expandableRowsComponent={ExpandedComponent}
                className="mt-2"
                theme={theme}
            />

            
{isCuentaSelectorVisible && <CuentaSelector handleSelect={handleCuentaSelect} cuentas={cuentas} onClose={() => setCuentaSelectorVisible(!isCuentaSelectorVisible)}/>}
        </section>
    )
}