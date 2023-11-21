"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormSucursales from "./FormSucursales";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import { ISucursal } from "@/interfaces/ISucursal";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import Checkbox from "@/componentes/Utils/Checkbox";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Sucursales(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ISucursal[]>([])

    const [empresa, setEmpresa] = useState(0)

    const [selectedId, setSelectedId] = useState(0)
    const [sucursal, setSucursal] = useState<ISucursal>();
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      var codigoEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      setEmpresa(JSON.parse(String(codigoEmpresa)))

      fetch(API_CONTABILIDAD + "/Sucursales/empresa/" + JSON.parse(String(codigoEmpresa)), {headers: getHeaders()})
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setData(data)
          setLoading(false)
        })
    }, [])

    const columns = [
      { id:'codigo',
        name: 'Código',
        width:"6rem", selector:(row:any) => row.codigo },
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true },
      { name: 'Dirección', selector:(row:any) => row.direccion, hide:"sm" },
      { name: 'Factura', selector:(row:any) => row.factura, hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="factura" checked={row.factura === "S"}/>) },
      { name: 'Tipo', selector:(row:any) => row.tipo, hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="tipo" checked={row.tipo === "S"}/>) },
      { name:"Editar", width:"5rem", center:true ,cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setSucursal(data.find(item => item['referencia'] === row.referencia) as ISucursal)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", width:"5rem", center:true, cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setSucursal(data.find(item => item['referencia'] === row.referencia) as ISucursal)
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = async(referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()// Convert request data to JSON string if needed
      };

      const response = await fetch(API_CONTABILIDAD + "/Sucursales/" + referencia, requestOptions);
      if(!response.ok){
        handleError();
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts,defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:ISucursal) =>{
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
            <div className="flex pr-5">
              <h1 className="text-xl dark:text-white">Sucursales</h1>
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
              theme = {theme}
            />

            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nueva Sucursal": "Editar Sucursal"} 
                type="info"
                width={CLASS_MODAL}
                onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormSucursales onFormSubmit={handleSubmit} type={CREATE_ACTION} empresa={empresa} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormSucursales onFormSubmit={handleSubmit} type={UPDATE_ACTION} Sucursal={sucursal} empresa={empresa} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && 
              <Modal title="¡Alerta!"
              width={CLASS_MODAL} 
              type="error" onConfirm={() => handleDelete(selectedId)} 
            onClose={() => setDeleteModal(false)}
            menu>
            <span>¿Desea eliminar el elemento N°{sucursal?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )

}