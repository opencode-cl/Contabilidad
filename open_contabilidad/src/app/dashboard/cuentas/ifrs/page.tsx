"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormIFRS from "./FormIFRS";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

interface IIFRS{
  referencia: number;
  codigo: number;
  nombre: string;
}

export default function IFRS(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IIFRS[]>([])

    const [isLoading, setLoading] = useState(true)

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [selectedId, setSelectedId] = useState(0)
    const [codigo, setCodigo] = useState<IIFRS>({referencia: 0, codigo: 0, nombre: ""});
    const [option, setOption] = useState("")

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      fetch(API_CONTABILIDAD + "/IFRS/", {headers: getHeaders()})
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
        selector:(row:any) => row.codigo,
        sortable:true,
        width:"6rem",
        format: (row:any) => formatNumber(row.codigo)
      },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap: true },
      { name:"Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption("edit")
          setCodigo(data.find(item => item['referencia'] === row.referencia) as IIFRS)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setCodigo(data.find(item => item['referencia'] === row.referencia) as IIFRS)
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = async (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/IFRS/" + referencia, requestOptions);
      
      if(!response.ok){
        setToasts([...toasts, defaultDangerToast])
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts, defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IIFRS) =>{
      if(type === CREATE_ACTION){
        const newData = data.concat(object)
        setData(newData)
      }

      else if (type === UPDATE_ACTION){
        setData(data.map(obj => {
          if(obj["referencia"] === object.referencia){
            obj = object
          }
          return obj;
        }))
      }
      setToasts([...toasts, defaultSuccessToast])
      setEditModal(false)
    }

    const handleError = (message:string = "") =>{
      message === "" ? 
        setToasts([...toasts, defaultDangerToast]) 
        : setToasts([...toasts, dangerToast(message)])
    }

    return(
        <div>
            <div className="flex pr-6">
              <h1 className="text-xl dark:text-white">IFRS</h1>
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
              theme = {theme}
            />

            {editModal && 
              <Modal 
                title={option ===CREATE_ACTION ? "Nuevo IFRS": "Editar IFRS N°"+codigo.codigo} 
                type="info" 
                width={CLASS_MODAL}
                onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormIFRS onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormIFRS onFormSubmit={handleSubmit} type={UPDATE_ACTION} IFRS={codigo} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && 
              <Modal title="¡Alerta!"
                     type="error" 
                     width={CLASS_MODAL}
                     onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{codigo.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )

}