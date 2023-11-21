"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import { ICentroDeCosto } from "@/interfaces/ICentroDeCosto";
import FormCentrosDeCosto from "./FormCentrosDeCosto";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";


export default function CentrosDeCosto(){

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ICentroDeCosto[]>([])

    const [empresa, setEmpresa] = useState(0)

    const [selectedId, setSelectedId] = useState(0)
    const [centroDeCosto, setCentroDeCosto] = useState<ICentroDeCosto>({referencia: 0, codigo:0, nombre: ""});
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      var codigoEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      setEmpresa(JSON.parse(String(codigoEmpresa)))

      fetch(API_CONTABILIDAD + "/Obras/empresa/" + JSON.parse(String(codigoEmpresa)), {headers: getHeaders()})
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }, [])

    const columns = [
      { 
        id:'codigo',
        name: 'Código',
        sortable: true,
        width:"6rem", selector:(row:any) => row.codigo },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true},
      { name:"Editar", 
        width:"5rem",
        center: true,
        cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setCentroDeCosto(data.find(item => item['referencia'] === row.referencia) as ICentroDeCosto)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar",
        width:"5rem",
        center: true,
        cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setCentroDeCosto(data.find(item => item['referencia'] === row.referencia) as ICentroDeCosto)
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

      const response = await fetch(API_CONTABILIDAD + "/Obras/" + referencia, requestOptions);

      if(!response.ok){
        handleError();
      }

      setData(data.filter(item => item["referencia"] !== referencia))
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:ICentroDeCosto) =>{
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
              <h1 className="text-xl dark:text-white">Centros de Costo</h1>
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
              <Modal title={option ===CREATE_ACTION ? "Nuevo Centro de costo": "Editar Centro de Costo"} 
                     type="info"
                     width={CLASS_MODAL}
                     onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormCentrosDeCosto onFormSubmit={handleSubmit} type={CREATE_ACTION} empresa={empresa} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormCentrosDeCosto onFormSubmit={handleSubmit} type={UPDATE_ACTION} CentroDeCosto={centroDeCosto} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" type="error" width={CLASS_MODAL} onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{centroDeCosto.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}