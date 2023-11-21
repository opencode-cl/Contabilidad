"use client"
import Button from "@/componentes/Utils/Button"
import { useState, useContext, useEffect } from "react"
import DataTable, { TableColumn, ExpanderComponentProps } from "react-data-table-component"
import { gridStyle, gridStyleBold } from "@/globals/tableStyles"
import axios from "axios"
import { API_CONTABILIDAD, SESSION_NAMES } from "@/variablesglobales"
import secureLocalStorage from "react-secure-storage"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import Input from "@/componentes/Utils/Input"
import CuentaSelector from "@/componentes/Utils/contabilidad/cuentaSelector"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"

const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {
    
  data.cuentas.push(data.totalCuentas)
  
  return (
      <DataTable
      columns = {itemsColumns}
      data={data.cuentas}
      customStyles={gridStyle}
      dense
      />
    )
};

const itemsColumns:TableColumn<any>[] = [
  { 
  name: 'Cuenta', 
  selector:(row) => row.nCuenta
  },
  { 
    name: 'Enero', 
    selector:(row) => row.saldo01,
    right:true,
    format:(row) => row.saldo01 < 0 ? <p className="text-red-700">{row.saldo01.toLocaleString()}</p> : row.saldo01.toLocaleString(),
  },
  { 
    name: 'Febrero', 
    selector:(row) => row.saldo02,
    right:true,
    format:(row) => row.saldo02 < 0 ? <p className="text-red-700">{row.saldo02.toLocaleString()}</p> : row.saldo02.toLocaleString(),
  },
  { 
    name: 'Marzo', 
    selector:(row) => row.saldo03,
    right:true,
    format:(row) => row.saldo03 < 0 ? <p className="text-red-700">{row.saldo03.toLocaleString()}</p> : row.saldo03.toLocaleString(),
  },
  { 
    name: 'Abril', 
    selector:(row) => row.saldo04,
    right:true,
    format:(row) => row.saldo04 < 0 ? <p className="text-red-700">{row.saldo04.toLocaleString()}</p> : row.saldo04.toLocaleString(),
  },
  { 
    name: 'Mayo', 
    selector:(row) => row.saldo05,
    right:true,
    format:(row) => row.saldo05 < 0 ? <p className="text-red-700">{row.saldo05.toLocaleString()}</p> : row.saldo05.toLocaleString(),
  },
  { 
    name: 'Junio', 
    selector:(row) => row.saldo06,
    right:true,
    format:(row) => row.saldo06 < 0 ? <p className="text-red-700">{row.saldo06.toLocaleString()}</p> : row.saldo06.toLocaleString(),
  },
  { 
    name: 'Julio', 
    selector:(row) => row.saldo07,
    right:true,
    format:(row) => row.saldo07 < 0 ? <p className="text-red-700">{row.saldo07.toLocaleString()}</p> : row.saldo07.toLocaleString(),
  },
  { 
    name: 'Agosto', 
    selector:(row) => row.saldo08,
    right:true,
    format:(row) => row.saldo08 < 0 ? <p className="text-red-700">{row.saldo08.toLocaleString()}</p> : row.saldo08.toLocaleString(),
  },
  { 
    name: 'Septiembre', 
    selector:(row) => row.saldo09,
    right:true,
    format:(row) => row.saldo09 < 0 ? <p className="text-red-700">{row.saldo09.toLocaleString()}</p> : row.saldo09.toLocaleString(),
  },
  { 
    name: 'Octubre', 
    selector:(row) => row.saldo10,
    right:true,
    format:(row) => row.saldo10 < 0 ? <p className="text-red-700">{row.saldo10.toLocaleString()}</p> : row.saldo10.toLocaleString(),
  },
  { 
    name: 'Noviembre', 
    selector:(row) => row.saldo11,
    right:true,
    format:(row) => row.saldo11 < 0 ? <p className="text-red-700">{row.saldo11.toLocaleString()}</p> : row.saldo11.toLocaleString(),
  },
  { 
    name: 'Diciembre', 
    selector:(row) => row.saldo12,
    right:true,
    format:(row) => row.saldo12 < 0 ? <p className="text-red-700">{row.saldo12.toLocaleString()}</p> : row.saldo12.toLocaleString(),
  },

]

