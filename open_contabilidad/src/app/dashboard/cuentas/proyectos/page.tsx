"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormProyectos from "./FormProyectos";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import { IProyecto } from "@/interfaces/IProyecto";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Proyectos(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IProyecto[]>([])

    const [empresa, setEmpresa] = useState(0)

    const [selectedId, setSelectedId] = useState(0)
    const [proyecto, setProyecto] = useState<IProyecto>();
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      var codigoEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      setEmpresa(JSON.parse(String(codigoEmpresa)))

      fetch(API_CONTABILIDAD + "/Proyectos/empresa/" + JSON.parse(String(codigoEmpresa)), {headers: getHeaders()})
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
        id:"codigo",
        name: 'Código',
        sortable:true,
        width:"5rem", selector:(row:any) => row.codigo },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true},
      { name: 'Fuente Financiamiento', selector:(row:IProyecto) => row.fuentefinanc, hide:"sm" },
      { name: 'Instrumento', selector:(row:IProyecto) => row.instrumento, hide: "sm" },
      { name: 'Rut', selector:(row:IProyecto) => row.rut > 0 ? (row.rut+"-"+row.dv): "", hide:"sm"},
      { name: 'Código BP',  width:"6rem", selector:(row:IProyecto) => row.codigobp , hide:"sm"},
      { name: 'Código SAP', width:"6rem", selector:(row:IProyecto) => row.codigosap , hide: "sm"},
      { name:"Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setProyecto(data.find(item => item['codigo'] === row.codigo) as IProyecto)
          setSelectedId(row.codigo);
          setEditModal(true);
        }}>
          <PencilSquareIcon className="w-4 h-4 md:w-6 md:h-6"/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.codigo);
          setProyecto(data.find(item => item['codigo'] === row.codigo) as IProyecto)
          setDeleteModal(true);
         }}>
          <TrashIcon className="w-4 h-4 md:w-6 md:h-6"/>
        </button>
      )}
    ];

    const handleDelete = async (codigo:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()// Convert request data to JSON string if needed
      };

      const response = await fetch(API_CONTABILIDAD + "/Proyectos/" + codigo, requestOptions);

      if(!response.ok){
        setToasts([...toasts, defaultDangerToast])
      }else{
        setData(data.filter(item => item["codigo"] !== codigo))
        setToasts([...toasts, defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IProyecto) =>{
      if(type === CREATE_ACTION){
        const newData = data.concat(object)
        setToasts([...toasts, defaultSuccessToast])
        setData(newData)
      }

      else if (type === UPDATE_ACTION){
        setData(data.map(obj => {
          if(obj["codigo"] === object.codigo){
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
              <h1 className="text-xl dark:text-white">Proyectos</h1>
              <button onClick={()=>{
                setOption(CREATE_ACTION)
                setEditModal(true)
              }}className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto">
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

            {/* MODAL CREAR Y EDITAR*/}
            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nuevo Proyecto": "Editar Proyecto"} 
                     type="info"
                     width="w-3/4 md:w-1/3"
                     onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormProyectos onFormSubmit={handleSubmit} type={CREATE_ACTION} empresa={empresa} onError={handleError} codigosList={data.map(item=>item.codigo)}/>
                : <FormProyectos onFormSubmit={handleSubmit} type={UPDATE_ACTION} Proyecto={proyecto} empresa={empresa} onError={handleError} codigosList={data.map(item=>item.codigo)} />}
              </Modal>}

            {/* MODAL ELIMINAR */}
            {deleteModal &&
              <Modal title="¡Alerta!"
                     width="w-3/4 md:w-1/3"
                     type="error"
                     onConfirm={() => handleDelete(selectedId)}
                     onClose={() => setDeleteModal(false)}
                     menu>
            <span>¿Desea eliminar el elemento N°{proyecto?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )

}