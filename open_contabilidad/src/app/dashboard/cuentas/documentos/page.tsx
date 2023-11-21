"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { ITipoDocumento } from "@/interfaces/ITipoDocumento";
import axios from "axios";
import { ICuenta } from "@/interfaces/ICuenta";
import FormTipoDocumento from "./FormTipoDocumento";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import Checkbox from "@/componentes/Utils/Checkbox";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function TipoDocumentos(){

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<ITipoDocumento[]>([])
    const [cuentasList, setCuentasList] = useState<ICuenta[]>([])
    const [isLoading, setLoading] = useState(true)

    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [selectedId, setSelectedId] = useState(0)
    const [documento, setDocumento] = useState<ITipoDocumento>();

    const [option, setOption] = useState("")

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
              const documentosResponse = await axios.get(`${API_CONTABILIDAD}/TipoDocumento/`, {headers: getHeaders()});
              setData(documentosResponse.data);
      
              const cuentasResponse = await axios.get(`${API_CONTABILIDAD}/Cuentas/`, {headers: getHeaders()});
              setCuentasList(cuentasResponse.data);
      
              setLoading(false);
            } catch (error) {
              console.error('Fetch error:', error);
            }
          };
      
          fetchData();
    }, [])

    const columns = [
      { id:"libro", name:'Libro', sortable:true, width:"5rem", selector:(row:any) => row.libro},
      { id:'codigo', name:'Código', sortable:true, width:"5rem", selector:(row:any) => row.codigo },
      { name:'Nombre', selector:(row:any) => row.nombre, wrap:true},
      { name:"Cuenta" , selector:(row:any) => row.cuenta, format:(row:any)=>formatNumber(row.cuenta)},
      { name:"Exenta" , selector:(row:any) => row.exenta, hide:"sm",center:true, format: (row:any) => (
        <Checkbox name="item" checked={row.exenta === "S"}/>)},
      { name:"Sigla" , selector:(row:any) => row.sigla, hide:"sm"},
      { name:"Retención" , selector:(row:any) => row.retencion, hide:"sm"},
      { name:"Bonificación" , selector:(row:any) => row.bonificacion, hide:"sm"},
      { name:"Eléctronico" , selector:(row:any) => row.electronico, hide:"sm"},
      { name:"Editar", center:true, width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setDocumento(data.find(item => item['referencia'] === row.referencia) as ITipoDocumento)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", center:true, width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setDocumento(data.find(item => item['referencia'] === row.referencia) as ITipoDocumento)
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

      const response = await fetch(API_CONTABILIDAD + "/TipoDocumento/" + referencia, requestOptions);
      if(!response.ok){
        handleError()
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        handleSuccess()
      }

      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:ITipoDocumento) =>{
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
      handleSuccess();
      setEditModal(false)
    }

    const handleError = (message:string = "") =>{
      message === "" ? 
        setToasts([...toasts, defaultDangerToast]) 
        : setToasts([...toasts, dangerToast(message)])
    }

    const handleSuccess = () =>{
      setToasts([...toasts, defaultSuccessToast])
    }

    return(
        <div>
            <div className="flex pr-5">
              <h1 className="text-xl dark:text-white">Tipo Documentos</h1>
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
              defaultSortFieldId={"libro"}
              theme={theme}
            />

            {editModal && 
              <Modal 
                title={option === CREATE_ACTION ? "Nuevo Tipo Documento": "Editar Tipo Documento"}
                width={CLASS_MODAL}
                type="info" onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormTipoDocumento onFormSubmit={handleSubmit} action={CREATE_ACTION} cuentasList={cuentasList} onError={handleError} codigoList={data.map(item=>({codigo: item.codigo, libro: item.libro}))}/>
                : <FormTipoDocumento onFormSubmit={handleSubmit} TipoDocumento={documento} action={UPDATE_ACTION} cuentasList={cuentasList} onError={handleError} codigoList={data.map(item=>({codigo: item.codigo, libro: item.libro}))}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" 
            width={CLASS_MODAL}
            type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento {documento?.libro+ "-" + documento?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}