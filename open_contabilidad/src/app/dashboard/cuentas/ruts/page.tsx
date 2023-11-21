"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import FormRuts from "./FormRuts";
import { IRut } from "@/interfaces/IRut";
import axios from "axios";
import { IBanco } from "@/interfaces/IBanco";
import ToastList from "@/componentes/Utils/ToastList";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import { CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Ruts(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IRut[]>([])
    const [bancosData, setBancosData] = useState<IBanco[]>([])

    const [selectedId, setSelectedId] = useState(0)
    const [rut, setRut] = useState<IRut>();
    const [option, setOption] = useState("")    

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const rutsResponse = await axios.get(`${API_CONTABILIDAD}/Nombres/`, {headers: getHeaders()});
          setData(rutsResponse.data);
  
          const bancosResponse = await axios.get(`${API_CONTABILIDAD}/Bancos/`, {headers: getHeaders()});
          setBancosData(bancosResponse.data);
  
          setLoading(false);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
  
      fetchData();
    }, [])

    const columns = [
      { name: 'Código', sortable:true ,width:"7rem", selector:(row:any) => row.codigo, format: (row:any)=>row.codigo+"-"+row.dv },
      { id:'nombre', name: 'Nombre', sortable: true, selector:(row:any) => row.nombre, wrap:true,width:"15rem" },
      { name: 'Giro', selector:(row:any) => row.giro, wrap:true,width:"10rem" },
      { name: 'Ciudad', sortable: true, selector:(row:any) => row.ciudad, wrap:true,width:"10rem" },
      { name: 'Email', selector:(row:any) => row.email, wrap:true, width:"10rem" },
      { name: 'Teléfono', selector:(row:any) => row.telefonos },
      { name:"Editar", center:true, width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setRut(data.find(item => item['codigo'] === row.codigo) as IRut)
          setSelectedId(row.codigo);
          setEditModal(true);
        }}>
          <PencilSquareIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Eliminar", center:true, width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.codigo);
          setRut(data.find(item => item['codigo'] === row.codigo) as IRut)
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = async(codigo:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/Nombres/" + codigo, requestOptions);
      if(!response.ok){
        handleError()
      }else{
        setData(data.filter(item => item["codigo"] !== codigo))
        setToasts([...toasts, defaultSuccessToast])
      }
      
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IRut) =>{
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
              <h1 className="text-xl dark:text-white">Ruts</h1>
              <button onClick={()=>{
                setOption(CREATE_ACTION)
                setEditModal(true)
              }} className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto">
              <PlusIcon className={"w-6 h-6"}/>
            </button>
            </div>

            <DataTable
              columns={columns}
              data={data}
              pagination
              striped
              defaultSortFieldId={'nombre'}
              theme= {theme}
            />

            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nuevo Rut": "Editar Rut"} 
                     width="w-2/3 md:w-1/2"
                     type="info" onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormRuts onFormSubmit={handleSubmit}
                  type={CREATE_ACTION} bancosData={bancosData}
                  onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormRuts onFormSubmit={handleSubmit} type={UPDATE_ACTION} Rut={rut} bancosData={bancosData} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{rut?.codigo}?</span>
            </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}