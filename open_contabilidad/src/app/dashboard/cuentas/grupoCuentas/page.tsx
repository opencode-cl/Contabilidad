"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormGrupoCuentas from "./FormGrupoCuentas";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

interface IGrupoCuentas{
  referencia: number;
  codigo: number;
  nombre: string;
}

export default function GrupoCuentas(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IGrupoCuentas[]>([])

    const [isLoading, setLoading] = useState(true)

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [selectedId, setSelectedId] = useState(0)
    const [grupo, setGrupo] = useState<IGrupoCuentas>({referencia: 0, codigo:0, nombre: ""});
    const [option, setOption] = useState("")

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      fetch(API_CONTABILIDAD + "/Grupos/", { headers: getHeaders() })
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }, [])

    const columns = [
      { id:"codigo",name: 'Código', width:"6rem", selector:(row:any) => row.codigo, format: (row:any)=>formatNumber(row.codigo) },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true},
      { name:"Editar",
        center:true,
        width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setGrupo(data.find(item => item['referencia'] === row.referencia) as IGrupoCuentas)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", 
        width:"5rem",
        center:true,
        cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setGrupo(data.find(item => item['referencia'] === row.referencia) as IGrupoCuentas)
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = async(referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/Grupos/" + referencia, requestOptions);
      if(!response.ok){
        handleError()
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        successCall()
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IGrupoCuentas) =>{
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
      successCall()
      setEditModal(false)
    }

    const handleError = (message:string = "") =>{
      message === "" ? 
        setToasts([...toasts, defaultDangerToast]) 
        : setToasts([...toasts, dangerToast(message)])
    }

    const successCall = () =>{
      setToasts([...toasts, defaultSuccessToast])
    }

    return(
        <div>
            <div className="flex pr-5">
              <h1 className="text-xl dark:text-white">Grupo Cuentas</h1>
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
              <Modal title={option ===CREATE_ACTION ? "Nuevo Grupo Cuentas": "Editar Grupo Cuentas"}
                width={CLASS_MODAL}
                type="info" onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormGrupoCuentas onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormGrupoCuentas onFormSubmit={handleSubmit} type={UPDATE_ACTION} GrupoCuentas={grupo} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" 
            width={CLASS_MODAL}
            type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{grupo.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}