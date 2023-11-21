"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { ICentroDeCosto } from "@/interfaces/ICentroDeCosto";
import FormBanco from "./FormBancos";
import { IBanco } from "@/interfaces/IBanco";
import { formatNumber } from "@/variablesglobales";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Bancos(){

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ICentroDeCosto[]>([])

    const [selectedId, setSelectedId] = useState(0)
    const [banco, setBancos] = useState<IBanco>({referencia: 0, codigo:0, nombre: ""});
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      fetch(API_CONTABILIDAD + "/Bancos/", {headers: getHeaders()})
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
        width: '6rem',
        maxWidth: 'auto',
        selector:(row:any) => row.codigo,
        format: (row:any) => formatNumber(row.codigo) },
      { name: 'Nombre', 
      selector:(row:any) => row.nombre,
      wrap:true },
      { name:"Editar", 
        width:"5rem",
        center: true,
      cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-1.5 md:p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setBancos(data.find(item => item['referencia'] === row.referencia) as IBanco)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className="w-4 h-4 md:w-6 md:h-6"/>
        </button>
      )},
      { name:"Eliminar", 
        center:true,
        width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-1.5 md:p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setBancos(data.find(item => item['referencia'] === row.referencia) as IBanco)
          setDeleteModal(true);
         }}>
          <TrashIcon className="w-4 h-4 md:w-6 md:h-6"/>
        </button>
      )}
    ];

    const  handleDelete = async (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()// Convert request data to JSON string if needed
      };

      const response = await fetch(API_CONTABILIDAD + "/Bancos/" + referencia, requestOptions);
      if(!response.ok){
        handleError();
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts, defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IBanco) =>{
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
        setToasts([...toasts, defaultDangerToast]) 
        : setToasts([...toasts, dangerToast(message)])
    }

    return(
        <div>
            <div className="flex pr-4 pb-2">
              <h1 className="text-xl dark:text-white">Bancos</h1>
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
              defaultSortFieldId={'codigo'}
              theme={theme}
            />

            {editModal && 
              <Modal 
                title={option ===CREATE_ACTION ? "Nuevo Banco": "Editar Banco"} 
                type="info" 
                width="w-3/4 md:w-1/3"
                onClose={() => setEditModal(false)} 
                >

                {option === CREATE_ACTION ? 
                <FormBanco onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError} codigoList={data.map((item)=> item.codigo)}/>
                : <FormBanco onFormSubmit={handleSubmit} type={UPDATE_ACTION} Banco={banco} onError={handleError} codigoList={data.map((item)=> item.codigo)}/>}
              </Modal>}

            {deleteModal && 
            <Modal title="¡Alerta!" 
              type="error" 
              onConfirm={() => handleDelete(selectedId)}
              onClose={() => setDeleteModal(false)}
              menu>
            <span>¿Desea eliminar el elemento N°{banco.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}