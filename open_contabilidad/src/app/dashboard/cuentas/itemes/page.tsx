"use client"
import React from "react";
import { API_CONTABILIDAD, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatNumber } from "@/variablesglobales";
import { useEffect, useState, useContext } from "react";
import { PencilSquareIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import Modal from "@/componentes/Utils/Modal";
import DataTable from "react-data-table-component";
import { SESSION_NAMES } from "@/variablesglobales";
import secureLocalStorage from "react-secure-storage";
import axios from "axios";
import TableSelector from "@/componentes/Utils/TableSelector";
import FormItemes from "./FormItemes";
import { IItem } from "@/interfaces/IItem";
import ItemsMae from "./ItemsMae";
import { IItemMae } from "@/interfaces/IItemMae";
import { IToast, dangerToast, defaultDangerToast, defaultSuccessToast } from "@/interfaces/IToast";
import ToastList from "@/componentes/Utils/ToastList";
import { CLASS_MODAL } from "@/globals/CSSClasses";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";
import { ThemeContext } from "@/componentes/Providers/darkModeContext";

export default function Itemes(){

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    const { theme } = useContext(ThemeContext);

    const [data, setData] = useState<IItem[]>([])
    const [cuentasData, setCuentasData] = useState<IItem[]>([])
    const [itemesCuentaData, setItemesCuentasData] = useState([])
    const [itemesMaeData, setItemesMaeData] = useState<IItemMae[]>([])

    const [empresa, setEmpresa] = useState(0)

    const [selectedId, setSelectedId] = useState(0)
    const [item, setItem] = useState<IItem>();
    const [option, setOption] = useState("")

    const [isLoading, setLoading] = useState(true)
    const [deleteModal, setDeleteModal] = useState(false)
    const [editModal, setEditModal] = useState(false)

    const [itemSelected, setItemSelected] = useState(0)
    const [cuentaSelector, setCuentaSelector] = useState(false)

    const [itemesMaeModal, setItemesMaeModal] = useState(false)

    const [toasts, setToasts] = useState<IToast[]>([])


    useEffect(() => {

      var codigoEmpresa = secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID);
      setEmpresa(JSON.parse(String(codigoEmpresa)))

      const fetchData = async () => {
        try {
          const itemesResponse = await axios.get(`${API_CONTABILIDAD}/Itemes/empresa/` + JSON.parse(String(codigoEmpresa)), {headers: getHeaders()});
          setData(itemesResponse.data);
  
          const cuentasResponse = await axios.get(`${API_CONTABILIDAD}/Cuentas/`, {headers: getHeaders()});
          setCuentasData(cuentasResponse.data);

          const itemsMaeResponse = await axios.get(`${API_CONTABILIDAD}/Itemes/maestros/empresa/`+JSON.parse(String(codigoEmpresa)), {headers: getHeaders()});
          setItemesMaeData(itemsMaeResponse.data);
  
          setLoading(false);
        } catch (error) {
          console.error('Fetch error:', error);
        }
      };
  
      fetchData();

    }, [])

    const handleOnSelectItem = (referencia:number) => {
      fetch(API_CONTABILIDAD + "/Itemes/"+referencia+"/cuentas", { headers: getHeaders() })
        .then((res) => {
          return(res.json())
        })
        .then((data) => {
          setItemesCuentasData(data)
          setItemSelected(referencia)
          setLoading(false)
        })
    }

    const columns = [
      { name: 'Seleccionar', width:"6rem", center:true, cell:(row:any) => (
        <input type="radio" name="item" value={row.codigo} onChange={
          ()=>handleOnSelectItem(row.referencia)
        }/>
      ) },
      { id:'codigo', name: 'Código', width:"6rem", sortable:true, selector:(row:any) => row.codigo, format: (row:any)=>formatNumber(row.codigo) },
      { name: 'Nombre', selector:(row:any) => row.nombre },
      { name: "Editar", width:"5rem",cell: (row:any)=>(
        <button className="bg-amber-500 hover:bg-amber-700 rounded-full p-2 text-white" 
        onClick={() => 
        {
          setOption(UPDATE_ACTION)
          setItem(data.find(item => item['referencia'] === row.referencia) as IItem)
          setSelectedId(row.referencia);
          setEditModal(true);
        }}>
          <PencilSquareIcon className="w-6 h-6"/>
        </button>
      )},
      { name:"Eliminar", center:true, width:"5rem", cell: (row:any)=>(
        <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
         onClick={()=>{
          setSelectedId(row.referencia);
          setItem(data.find(item => item['referencia'] === row.referencia) as IItem)
          setDeleteModal(true);
         }}>
          <TrashIcon className="w-6 h-6"/>
        </button>
      )}
    ];

    const columnsCuentas = [
        { id: 'codigo', sortable:true, name: 'Código', width:"6rem", selector:(row:any) => row.cuenta, format: (row:any)=>formatNumber(row.cuenta)},
        { name: 'Nombre', selector:(row:any) => row.nCuenta},
        { name: "Eliminar", center:true, width:"5rem", cell: (row:any)=>(
            <button className="bg-red-500 hover:bg-red-700 rounded-full p-2 text-white"
             onClick={()=>{
              setItemesCuentasData(itemesCuentaData.filter(item => item["referencia"] !== row.referencia))
              const requestOptions = {
                method: "DELETE",
                headers: getHeaders()
              };
        
              fetch(API_CONTABILIDAD + "/Itemes/cuentas/" + row.referencia, requestOptions);
             }}>
              <TrashIcon className="w-6 h-6"/>
            </button>
          )
        }
    ]

    const columnsCuentasSelector = [
      { name: 'Código', width:"6rem", selector:(row:any) => row.codigo, format: (row:any)=> formatNumber(row.codigo) },
        { name: 'Nombre', selector:(row:any) => row.nombre, wrap: true},
    ]
    const handleDelete = async (referencia:number) => {
      const requestOptions = {
        method: "DELETE",
        headers: getHeaders()
      };

      const response = await fetch(API_CONTABILIDAD + "/Itemes/" + referencia, requestOptions);

      if(!response.ok){
        handleError();
      }else{
        setData(data.filter(item => item["referencia"] !== referencia))
        handleSuccess()
      }

      setDeleteModal(false);
    }

    const handleSubmit = (type:string, object:IItem) =>{
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
      handleSuccess()
      setEditModal(false)
    }

    const handleSelectCuenta = async(cuentaSelected:any) =>{

      if(itemesCuentaData.some(item => item.cuenta === cuentaSelected.codigo)){
        handleError(ERROR_CODE_EXISTS)
        return
      }

      const newCuenta = {
        cuenta: cuentaSelected.codigo, 
        nCuenta: cuentaSelected.nombre, 
        codigo: itemSelected, 
        empresa: empresa
      }
      const newData = itemesCuentaData.concat(newCuenta)
      setItemesCuentasData(newData)

      const requestOptions = {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newCuenta)
      };

    const response = await fetch(API_CONTABILIDAD + "/Itemes/cuentas/", requestOptions)

    if(!response.ok){
      handleError()
    }else{
      handleSuccess()
    }

    setCuentaSelector(false)
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <div className="flex pr-6">
              <h1 className="text-xl dark:text-white">Itemes</h1>
              
              <div className="ml-auto flex items-center">
                <button onClick={()=>{
                setItemesMaeModal(true)
              }} className="py-2 px-8 mr-2 bg-blue-600 hover:bg-blue-800 text-white rounded-full">
                Maestros
              </button>
              <button onClick={()=>{
                setOption(CREATE_ACTION)
                setEditModal(true)
              }} className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full">
              <PlusIcon className="w-6 h-6"/>
            </button>
            </div>
            </div>

            <DataTable
              columns={columns}
              data={data}
              pagination
              striped
              theme={theme}
            />
        </div>

        <div>
            <div className="flex pr-5">
              <h1 className="text-xl dark:text-white">Cuentas</h1>
              {itemSelected > 0 && <button onClick={()=>{
                setCuentaSelector(true)
              }} className="py-2 px-2 bg-green-600 hover:bg-green-800 text-white rounded-full ml-auto">
              <PlusIcon className="w-6 h-6"/>
            </button>}
            </div>

            <DataTable
              columns={columnsCuentas}
              data={itemesCuentaData}
              pagination
              striped
              defaultSortFieldId={'codigo'}
              theme={theme}
            />

        </div>

        {editModal && 
              <Modal title={option ===CREATE_ACTION ? "Nuevo Item": "Editar Item"} type="info" width={CLASS_MODAL} onClose={() => setEditModal(false)} >
                {option === CREATE_ACTION ? 
                <FormItemes onFormSubmit={handleSubmit} type={CREATE_ACTION} empresa={empresa} itemesMae={itemesMaeData} onError={handleError} codigoList={data.map(item=>item.codigo)}/>
                : <FormItemes onFormSubmit={handleSubmit} type={UPDATE_ACTION} Item={item} empresa={empresa} itemesMae={itemesMaeData} onError={handleError} codigoList={data.map(item=>item.codigo)}/>}
              </Modal>}

        {deleteModal && <Modal title="¡Alerta!" width={CLASS_MODAL} type="error" onConfirm={() => handleDelete(selectedId)} onClose={() => setDeleteModal(false)} menu>
            <span>¿Desea eliminar el elemento N°{item?.codigo}?</span>
            </Modal>}

        {cuentaSelector && <Modal width={CLASS_MODAL}
              type="info" title="" onClose={() => (setCuentaSelector(false))} menu>
                <TableSelector columns={columnsCuentasSelector} data={cuentasData} onSelect={(cuentaSelected:any) => {handleSelectCuenta(cuentaSelected)}}
                title="Selector" />
            </Modal>}

        {itemesMaeModal && <Modal type="info" width={CLASS_MODAL} title="" onClose={() => (setItemesMaeModal(false))} menu>
              <ItemsMae/>
            </Modal>}
            <ToastList toasts={toasts} setToasts={setToasts}/>
        </div>
    )

}