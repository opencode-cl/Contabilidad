import { API_CONTABILIDAD } from "@/variablesglobales"
import { useEffect, useState, useContext } from "react"
import DataTable from "react-data-table-component"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import Modal from "@/componentes/Utils/Modal"
import { CLASS_MODAL } from "@/globals/CSSClasses"
import { TrashIcon } from "@heroicons/react/24/solid"
import { CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import TableSelector from "@/componentes/Utils/TableSelector"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"

interface AsignacionEmpresasProps {
    codigoUsuario: string
    empresas: []
}

const AsignacionEmpresas: React.FC<AsignacionEmpresasProps> = ({ codigoUsuario, empresas }) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const {theme} = useContext(ThemeContext);

    const [dataAsignacion, setDataAsignacion] = useState([])
    const [selectedRow, setSelectedRow] = useState({})

    const [isDeleteModal, setDeleteModal] = useState(false)
    const [isEmpresaSelectorModal, setEmpresaSelectorModal] = useState(false)

    useEffect(() =>{
        fetch(API_CONTABILIDAD+ "/Usuarios/empresas/"+codigoUsuario, { headers: getHeaders() })
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setDataAsignacion(data)
        })
    }, [])

    const columns = [
        { id: 'codigo',
        name: 'Código', 
        width:"6rem",
        sortable:true,
        selector:(row:any) => row.empresa, },
      { name: 'Nombre', 
        selector:(row:any) => row.nempresa,
        wrap: true},{ name:"Eliminar", 
        width:"5rem",
        center:true,
        cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedRow(dataAsignacion.find(item => item['referencia'] === row.referencia))
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ]

    const tableSelectorColumns = [
        { id: 'codigo',
        name: 'Código', 
        width:"6rem",
        sortable:true,
        selector:(row:any) => row.referencia, },
      { name: 'Nombre', 
        selector:(row:any) => row.nombre,
        wrap: true}
    ]

    const handleDelete = async (referencia:number) => {
        const requestOptions = {
            method: "DELETE",
            headers: getHeaders()
          };
    
          const response = await fetch(API_CONTABILIDAD + "/Usuarios/empresas/" + referencia, requestOptions);
    
          if(!response.ok){
            handleError()
          }else{
            handleSuccess()
            setDataAsignacion(dataAsignacion.filter(item => item["referencia"] !== referencia))
          }      
          setDeleteModal(false);
    }

    const handleSelect = async (empresa:{referencia:number, nombre:string}) => {

        const newObject = {
            codigo: codigoUsuario,
            empresa: empresa.referencia,
            nempresa: empresa.nombre
        }
        
        const newData = dataAsignacion.concat(newObject)
        setDataAsignacion(newData)

        const requestOptions = {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(newObject)
        };
  
      const response = await fetch(API_CONTABILIDAD + "/Usuarios/Empresas/", requestOptions)
  
      if(!response.ok){
        handleError()
      }else{
        handleSuccess()
      }

        setEmpresaSelectorModal(false)
    }

    const handleError = () =>{
    }

    const handleSuccess = () => {
    }

    return(
        <section>

            <div className="flex flex-row-reverse">
            <button onClick={()=>{
                setEmpresaSelectorModal(true)
              }} className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto">
              <PlusIcon className="w-6 h-6"/>
            </button>
            </div>

            <DataTable 
                columns={columns}
                data={dataAsignacion}
                theme={theme}
            />

            {isDeleteModal && <Modal title="¡Alerta!" width={CLASS_MODAL} type="error" onConfirm={() => handleDelete(selectedRow.referencia)} onClose={() => setDeleteModal(false)} menu>
                <span>¿Desea eliminar la empresa {selectedRow.empresa}?</span>
            </Modal>}

            {isEmpresaSelectorModal && 
                <Modal title="Agregar Empresa" width={CLASS_MODAL} type="info" onClose={() => setEmpresaSelectorModal(false)} menu>
                    <TableSelector data={empresas} columns={tableSelectorColumns} onSelect={handleSelect}/>
                </Modal>
            }

        </section>
    )
}

export default AsignacionEmpresas;