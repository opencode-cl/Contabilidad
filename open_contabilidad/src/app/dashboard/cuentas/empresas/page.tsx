"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext} from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { IEmpresa } from "@/interfaces/IEmpresa";
import FormEmpresas from "./FormEmpresas";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";
  
export default function Empresas(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IEmpresa[]>([])

    const [selectedId, setSelectedId] = useState(0)
    const [empresa, setEmpresa] = useState<IEmpresa>();
    const [option, setOption] = useState("")

    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      fetch(API_CONTABILIDAD + "/Empresas/", { headers: getHeaders() })
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
        })
    }, [])

    const columns = [
      { id:"codigo", name: 'Código', selector:(row:any) => row.codigo, sortable:true, width:"6rem" },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true},
      { name: 'Ciudad', selector:(row:any) => row.ciudad, hide:"sm" },
      { name: 'Giro', selector:(row:any) => row.giro, wrap: true, hide:"sm" },
      { name: 'Teléfono', selector:(row:any) => row.telefono, hide:"sm" },
      { name: 'Email', selector:(row:any) => row.email, wrap:true, hide:"sm" },
      { name: "Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption("edit")
          setEmpresa(data.find(item => item['codigo'] === row.codigo) as IEmpresa)
          setSelectedId(row.codigo);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.codigo);
          setEmpresa(data.find(item => item['codigo'] === row.codigo) as IEmpresa)
            setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = async (codigo:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/Empresas/" + codigo, requestOptions);
      if(!response.ok){
        handleError()
      }else{
        setData(data.filter(item => item["codigo"] !== codigo))
        handleSuccess()
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IEmpresa) =>{
      if(type === CREATE_ACTION){
        const newData = data.concat(object)
        setData(newData)
      }

      else if (type === UPDATE_ACTION){
        setData(data.map(obj => {
          if(obj["codigo"] === object.codigo){
            obj = object
          }
          return obj;
        }))
      }
      handleSuccess()
      setEditModal(false)
    }

    const handleSuccess = () =>{
      setToasts([...toasts, defaultSuccessToast])
    }

    const handleError = (message:string = "") =>{
      message === "" ? 
        setToasts([...toasts, defaultDangerToast]) 
        : setToasts([...toasts, dangerToast(message)])
    }


    return(
        <div>
            <div className="flex pr-6">
              <h1 className="text-xl dark:text-white">Empresas</h1>
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
              <Modal title={option ===CREATE_ACTION ? "Nueva Empresa": "Editar Empresa"} 
                     width="w-5/6 md:w-1/2"
                     type="info" onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormEmpresas onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormEmpresas onFormSubmit={handleSubmit} type={UPDATE_ACTION} Empresa = {empresa} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!"
            width={CLASS_MODAL}
             type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{empresa?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )
} 