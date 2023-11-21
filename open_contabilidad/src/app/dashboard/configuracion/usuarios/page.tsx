"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { BuildingOfficeIcon, PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { IFlujo } from "@/interfaces/IFlujo";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL, CLASS_TABLE_BUTTONS } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { IUsuario } from "@/interfaces/IUsuario";
import FormUsuarios from "./FormUsuarios";
import AsignacionEmpresas from "./AsignacionEmpresa";
import axios from "axios";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Usuarios(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const {theme} = useContext(ThemeContext);

    const [data, setData] = useState<IUsuario[]>([])

    const [selectedId, setSelectedId] = useState(0)
    const [usuario, setUsuario] = useState<IUsuario>({referencia: 0, codigo:"", nombre: "", clave: "" , opciones:0});
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [empresas, setEmpresas] = useState([])
    const [empresasModal, setEmpresasModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(() => {

      const fetchData = async () => {
        try {
          const empresasResponse = await axios.get(`${API_CONTABILIDAD}/Empresas/`, {headers: getHeaders()});
         setEmpresas(empresasResponse.data.map((item:any)=>{
            let newData ={
              referencia: item.codigo,
              nombre: item.nombre
              }
            return(newData)
         }))

         fetch(API_CONTABILIDAD + "/Usuarios/", { headers: getHeaders() })
         .then((res) => {
           return(res.json())
         })
         .then((data) => {
           setData(data)
           setLoading(false)
         })

  
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
      fetchData();
    }, [])

    const columns = [
      { id: 'codigo',
        name: 'Código', 
        width:"6rem",
        sortable:true,
        selector:(row:any) => row.codigo, },
      { name: 'Nombre', 
        selector:(row:any) => row.nombre,
        wrap: true},
        { name: 'Opciones', 
        selector:(row:any) => row.opciones,
        wrap: true},
        { name:"Empresas", 
        width:"6rem",
        center:true,
        cell: (row:any)=>(
        <button className="bg-blue-500 hover:bg-blue-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setUsuario(data.find(item => item['referencia'] === row.referencia) as IUsuario)
          setEmpresasModal(true);
         }}>
          <BuildingOfficeIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )},
      { name:"Editar", 
        width:"5rem",
        center:true,
        cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setUsuario(data.find(item => item['referencia'] === row.referencia) as IUsuario)
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
          setUsuario(data.find(item => item['referencia'] === row.referencia) as IUsuario)
          setDeleteModal(true);
         }}>
          <TrashIcon className={CLASS_TABLE_BUTTONS}/>
        </button>
      )}
    ];

    const handleDelete = (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()// Convert request data to JSON string if needed
      };

      fetch(API_CONTABILIDAD + "/Usuarios/" + referencia, requestOptions);
      setData(data.filter(item => item["referencia"] !== referencia))
      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IUsuario) =>{
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
              <h1 className="text-xl dark:text-white">Usuarios</h1>
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
              defaultSortFieldId={"codigo"}
              pagination
              striped
              theme={theme}
            />

            {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nuevo Usuario": "Editar Usuario"} 
                     type="info"
                     width={CLASS_MODAL}
                     onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormUsuarios onFormSubmit={handleSubmit} type={CREATE_ACTION} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormUsuarios onFormSubmit={handleSubmit} type={UPDATE_ACTION} Usuario={usuario} onError={handleError} codigoList={data.map(item=>item.codigo)} />}
              </Modal>}

            {deleteModal && <Modal title="¡Alerta!" width={CLASS_MODAL} type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el usuario {usuario.codigo}?</span>
            </Modal>}

            {empresasModal && <Modal title={"Empresas asignadas a " + usuario.codigo} type="info" onClose={() => setEmpresasModal(false) } menu>
                <AsignacionEmpresas codigoUsuario={usuario.codigo} empresas={empresas} />
              </Modal>}

            <ToastList toasts={toasts} setToasts={setToasts}/>

        </div>
    )

}