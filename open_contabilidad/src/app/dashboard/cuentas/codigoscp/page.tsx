"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext} from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormGrupoCuentas from "./FormCodigosCP";
import { ICodigoCP } from "@/interfaces/ICodigoCP";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import FormCodigosCP from "./FormCodigosCP";
import {PlusIcon} from "@heroicons/react/24/solid";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function CodigosCP(){

   const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
   const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ICodigoCP[]>([])

    const [empresa, setEmpresa] = useState(0)

    const [selectedId, setSelectedId] = useState(0)
    const [codigoCp, setCodigoCP] = useState<ICodigoCP>({referencia: 0, codigo:0, nombre: ""});
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      var codigoEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      setEmpresa(JSON.parse(String(codigoEmpresa)))

      fetch(API_CONTABILIDAD + "/CodigosCP/empresa/" + JSON.parse(String(codigoEmpresa)), {headers: getHeaders()})
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }, [])

    const columns = [
      { id: 'codigo',
        name: 'Código',
        sortable: true, 
        width:"5rem", 
        selector:(row:any) => row.codigo,
        format: (row:any) => formatNumber(row.codigo) },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true },
      { name:"Editar", width:"5rem",
        center:true,
        cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setCodigoCP(data.find(item => item['referencia'] === row.referencia) as ICodigoCP)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className="h-4 w-4 md:w-6 md:h-6"/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", 
        center: true,
        cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setCodigoCP(data.find(item => item['referencia'] === row.referencia) as ICodigoCP)
          setDeleteModal(true);
         }}>
          <TrashIcon className="h-4 w-4 md:w-6 md:h-6"/>
        </button>
      )}
    ];

    const handleDelete = async (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/CodigosCP/" + referencia, requestOptions);
      if(!response.ok){
        setToasts([...toasts, defaultDangerToast])
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts, defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:ICodigoCP) =>{

      if(type === CREATE_ACTION){
        const newData = data.concat(object)
        setData(newData)
        setToasts([...toasts, defaultSuccessToast])
      }

      else if (type === UPDATE_ACTION){
        setData(data.map(obj => {
          if(obj["referencia"] === object.referencia){
            obj = object
          }
          setToasts([...toasts, defaultSuccessToast])
          return obj;
        }))
      }

      setEditModal(false)
    }

    const handleError = (message:string = "") =>{

      message === "" ? 
        setToasts([...toasts, defaultDangerToast]) :
        setToasts([...toasts, dangerToast(message)])
    }

    return(
        <div>
            <div className="flex pr-5">
              <h1 className="text-xl dark:text-white">Códigos CP</h1>
              <button onClick={()=>{
                setOption(CREATE_ACTION)
                setEditModal(true)
              }} className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto">
              <PlusIcon className="w-6 h-6"/>
            </button>
            </div>

            <DataTable
              columns={columns}
              data={data}
              pagination
              striped
              defaultSortFieldId={"codigo"}
              theme={theme}
            />

            {editModal && 
              <Modal 
                     title={option ===CREATE_ACTION ? "Nuevo CódigoCP": "Editar CódigoCP"} 
                     type="info"
                     width="w-3/4 md:w-1/3"
                     onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormCodigosCP onFormSubmit={handleSubmit} type={CREATE_ACTION} empresa={empresa} onError={handleError} codigosList={data.map(item=>item.codigo)}/>
                : <FormCodigosCP onFormSubmit={handleSubmit} type={UPDATE_ACTION} CodigosCP={codigoCp} empresa={empresa} onError={handleError} codigosList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && 
              <Modal title="¡Alerta!"
                     type="error" 
                     width="w-3/4 md:w-1/3"
                     onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{codigoCp.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts} />
        </div>
    )

}