export default function saldosMensualesCuenta() {

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const {theme} = useContext(ThemeContext)

    const [cuentaInicio, setCuentaInicio] = useState(0);     
    const [cuentaFinal, setCuentaFinal] = useState(9999);
    const [mes, setMes] = useState(1);

    const [dataSaldos, setDataSaldos] = useState<any[]>([]);

    const [isCuentaSelectorVisible, setCuentaSelectorVisible] = useState(false)
    const [cuentas, setCuentas] = useState([])

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

    const handleSubmit = () =>{

        const params = {
            empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
            periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
            cuentai: cuentaInicio,
            cuentaf: cuentaFinal,
            mes: mes
          };
      
          axios
            .get(API_CONTABILIDAD + "/SaldosMensualesCuenta", { params: params, headers: getHeaders() })
            .then((response) => {

              const groupedData = Object.values(response.data.reduce((result:any, currentItem:any) => {
                const groupId = currentItem.grupo;
                
                if (!result[groupId]) {
                    result[groupId] = {
                        grupo: groupId,
                        nGrupo: currentItem.nGrupo,
                        cuentas: [],
                        totalCuentas: {
                        nCuenta:"TOTAL",
                        saldo01: 0,
                        saldo02: 0,
                        saldo03: 0,
                        saldo04: 0,
                        saldo05: 0,
                        saldo06: 0,
                        saldo07: 0,
                        saldo08: 0,
                        saldo09: 0,
                        saldo10: 0,
                        saldo11: 0,
                        saldo12: 0,
                        saldoTotal: 0
                      }
                    };
                }
                
                result[groupId].cuentas.push(currentItem);
                result[groupId].totalCuentas.saldo01 += currentItem.saldo01;
                result[groupId].totalCuentas.saldo02 += currentItem.saldo02;
                result[groupId].totalCuentas.saldo03 += currentItem.saldo03;
                result[groupId].totalCuentas.saldo04 += currentItem.saldo04;
                result[groupId].totalCuentas.saldo05 += currentItem.saldo05;
                result[groupId].totalCuentas.saldo06 += currentItem.saldo06;
                result[groupId].totalCuentas.saldo07 += currentItem.saldo07;
                result[groupId].totalCuentas.saldo08 += currentItem.saldo08;
                result[groupId].totalCuentas.saldo09 += currentItem.saldo09;
                result[groupId].totalCuentas.saldo10 += currentItem.saldo10;
                result[groupId].totalCuentas.saldo11 += currentItem.saldo11;
                result[groupId].totalCuentas.saldo12 += currentItem.saldo12;
                result[groupId].totalCuentas.saldoTotal += currentItem.saldoTotal;
                
                return result;
            }, {}))

              console.log(groupedData)
              setDataSaldos(groupedData);
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

    const columnsSaldo:TableColumn<any>[] = [
        { 
        id: 'grupo',
        name: 'Grupo', 
        sortable:true,
        selector:(row) => row.grupo,
        width: "6rem"
      },
      { 
        id: 'nGrupo',
        name: 'Nombre', 
        selector:(row) => row.nGrupo
      },

    ]

     return (       
        <section>
            <h1 className="text-xl dark:text-white">Saldos Mensuales por Cuenta</h1>
            
            <div className="flex gap-2 items-end">

              <Input type="number" label="Cuenta inicio" name="cuentaInicio" value={cuentaInicio} onChange={(e)=> setCuentaInicio(Number(e.target.value))} />
              <Input type="number" label="Cuenta Final" name="cuentaInicio" value={cuentaFinal} onChange={(e)=> setCuentaFinal(Number(e.target.value))} />
              <Input type="number" label="Mes" name="mes" value={mes} onChange={(e)=> setMes(Number(e.target.value))} />

                <Button text="Enviar" onClick={handleSubmit}/>
                <Button text="Cuentas" onClick={()=>setCuentaSelectorVisible(true)} />
            </div>

            <DataTable 
                columns={columnsSaldo}
                data = {dataSaldos}
                customStyles={gridStyleBold}
                dense
                expandableRows 
                expandableRowsComponent={ExpandedComponent}
                className="mt-2"
                theme = {theme}
            />

        {isCuentaSelectorVisible && <CuentaSelector handleSelect={handleCuentaSelect} cuentas={cuentas} onClose={() => setCuentaSelectorVisible(!isCuentaSelectorVisible)}/>}

        </section>
    )
}