"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import Spinner from "@/componentes/Utils/Spinner";
import DataTable, { TableColumn } from "react-data-table-component";
import { ICuenta } from "@/interfaces/ICuenta";
import FormCuentas from "./FormCuentas";
import { formatNumber } from "@/variablesglobales";
import axios from "axios";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import Select from "@/componentes/Utils/Select";
import Checkbox from "@/componentes/Utils/Checkbox";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function VistaCuentas(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ICuenta[]>([])

    const [isLoading, setLoading] = useState(true)

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [selectedId, setSelectedId] = useState(0)
    const [cuenta, setCuenta] = useState<ICuenta>();
    const [option, setOption] = useState("")

    const [ifrsList, setIfrsList] = useState([])
    const [codFinList, setCodFinList] = useState([])
    const [grupoList, setGrupoList] = useState([])
    const [flujoList, setFlujoList] = useState([])

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const cuentasResponse = await axios.get(`${API_CONTABILIDAD}/Cuentas/`, {headers: getHeaders()});
          setData(cuentasResponse.data);
  
          const gruposResponse = await axios.get(`${API_CONTABILIDAD}/Grupos/`, {headers: getHeaders()});
          setGrupoList(gruposResponse.data);
  
          const codFinResponse = await axios.get(`${API_CONTABILIDAD}/CodigosFinancieros/`, { headers: getHeaders() });
          setCodFinList(codFinResponse.data);
  
          const ifrsResponse = await axios.get(`${API_CONTABILIDAD}/IFRS/`, {headers: getHeaders()});
          setIfrsList(ifrsResponse.data);

          const flujoResponse = await axios.get(`${API_CONTABILIDAD}/Flujos/`, {headers: getHeaders()});
          setFlujoList(flujoResponse.data);
  
          setLoading(false);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
  
      fetchData();
    }, []);
  
    
    const columns:TableColumn<any>[] = [
      { name: 'Codigo', selector:(row:any) => row.codigo, format:(row:any) => formatNumber(row.codigo), width:"6rem", sortable:true},
      { name: 'Nombre', selector:(row:any) => row.nombre, wrap:true, width:"8rem"},
      { name: 'Grupo', selector:(row:any) => row.grupo, format:(row:any) => formatNumber(row.grupo), width:"5rem", sortable:true, hide:"sm"},
      { name: 'Nombre Grupo', selector:(row:any) => row.nGrupo, wrap:true, hide:"sm"},
      { name: 'Centro', selector:(row:any) => row.centro, width:"5rem", hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="centro" checked={row.centro === "S"}/>
      )},
      { name: 'Item', selector:(row:any) => row.item, width:"5rem", hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="item" checked={row.item === "S"}/>) },

      { name: 'Rut', selector:(row:any) => row.rut, width:"5rem", hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="rut" checked={row.rut === "S"}/>) },
      { name: 'Codfin', selector:(row:any) => row.codfin, format:(row:any) => formatNumber(row.codfin), width:"5rem", hide:"sm"},
      { name: 'Efectivo', selector:(row:any) => row.efectivo, width:"5rem", hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="efectivo" checked={row.item === "S"}/>) },
      { name: 'Flujo', selector:(row:any) => row.flujo, width:"5rem", hide:"sm", format: (row:any)=>formatNumber(row.flujo) },
      { name: 'IFRS', selector:(row:any) => row.ifrs, width:"5rem", format: (row:any)=>formatNumber(row.ifrs), hide:"sm" },
      { name: 'Ppto', selector:(row:any) => row.ppto, width:"5rem", hide:"sm" },
      { name: 'Pptc', selector:(row:any) => row.pptc, width:"5rem", hide:"sm" },
      { name:"Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setCuenta(data.find(item => item['referencia'] === row.referencia) as ICuenta)
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
          setCuenta(data.find(item => item['referencia'] === row.referencia) as ICuenta)
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

      const response = await fetch(API_CONTABILIDAD + "/Cuentas/" + referencia, requestOptions);
      if(!response.ok){
        handleError()
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        setToasts([...toasts, defaultSuccessToast])
      }
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:ICuenta) =>{

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
              <h1 className="text-xl dark:text-white">Cuentas</h1>
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
              progressComponent = {<Spinner />}
              striped
              theme={theme}
            />

            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nueva Cuenta": "Editar Cuenta"} 
                     type="info" 
                     width={CLASS_MODAL}
                     onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormCuentas onFormSubmit={handleSubmit} type={CREATE_ACTION} grupoList={grupoList} ifrsList={ifrsList} codFinList={codFinList} onError={handleError} codigoList={data.map(item=>item.codigo)} flujoList={flujoList}/>
                : <FormCuentas onFormSubmit={handleSubmit} type={UPDATE_ACTION} Cuenta={cuenta} grupoList={grupoList} ifrsList={ifrsList} codFinList={codFinList} onError={handleError} codigoList={data.map(item=>item.codigo)}  flujoList={flujoList}/>}
              </Modal>}

            {deleteModal && 
              <Modal title="¡Alerta!"
                     type="error"
                     width={CLASS_MODAL}
                     onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{cuenta?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}