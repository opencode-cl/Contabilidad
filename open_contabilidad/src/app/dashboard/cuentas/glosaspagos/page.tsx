"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormGlosasPagos from "./FormGlosasPagos";
import Toast from "@/componentes/Utils/Toast";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { CLASS_MODAL } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

interface IGlosasPagos{
  referencia: number;
  nombre: string;
}

export default function GlosasPagos(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IGlosasPagos[]>([])

    const [isLoading, setLoading] = useState(true)

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [selectedId, setSelectedId] = useState(0)
    const [glosa, setGlosa] = useState<IGlosasPagos>({referencia: 0, nombre: ""});
    const [option, setOption] = useState("")

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      fetch(API_CONTABILIDAD + "/Glosas/", {headers: getHeaders() })
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }, [])

    const columns = [
      { name: 'Nombre', selector:(row:any) => row.nombre },
      { name:"Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setGlosa(data.find(item => item['referencia'] === row.referencia) as IGlosasPagos)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className="w-6 h-6"/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setGlosa(data.find(item => item['referencia'] === row.referencia) as IGlosasPagos)
          setDeleteModal(true);
         }}>
          <TrashIcon className="w-6 h-6"/>
        </button>
      )}
    ];

    const handleDelete = async (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/Glosas/" + referencia, requestOptions);
      if(!response.ok){
        handleError();
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts, defaultSuccessToast])
      }
      
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IGlosasPagos) =>{
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

    const handleError = () =>{
      setToasts([...toasts, defaultDangerToast])
    }

    return(
        <div>
            <div className="flex pr-6">
              <h1 className="text-xl dark:text-white">Glosas de Pago</h1>
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
              theme={theme}
            />

            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nueva Glosa": "Editar Glosa"} 
                type="info"
                width={CLASS_MODAL}
                onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                  <FormGlosasPagos onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError}/>
                : <FormGlosasPagos onFormSubmit={handleSubmit} type={UPDATE_ACTION} GlosaPago={glosa} onError={handleError}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" 
            type="error" 
            width={CLASS_MODAL}
            onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento "{glosa.nombre}"?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )

}