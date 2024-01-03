"use client"
import React, { useState, useEffect, useContext} from 'react';
import Input from '../Input';
import Select from '../Select';
import DataTable from 'react-data-table-component';
import { gridStyle } from '@/globals/tableStyles';
import ContableButton from './contableButton';
import { FolderArrowDownIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, DocumentMinusIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { API_CONTABILIDAD, SESSION_NAMES } from '@/variablesglobales';
import { RequestHeadersContext, RequestHeadersContextType } from '@/componentes/Providers/RequestHeadersProvider';
import { tipoComprobantes } from '@/globals/contabilidad/tipoComprobantes';
import { IToast, confirmationToast, dangerToast, defaultSuccessToast } from '@/interfaces/IToast';
import ToastList from '../ToastList';
import { ThemeContext } from '@/componentes/Providers/darkModeContext';
import CuentaSelector from './cuentaSelector';
import RutSelector from './rutSeleccionador';
import Modal from '../Modal';
import CentroSelector from './centroSeleccionador';
import ItemsSelector from './itemSeleccionador';
import { formatNumberWithPoints } from "@/variablesglobales";
import FlujosSelector from './flujoSeleccionador';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import {jsPDF} from "jspdf"
import 'jspdf-autotable'
import FolioSelector from './folioSeleccionador';
import Image from 'next/image';
import disk from "../../../public/images/disk.svg"
import impresora from "../../../public/images/impresora.svg"
import reversa from "../../../public/images/reversa.svg"
import copia from "../../../public/images/copia.svg"
import excelLinea from "../../../public/images/excelLineas.svg"
import { ICuenta } from '@/interfaces/ICuenta';
import { IRut } from '@/interfaces/IRut';
import { ICentroDeCosto } from '@/interfaces/ICentroDeCosto';
import { IEmpresa } from '@/interfaces/IEmpresa';
import { IFlujo } from '@/interfaces/IFlujo';
import { Workbook } from "exceljs";


interface comprobantesContablesProps {
}

interface ExcelColumn {
  name: string;
  type: string;
}

interface Linea {
  cuenta: string;
  centro: string;
  item: string;
  rut: string;
  nroDoc: string;
  tipoDoc: string;
  feDoc: string;
  feVen: string;
  nroRef: string;
  cp: string;
  debe: string;
  haber: string;
  flujo: string;
  glosa: string;
}
const ComprobantesContables: React.FC<comprobantesContablesProps> = () => {

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext)

  const [isModalOpen, setModalOpen] = useState(false);

  const [actualizar, setActualizar] = useState(0);

  const [tipo, setTipo] = useState("");
  const [folio, setFolio] = useState(0)
  const [foliosData, setFoliosData] = useState<any[]>([])
  const [lineasData, setLineasData] = useState<ILineas[]>([])
  const [lineasTotalData, setLineasTotalData] = useState<any[]>([])
  const [Items, setItemsData] = useState<any[]>([])
  const [empresas,setEmpresas]= useState<IEmpresa[]>([])
  const [ruts,setRut] = useState<IRut[]>([])
  const [centros,setCentros] = useState<ICentroDeCosto[]>([])
  const [editable, setEditable] = useState(false)
  const [newCount, setNewCount] = useState(0);
  const [numCopia, setNumCopia] = useState(1);
  
  const [cuentasData, setCuentasData] = useState<ICuenta[]>([])
  const [flujosData, setFLujosData] = useState<IFlujo[]>([])


  const [toasts, setToasts] = useState<IToast[]>([])
  const [toastConfirm, setToastConfirm] = useState<IToast[]>([])
  const [confirmModal, setConfirmModal] = useState(false)
  const [isCuentaSelectorVisible, setCuentaSelector] = useState(false)
  const [isRutSelectorVisible, setRutSelector] = useState(false)
  const [isCentroSelectorVisible, setCentroSelector] = useState(false)
  const [isItemsSelectorVisible, setItemsSelector] = useState(false)
  const [isFoliosSelectorVisible, setFoliosSelector] = useState(false)
  const [isRutSelectorFolioVisible, setRutFolioSelector] = useState(false)
  const [isCuentaSelectorFolioVisible, setCuentaFolioSelector] = useState(false)
  const [isFlujoSelectorVisible, setFlujoSelector] = useState(false)
  const [editarDoc, setEditarDoc] = useState(false)
  
  const getLocalStorageParams = () => {
    const empresa = String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, '');
    const periodo = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, '');
    const mes = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH))!.replace(/"/g, '');
    return { empresa, periodo, mes };
  };

  const obtenerFechaActual = () => {
    var {empresa,periodo,mes} = getLocalStorageParams();
    const fechaActual = new Date();
    const year = String(fechaActual.getFullYear());
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Sumamos 1 ya que los meses comienzan desde 0
    const day = String(fechaActual.getDate()).padStart(2, '0');

    if (mes.length<2) {
      mes=0+mes;
    }

    var fecha = periodo+"-"+mes+"-"+"01";
    if (month==mes && year == periodo) {
      fecha=year+"-"+month+"-"+day;
    }
    return fecha;
  };

  const defaultFolioValues = {
    noDoc: 0,
    fecha: obtenerFechaActual(),
    rut: 0,
    dv:"",
    id:0,
    nombre: "",
    glosa: "",
    banco: "",
    valor: 0,
    vencim: "",
    type: "",
    usuario:"",
    fechareg:"",
    tipo:"",
    referencia: newCount
  }
  
  const [folioValues, setFolioValues] = useState(defaultFolioValues)
  const [editedData, setEditedData] = useState<ILineas | null>(null);




  const CreatePDF = () => {
    var {empresa,periodo,mes} = getLocalStorageParams();
    const doc = new jsPDF();
    const empresaObjetivo= empresas.find(aux => aux.codigo===Number(empresa));
    const nombreEmpresa=empresaObjetivo?.nombre;
    const RutSii= empresaObjetivo?.rutusuariosii;
    const DvSii= empresaObjetivo?.dvusuariosii;

    let Conprobante="";
    if (tipo==="I") {
      Conprobante="Ingreso"
    }else if (tipo==="E") {
      Conprobante="Engreso"      
    }else {
      Conprobante="Traspaso"      
    }
  
    

    const addHeader = () => {
      const cuentaHeader=(cuentasData.find(cuenta=> Number(cuenta.codigo)===Number(folioValues.banco)));
      let nombreHeader="" ;
      if (cuentaHeader!=undefined) nombreHeader = cuentaHeader.nombre;
      

      doc.setFontSize(13);
      doc.text(`${nombreEmpresa}`,10,15);
      doc.text(`RUT ${RutSii} - ${DvSii}`,10,20);

      doc.text(`Fecha ${folioValues.fecha}`,150,15);

      doc.setFontSize(15);
      doc.text(`Comprobante de ${Conprobante} Nº ${folio}`,60,34);

      doc.setFontSize(9);
      if (tipo==="E") {
        doc.rect(15, 51, 180, 8);
        doc.text(`Nombre: ${folioValues.nombre} `,17,56);
        doc.text(`Rut: ${folioValues.rut}-${folioValues.dv}`,155,56);
        
        doc.rect(15, 59, 180, 8);
        doc.text(`Cuenta: ${nombreHeader} `,17,64);
        doc.text(`Nº Documento: ${folioValues.noDoc}`,115,64);
        doc.text(`Valor: ${Intl.NumberFormat("es-CL").format(folioValues.valor)}`,155,64);
        doc.rect(15, 67, 180, 8);
        doc.text(`Glosa: ${folioValues.glosa}`,17,72);

      }else{
        doc.rect(15, 51, 180, 8);
        doc.text(`Nombre: ${folioValues.nombre} `,17,56);
        doc.text(`Rut: ${folioValues.rut}-${folioValues.dv}`,130,56);
        
        doc.rect(15, 59, 180, 8);
        doc.text(`Glosa: ${folioValues.glosa}`,17,64);
      }
      
    };

    addHeader();
    
    let total_debe=0;
    let total_haber=0;

    const columsLineas =['Cuenta','Centro','Item','Rut','NºDoc','Glosa','Debe','Haber','Flujo']
    const lineasfolio= lineasData.map(linea => {
      const cuenta=(cuentasData.find(cuenta=> cuenta.codigo===linea.cuenta));
      let nombre="" ;
      total_haber=total_haber+linea.haber;
      total_debe=total_debe+linea.debe;
      if (cuenta!=undefined) nombre = cuenta.nombre;
      return [linea.cuenta+" "+nombre,linea.obra,linea.item,linea.auxiliar,linea.noDoc,linea.glosa,Intl.NumberFormat("es-CL").format(linea.debe),Intl.NumberFormat("es-CL").format(linea.haber),linea.flujo]

    });

    const stylesLineas = {
      fontSize: 7,
      columnWidth: 'auto',
    };

    const optionsLineas = {
      startY: 85, 
      head: [columsLineas],
      body: lineasfolio,
      theme: 'striped',
      styles: stylesLineas,
      headStyles: {halign: 'center', textColor:0, fillColor: [235, 232, 249] },
    };

    doc.setFontSize(10);
    
    const maxRowsPerPage = 18; 

    const dividedData = [];
    for (let i = 0; i < lineasfolio.length; i += maxRowsPerPage) {
      dividedData.push(lineasfolio.slice(i, i + maxRowsPerPage));
    }
    
    dividedData.forEach((part, index) => {
      if (index > 0) {
        // Agrega nueva página y encabezado para páginas adicionales
        doc.addPage();
        addHeader();
      }
  
      // Ajusta la posición startY solo para la primera parte
      const startY = 95;
      doc.autoTable({ ...optionsLineas, body: part, startY });

    });

    doc.setPage(doc.getCurrentPageInfo().pageNumber)

    let height_total=doc.autoTable.previous.finalY;
    const pageHeight = doc.internal.pageSize.height;


    if (height_total<=230) {
      height_total=230
    }else{
      height_total=height_total+10
    }

    
    if (height_total+15 >= pageHeight) {
      height_total=10;
      doc.addPage();
    }

    doc.setPage(doc.getCurrentPageInfo().pageNumber)
    doc.setFontSize(8);
    
    doc.rect(15, height_total, 180, 6);
    doc.text(`Totales Iguales `,17,height_total+5);
    doc.text(`${Intl.NumberFormat("es-CL").format(total_debe)} = ${Intl.NumberFormat("es-CL").format(total_haber)}`,150,height_total+5);


    let height_firma=height_total+20;

    if (height_firma +20>= pageHeight) {
      height_firma=20;
      doc.addPage();
    }

    doc.setFontSize(10);
    doc.setPage(doc.getCurrentPageInfo().pageNumber)

    doc.line(15, height_firma, 55, height_firma);
    doc.text(`CONTABILIDAD`,20,height_firma+5);

    doc.line(60, height_firma, 100, height_firma);
    doc.text(`FINANZAS`,70,height_firma+5);

    doc.line(105, height_firma, 145, height_firma);
    doc.text(`GERENCIA`,115,height_firma+5);

    doc.line(155, height_firma, 195, height_firma);
    doc.text(`HECHO/RECIBIDO POR`,155,height_firma+5);
    
    if (tipo==="E") {
      doc.line(45, height_firma+25, 90, height_firma+25);
      doc.text(`NOMBRE`,58,height_firma+30);
      doc.line(115, height_firma+25, 155, height_firma+25);
      doc.text(`RUT`,130,height_firma+30);
    }

    //Guardar y descargar el documento
    doc.save(`Comprobante_Contable_Folio_${folio}`);

  }

  const formatDate = (dateString:any) => {
    const originalDate = new Date(dateString);
    // Verificar si la conversión a Date fue exitosa

    if (isNaN(originalDate.getTime())) {
        console.error(`Error al convertir la fecha: ${dateString}`);
        return "";
    }
    if (dateString === "2001-01-01" || dateString === "01/01/2001" || dateString === "01/01/0001") {
      return "";
    }
    // Formatear la fecha como "yyyy-MM-dd"
    const formattedDate = originalDate.toISOString().split('T')[0];
    
    return formattedDate;
  }


  useEffect(() => {
    var {empresa,periodo,mes} = getLocalStorageParams();
    axios
    .get(API_CONTABILIDAD + "/Nombres/", { headers: getHeaders() })
    .then((response) => {
      setRut(response.data);
    })
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + "/Empresas/", { headers: getHeaders() })
    .then((response) => {
      setEmpresas(response.data);
    })  
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + '/Obras/empresa/'+empresa, { 
      headers: getHeaders() })
    .then((response) => {
      setCentros(response.data);
    })
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + "/FLujos", { headers: getHeaders() })
    .then((response) => {
      setFLujosData(response.data);
    })
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + "/Cuentas/", { headers: getHeaders() })
    .then((response) => {
      setCuentasData(response.data);
    })
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + '/Itemes/empresa/'+empresa, { headers: getHeaders() })
    .then((response) => {
      setItemsData(response.data);
    })
    .catch((err) => {
      
    });
    
  }, [])
  

  useEffect(() => {
    const { empresa, periodo, mes } = getLocalStorageParams();

    const fetchData = async () => {
      try {
        if (empresa && periodo && mes) {
          const response = await axios.get(API_CONTABILIDAD+`/Folios/periodo`, {
            params: { empresa, periodo, mes, tipo },
            headers: getHeaders(),
          });
  
          if(response.data.length > 0){
            setFoliosData(response.data);
            setFolio(response.data[0].numero)
            setFolioValues({
              noDoc: response.data[0].noDoc,
              fecha: formatDate(response.data[0].fecha.split(" ")[0]),
              rut: response.data[0].rut,
              dv: response.data[0].dv,
              id:response.data[0].id,
              nombre: response.data[0].nombre,
              glosa: response.data[0].glosa,
              banco: response.data[0].cuenta,
              valor: response.data[0].valor,
              vencim: formatDate(response.data[0].vencim.split(" ")[0]),
              type: response.data[0].type,
              usuario:response.data[0].usuario,
              fechareg: response.data[0].fechaerg,
              tipo: response.data[0].tipo,
              referencia: response.data[0].referencia
            })
            setNewCount(response.data[0].referencia);
          }else{
            setFolio(0)
            setFoliosData([])
            setFolioValues(defaultFolioValues)
          }
          
        } else {
          console.error('empresa, periodo, or mes is missing in localStorage.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();

    axios
    .get(API_CONTABILIDAD + "/Lineas/periodo", {
      params: { empresa, mes, periodo, tipo },
      headers: getHeaders(),
    })
    .then((response) => {
      setLineasTotalData(response.data);
    })
    .catch((err) => {
      
    });

    
  }, [tipo,actualizar] );

  useEffect(()=>{

    const foundObject = foliosData.find(item => item.numero === Number(folio))
    if (foundObject!=undefined && foundObject.referencia!=undefined  ) {
      
        if(foundObject.fecha!=undefined) {foundObject.fecha=formatDate(foundObject.fecha.split(" ")[0])}else{
          foundObject.fecha="";
        }
        if(foundObject.vencim!=undefined) {foundObject.vencim=formatDate(foundObject.vencim.split(" ")[0])}else{
          foundObject.vencim="";
        }
        
        setFolioValues({
          noDoc: foundObject.noDoc,
          fecha: foundObject.fecha,
          rut: foundObject.rut,
          dv: foundObject.dv,
          id:foundObject.id,
          nombre: foundObject.nombre,
          glosa: foundObject.glosa,
          banco: foundObject.cuenta,
          valor: foundObject.valor,
          vencim: foundObject.vencim,
          type: foundObject.type,
          usuario:foundObject.usuario,
          fechareg: foundObject.fechaerg,
          tipo: foundObject.tipo,
          referencia: foundObject.referencia
        })
        
    }

    if(folio === 0){
      setLineasData([])
      return;
    }

    if(numCopia === 0){
      setNumCopia(1)
      return
    }

    if(foliosData.some(item => Number(item.numero) === Number(folio)) ){


      const fetchData = async () => {
        try {
          const { empresa, periodo, mes } = getLocalStorageParams();
          if (empresa && periodo && mes) {
            const response = await axios.get(API_CONTABILIDAD+`/Folios/lineas`, { 
              params: { empresa, periodo, mes, tipo, cuenta:folio },
              headers: getHeaders(),
            });
            
            setLineasData(response.data);
            console.log(response.data)
          } else {
            console.error('empresa, periodo, or mes is missing in localStorage.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }

    setEditable(false)

  }, [folio,tipo])

  const getLastFolioNum = (): Promise<number> => {
    const { empresa, periodo, mes } = getLocalStorageParams();
  
    return axios.get(API_CONTABILIDAD + `/Folios/numero`, {
      params: { empresa, periodo, mes, tipo },
      headers: getHeaders(),
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('No se pudo obtener el último folio', error);
      throw new Error('No se pudo obtener el último folio');
    });
  };

  
  const TableComprobantesContablesColumns = [
    {
      name: 'Cuenta',
      selector: (row: any) => row.cuenta,
      sortable: true,
      center: true,
      cell: (row: any) => {
        return (
          <div className=''>
            {row.cuenta}
          </div>
        );
      },
      width: '8%'
    },
    {
      name: 'Centro',
      selector: (row: any) => row.obra,
      sortable: true,
      center: true,
      cell: (row: any) => {
        return (
          <div className=''>
            {row.obra}
          </div>
        );
      },
      width: '8%'
    },
    {
      name: 'Item',
      selector: (row: any) => row.item,
      sortable: true,
      center: true,
      cell: (row: any) => {
        return (
          row.item
        );
      },
      width: '7%'

    },
    {
      name: 'Rut',
      selector: (row: any) => row.auxiliar,
      center: true,
      cell: (row: any) => {
        return (
          <div style={{ textAlign: 'right' }}>{row.auxiliar}</div>
        );
      },
      width: '9%'

    },
    {
      name: 'Nº Doc',
      selector: (row: any) => row.noDoc,
      cell: (row: any) => {
        return (
          <div>
              {row.noDoc}
          </div>

          
        );
      },
      width: '8%'

    },
    {
      name: 'Glosa',
      selector: (row: any) => row.glosa,
      wrap: true,
      cell: (row: any) => {
        return (
          row.glosa
        );
      },
      width: '24%'
    },
    {
      name: 'Debe',
      selector: (row: any) => row.debe,
      wrap: true,
      right: true,
      format: (row: any) => formatNumberWithPoints(row.debe)  ,
      cell: (row: any) => {
        return (
          Intl.NumberFormat("es-CL").format(row.debe) 
        );
      },
      width: '11%'

    },
    {
      name: 'Haber',
      selector: (row: any) => row.haber,
      wrap: true,
      right: true,
      format: (row: any) => formatNumberWithPoints(row.haber),
      cell: (row: any) => {
        return (
          Intl.NumberFormat("es-CL").format(row.haber) 
        );
      },
      width: '11%'

    },
    {
      name: "Editar",
      cell: (row:any) => {
        return (
          <button
          className={"disabled:opacity-50 center text-white bg-amber-400 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium my-3 rounded-lg text-sm px-2 py-2.5 text-center "}
          disabled={!editable}
          onClick={() => {handleToggleEdit(row.referencia)}}
        >
          <PencilSquareIcon className='w-4 h-4'/>
        </button>
        )
      },
      width: '6%'

    },
    {
      name: "Eliminar",
      cell: (row:any) => {
        return (
          <button
          className="disabled:opacity-50 center text-white  bg-red-400 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium my-3 rounded-lg text-sm px-3 py-2.5 text-center "
          disabled={!editable}
          onClick={() => {handleEraseLine(row.referencia)}}
        >
          <DocumentMinusIcon className='w-4 h-4'/>
        </button>
        )
      },
      width: '7%'

    },
  ];
  
  const handleInputChange= (columnName:any, rowId:any, newValue:any) => {

    let selected: any;
    
    if(columnName=="cuenta"){
      selected = cuentasData.find(cuenta => cuenta.codigo === Number(newValue));
      if (selected!=undefined) {  
        setEditedData((prevData: any) => {
          const updatedData = { ...prevData };
          updatedData["cuenta"] = newValue;
          updatedData["cuenta_nombre"] = selected.nombre;
          updatedData["cuentaObject"] = selected;
          return updatedData;
        });
      }else{  
        setEditedData((prevData: any) => {
          const updatedData = { ...prevData };
          updatedData["cuenta"] = newValue;
          updatedData["cuenta_nombre"] = "";
          updatedData["cuentaObject"] = null;
          return updatedData;
        });
      }
    }else if (columnName === "obra"){
      selected = centros.find(centro => centro.codigo === Number(newValue));
    }else if (columnName === "item"){
      selected = Items.find(item => item.codigo === Number(newValue));
    }else if (columnName === "flujo"){
      selected = flujosData.find(flujo => flujo.codigo === Number(newValue));
    }else if (columnName === "auxiliar"){
      selected = ruts.find( rut => rut.codigo === Number(newValue));
    }

    if(columnName === "auxiliar"|| columnName === "flujo" || columnName === "item" || columnName === "obra"){
      if (selected!=undefined) {  
        setEditedData((prevData: any) => {
          const updatedData = { ...prevData };
          updatedData["cuenta"] = newValue;
          updatedData["cuenta_nombre"] = selected.nombre;
          updatedData["cuentaObject"] = selected;
          return updatedData;
        });
      }else{  
        setEditedData((prevData: any) => {
          const updatedData = { ...prevData };
          updatedData["cuenta"] = newValue;
          updatedData["cuenta_nombre"] = "";
          updatedData["cuentaObject"] = null;
          return updatedData;
        });
      }
    }

    if (columnName!= "feDoc" || columnName!= "feVen") {
      setEditedData((prevData: any) => {
        const updatedData = { ...prevData };
        updatedData[columnName] = newValue;
        return updatedData;
      });;
    } 
    else{
      setEditedData((prevData: any) => {
        const updatedData = { ...prevData };
        updatedData[columnName] = newValue;
        return updatedData;
      });;
    }
      

  }

  const handleEditChange= () => {


    const {isValidData,errors} = verificarDatosEditados();


    if (isValidData) {
      const cleanedEditedData = { ...editedData };
      delete cleanedEditedData.cuenta_nombre;
      delete cleanedEditedData.auxiliar_nombre;
      delete cleanedEditedData.flujo_nombre;
      delete cleanedEditedData.obra_nombre;
      delete cleanedEditedData.item_nombre;
      delete cleanedEditedData.cuentaObject;

      setLineasData((prevLineasData:any) => {
        const updatedLineasData = prevLineasData.map((fila:ILineas) =>
          fila.referencia === cleanedEditedData.referencia ? cleanedEditedData : fila
        );

        return updatedLineasData;
      });

      setModalOpen(false);
      setEditedData(null);
    } else {

      setToasts([...toasts, dangerToast(`${errors} no tienen datos validos.`)])

    }

  }

  const verificarDatosEditados = () => {
    let isValidData = true;
    let errors = [];

    if (editedData?.glosa===undefined || editedData.glosa==="") {
      errors.push("Glosa ");
      isValidData = false;
    }

    if (!cuentasData.some((cuenta) => cuenta.codigo === Number(editedData?.cuenta))) {
      errors.push("Cuenta,");
      isValidData = false;
      return { isValidData, errors };
    }
    if (editedData?.cuentaObject?.rut != "N") {
      if ( !ruts.some((rut) => rut.codigo === Number(editedData?.auxiliar))) {
        errors.push("Rut,");
        isValidData = false;
      }
    }
    if (editedData?.cuentaObject?.centro != "N") {
      if ( !centros.some((centro) => centro.codigo === Number(editedData?.obra))) {
        errors.push("Centro,");
        isValidData = false;
      }
    }
    if (editedData?.cuentaObject?.item != "N") {
      if ( !Items.some((item) => item.codigo === Number(editedData?.item))) {
        errors.push("Item,");
        isValidData = false;
      }
    }
    if ((editedData?.flujo != 0 || editedData?.flujo != null) && !flujosData.some((flujo) => flujo.codigo === Number(editedData?.flujo))) {
      errors.push("Flujo,");
      isValidData = false;
    }    

    if (editedData?.debe === 0 && editedData.haber === 0) {
      errors.push("Debe o Haber tienen que ser mayor que 0, ");
      isValidData = false;
    }
    

    return { isValidData, errors };
  };

  const handleToggleEdit = (referencia:any) => {
    const selectedData = lineasData.find((fila) => fila.referencia === referencia);
   
    if (selectedData) {
      const cuenta = (cuentasData.find((cuenta) => cuenta.codigo === selectedData.cuenta));
        if (cuenta) {
          selectedData["cuenta_nombre"] = cuenta.nombre;
          selectedData["cuentaObject"] = cuenta;
        const centro = centros.find(centro => centro.codigo === selectedData.obra);
        if (centro) {
          selectedData["obra_nombre"] = centro.nombre;
        }
        const item = Items.find(item => (item.codigo === Number(selectedData.item)));
        if (item) {
          selectedData["item_nombre"] = item.nombre;
        }
        const rut = ruts.find(rut => (rut.codigo === Number(selectedData.auxiliar)));
        if (rut && (rut.codigo!=0)) {
          selectedData["auxiliar_nombre"] = rut.nombre
        }
        const flujo = flujosData.find(flujo => (flujo.codigo === selectedData.flujo));
        if (flujo) {
          selectedData["flujo_nombre"] = flujo.nombre;
        }
      }
      setEditedData(selectedData);
    }
    
    setModalOpen(true);
  };


  const handleModalClose = () => {
    setModalOpen(false);
    setEditedData(null);
  };


  const handleLeft = () =>{
    if(foliosData.length > 0 && foliosData[0].numero < folio){
      const number=Number(folio)-1
      setFolio(number)
    }
  }
  const handleRight = () =>{
    if(foliosData.length > 0 && foliosData.at(-1).numero > folio){
      const number=Number(folio)+1
      setFolio(number)
    }
  }

  const handleFinal = () =>{
      setFolio(foliosData.at(-1).numero)
  }

  const handleStart = () =>{
      setFolio(foliosData[0].numero)
  }

  const handleAddLine = () =>{
    setNewCount(newCount+1)
    setLineasData([...lineasData, {cuenta:0, feDoc: "",noDoc:0 ,obra:0, debe: 0, haber: 0, feVen:"", item:0, auxiliar:0, td:0, codigoCP:0, flujo:0, type:"new", referencia:newCount, glosa:""}])
  }   

  const handleEraseLine = (referencia:any) => {
    setToastConfirm((prevToasts) => [
      ...prevToasts,
      confirmationToast('¿Estás seguro de que deseas eliminar esta línea?', () => {
        const selectedLinea = lineasData.find((fila) => fila.referencia === referencia);
    
        if (selectedLinea) {
          const updatedLineasData = lineasData.filter((fila) => fila.referencia !== referencia);
          setLineasData(updatedLineasData);
        }
      }),
    ]);

  }

  const handleSearch = () => {
    setFoliosSelector(true)
  }

  const CopiaFolio = async (reversa: number) => {
    if (!["G", "I", "E", "T"].includes(tipo)) {
      setToasts([...toasts, dangerToast("Sólo se pueden agregar tipos G, I, E, T. ")]);
      return;
    }
  
    if (foliosData.length === 0) {
      return;
    }
  
    if (folioValues.type === "new") {
      setToasts([...toasts, dangerToast("No ha guardado este folio.")]);
      return;
    }
  
    setNumCopia(0);
  
    try {
      const lastFolioNum = await getLastFolioNum();
  
      if (reversa === 0) {
        setFolioValues({ ...folioValues, type: "new", fecha: obtenerFechaActual(), referencia: newCount, id: 0 });
        setLineasData((prevLineasData) => {
          const updatedLineasData = prevLineasData.map((fila) => {
            const auxHaber = fila.haber;
            const auxDebe = fila.debe;
            return {
              ...fila, // Mantener la fila
              debe: auxHaber,
              haber: auxDebe,
              numero: lastFolioNum + 1,
            };
          });
  
          return updatedLineasData;
        });
      } else {
        setFolioValues({ ...folioValues, type: "new", fecha: obtenerFechaActual(), referencia: newCount, id: 0 });
        console.log("cambio");
        setLineasData((prevLineasData) => {
          const updatedLineasData = prevLineasData.map((fila) => {
            return {
              ...fila, // Mantener la fila
              numero: lastFolioNum + 1,
            };
          });
  
          return updatedLineasData;
        });
        console.log("camb22io");
      }
      setEditable(!editable) 
    

      setFolio(foliosData.at(-1).numero + 1) // Realizar la funcion de obtener el ultimo numero de folio de la base de datos
      setFoliosData([...foliosData, {numero: foliosData.at(-1).numero + 1}]);

    } catch (error) {
      console.error('Error al obtener el último folio:', error);
      // Manejar el error según tus necesidades
    }
  };

  const handleCreateFolio = async () => {
    if (!["G", "I", "E", "T"].includes(tipo)) {
      setToasts([...toasts, dangerToast("Sólo se pueden agregar tipos G, I, E, T. ")]);
      return;
    }
  
    try {
      const lastFolioNum = await getLastFolioNum();
  
      if (foliosData.length > 0) {
        if (folioValues.type === "new") {
          setFolioValues({
            noDoc: 0,
            fecha: obtenerFechaActual(),
            rut: 0,
            dv: "",
            id: 0,
            nombre: "",
            glosa: "",
            banco: "",
            valor: 0,
            vencim: "",
            type: "new",
            usuario: "",
            fechareg: "",
            tipo: "",
            referencia: newCount,
          });
          setFolio(lastFolioNum);
          setLineasData([]);
          return;
        }
  
        setFolioValues({
          noDoc: 0,
          fecha: obtenerFechaActual(),
          rut: 0,
          dv: "",
          id: 0,
          nombre: "",
          glosa: "",
          banco: "",
          valor: 0,
          vencim: "",
          type: "new",
          usuario: "",
          fechareg: "",
          tipo: "",
          referencia: newCount,
        });
  
        setFolio(lastFolioNum + 1);
        setFoliosData([...foliosData, { numero: lastFolioNum + 1 }]);
      } else {
        setFoliosData([]);
        setFolio(Number(getLocalStorageParams().mes + "0000") + 1);
        setFolioValues({
          noDoc: 0,
          fecha: obtenerFechaActual(),
          rut: 0,
          dv: "",
          id: 0,
          nombre: "",
          glosa: "",
          banco: "",
          valor: 0,
          vencim: "",
          type: "new",
          usuario: "",
          fechareg: "",
          tipo: "",
          referencia: newCount,
        });
      }
  
      setLineasData([]);
    } catch (error) {
      console.error('Error al obtener el último folio:', error);
      // Manejar el error según tus necesidades
    }
  };

  const handleSaveFolio = async () => {

    console.log("SAVING DATA...");
  
    if(lineasData.length < 1){
      setToasts([...toasts, dangerToast("Folio no está asignado correctamente.")])
      return;
    }

    if (folioValues.glosa==="" || folioValues.glosa===undefined) {
      setToasts([...toasts, dangerToast("No ah ingresado una glosa al folio.")])
      return;
    }

    const debe = lineasData.reduce((accumulator, currentObject) => {
      return accumulator + Number(currentObject.debe);
    }, 0)

    const haber = lineasData.reduce((accumulator, currentObject) => {
      return accumulator + Number(currentObject.haber);
    }, 0)

    if(debe !== haber){
      setToasts([...toasts, dangerToast("Debe requiere ser igual que el Haber.")])
      return;
    }

    if (debe===0) {
      setToasts([...toasts, dangerToast("El detalle tiene que se mayor a 0.")])
      return;
    }
  
    const { empresa, periodo, mes } = getLocalStorageParams();
  
    try {
      const lastFolioNum = await getLastFolioNum();
      
      let data = lineasData

      let folionum=folio;
      // Comparar el número actual con el último número de la base de datos
      if (folio !== lastFolioNum+1 && folioValues.type === "new") {
        folionum=(lastFolioNum + 1);
        data = data.map((item) => {
          return {
            ...item,
            numero: folionum,
          };
        });
      }
  
      
    
      data = data.map(item => {
        if(item.type === "new"){
          item.empresa = Number(empresa);
          item.periodo = Number(periodo);
          item.tipo = tipo;
          item.numero = folionum;
          item.referencia = 0;
          item.usuario = secureLocalStorage.getItem("USER") as string;
          item.fechaReg = new Date().toISOString().split('T')[0];
          if (!item.feDoc) {
            item.feDoc = "0000-00-00"; 
          }
          if(!item.feVen){
            item.feVen = "0000-00-00";
          }
        }else{  
          item.type === "update"
          let fedoc=formatDate(item.feDoc.split(" ")[0]);
          let feven=formatDate(item.feVen.split(" ")[0]);
          let fecha=formatDate(item.fecha?.split(" ")[0]);
          item.referencia = 0;
          let fechareg= new Date().toISOString().split('T')[0];
          
          item.feDoc = fedoc; 
          item.fechaReg = fechareg;
          item.feVen = feven; 
          item.fecha = fecha; 
          if (!item.feDoc) {
            item.feDoc = "0000-00-00"; 
          }
          if(!item.feVen){
            item.feVen = "0000-00-00";
          }

        }

        item.debe = Number(item.debe);
        item.haber = Number(item.haber);

        return item
      })

      const folioObject:any = folioValues;
      folioObject.cuenta = folioValues.banco;
      delete folioObject.banco;
      const folioLineas = data


      if(folioObject.type === "new"){

        console.log(data)
        console.log(folioLineas)

        folioObject.usuario = secureLocalStorage.getItem("USER") as string;
        folioObject.fechareg = new Date().toISOString().split('T')[0];
        folioObject.empresa = Number(empresa);
        folioObject.periodo = Number(periodo);
        folioObject.tipo = tipo;
        folioObject.numero = Number(folionum);
        folioObject.valor = Number(debe);
        folioObject.debe = Number(debe);
        folioObject.haber = Number(haber);
        folioObject.fecha = folioObject.fecha === "" ? "0000-00-00" : folioObject.fecha;
        folioObject.vencim = folioObject.vencim === "" ? "0000-00-00" : folioObject.vencim;
        folioObject.referencia = 0;


        axios.post(API_CONTABILIDAD + "/Folios/completo", {folio: folioObject, lineas:folioLineas} , {headers: getHeaders()})
        .then((response) => {
          setActualizar(actualizar+1);
          setToasts([...toasts, defaultSuccessToast]) 
        }).catch((error) => {
          setToasts([...toasts, dangerToast("Error en la operación.")])
        });
      }else{
        folioObject.usuario = secureLocalStorage.getItem("USER") as string;
        folioObject.fechareg = new Date().toISOString().split('T')[0];
        folioObject.empresa = Number(empresa);
        folioObject.periodo = Number(periodo);
        folioObject.tipo = tipo;
        folioObject.numero = Number(folio);
        folioObject.valor = Number(debe);
        folioObject.debe = Number(debe);
        folioObject.haber = Number(haber);
        folioObject.fecha = folioObject.fecha === "" ? "0000-00-00" : folioObject.fecha;
        folioObject.vencim = folioObject.vencim === "" ? "0000-00-00" : folioObject.vencim;

        console.log(folioObject)
        axios.post(API_CONTABILIDAD + "/Folios/completo", {folio: folioObject, lineas:folioLineas} , {headers: getHeaders()})
        .then((response) => {
          setActualizar(actualizar+1);
          setToasts([...toasts, defaultSuccessToast]) 
          
        }).catch((error) => {
          setToasts([...toasts, dangerToast("Error en la operación.")])
        });
      }
  
    } catch (error) {
      console.error('Error ', error);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar la acción predeterminada del formulario al presionar "Enter"
      
      const formElements = e.currentTarget.querySelectorAll(
        'input, button, select, textarea'
      );

      console.log(formElements); 
      
      const currentTabIndex = e.target.tabIndex;
  
      if (
        !formElements[currentTabIndex].disabled &&
        formElements[currentTabIndex].tagName === 'BUTTON'
      ) {
          formElements[currentTabIndex].click();
          for (let i = currentTabIndex + 1; i < formElements.length; i++) {
            if (
              formElements[i].tabIndex > currentTabIndex &&
              !formElements[i].disabled
            ) {
              formElements[i].focus();
              break;
            }
          }
      } else {
        // Si el elemento actual no es un botón o está deshabilitado
        for (let i = currentTabIndex + 1; i < formElements.length; i++) {
          if (
            formElements[i].tabIndex > currentTabIndex &&
            !formElements[i].disabled
          ) {
            formElements[i].focus();
            break;
          }
        }
      }
    }
  };

  const XLSX = require('xlsx');

  const readExcelFile = (file:any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const lines = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
            // Assuming your data starts from the second row (index 1)
            
            const columns = lines.slice(1).map((row:any) => ({
                cuenta: row[0] || 0,
                obra: row[1] || 0,
                item: row[2] || 0,
                auxiliar: row[3] || 0,
                noDoc: row[4] || 0,
                td: row[5] || 0,
                feDoc: row[6] || "",
                feVen: row[7] || "",
                nroRef: row[8] || 0,
                codigoCP: row[9] || 0,
                debe: row[10] || 0,
                haber: row[11] || 0,
                flujo: row[12] || 0,
                glosa: row[13] || "",
                type:"new",
                referencia:newCount
            }));

            resolve(columns);
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsBinaryString(file);
    });
  };

  function getExcelFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  
      input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
          resolve(file);
        } else {
          reject(new Error("No se seleccionó ningún archivo."));
        }
      });
  
      input.click();
    });
  }

  const loadExcelData = () => {
    getExcelFile()
      .then((file) => {
        return readExcelFile(file); // Devuelve la promesa para encadenar otro .then()
      })
      .then((columns) => {
        console.log(columns);

        const nuevasLineas = columns.map((column:ILineas) => ({
          cuenta: column.cuenta || 0,
          feDoc: column.feDoc || "",
          noDoc: column.noDoc || 0,
          obra: column.obra || 0,
          debe: column.debe || 0,
          haber: column.haber || 0,
          feVen: column.feVen || "",
          item: column.item || 0,
          auxiliar: column.auxiliar || 0,
          td: column.td || 0,
          codigoCP: column.codigoCP || 0,
          flujo: column.flujo || 0,
          type: "new",
          referencia: newCount,
          glosa: column.glosa || "",
        }));
        
        const {isValidData,errors} = validateLines(columns);


        if (isValidData) {
          setLineasData([...lineasData, ...nuevasLineas]);

          setModalOpen(false);
          setEditedData(null);
        } else {

          setToasts([...toasts, dangerToast(`${errors} .`)])

        }
  
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  const validateLines = (lines: any) => {
    let isValidData = true;
    let errors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line?.glosa===undefined || line.glosa==="") {
        errors.push("Glosa en la linea : "+(i+1)+"\n");
        isValidData = false;
      }
  
      if (line?.cuenta===undefined || line.cuenta==="" || !cuentasData.some((cuenta) => cuenta.codigo === Number(line?.cuenta))) {
        errors.push("Cuenta no valida "+ line.cuenta+"\n");
        isValidData = false;
        return { isValidData, errors };
      }

      const cuentaObject = cuentasData.find((cuenta) => cuenta.codigo === Number(line?.cuenta));

      if (cuentaObject?.rut != "N") {
        if ( !ruts.some((rut) => rut.codigo === Number(line?.auxiliar))) {
          errors.push("Rut "+line.auxiliar+"\n");
          isValidData = false;
        }
      }else{
        if (line.auxiliar!=0) {
          errors.push("Cuenta:"+ line.cuenta+" no debe tener Rut \n");
          isValidData = false;
        }
      }

      if (cuentaObject?.centro != "N") {
        if ( !centros.some((centro) => centro.codigo === Number(line?.obra))) {
          errors.push("Centro: "+line.obra +"\n");
          isValidData = false;
        }
      }else{
        if (line.obra!=0) {
          errors.push("Cuenta:"+ line.cuenta+" no debe tener Centro \n");
          isValidData = false;
        }
      }

      if (cuentaObject?.item != "N") {
        if ( !Items.some((item) => item.codigo === Number(line?.item))) {
          errors.push("Item: "+line.item + "\n");
          isValidData = false;
        }
      }else{
        if (line.item!=0) {
          errors.push("Cuenta:"+ line.cuenta+" no debe tener Item \n");
          isValidData = false;
        }
      }

      if ((line?.flujo != 0 || line?.flujo != null) && !flujosData.some((flujo) => flujo.codigo === Number(line?.flujo))) {
        errors.push("Flujo :"+ line.flujo +"\n");
        isValidData = false;
      }    
      if (line?.debe != 0 && line.haber != 0) {
        errors.push("Debe o Haber uno tiene que ser 0, linea:"+ i+1 +"\n");
        isValidData = false;
      }
      if (line?.debe === 0 && line.haber === 0) {
        errors.push("Debe o Haber tienen que ser mayor que 0, linea:"+ i+1 +"\n");
        isValidData = false;
      }

    }
    return { isValidData, errors };
  };
  
  
  return (
    <section className='w-full h-4/5'>

        <div className='grid grid-cols-6 gap-4 mb-2'>
            <div id="datos-contable" className='col-span-5 bg-white dark:bg-slate-800 p-3'>
                <div className='flex mb-1 items-end gap-2'>
                  
                  <Select label='Tipo de Comprobante' name="tipo" title='Tipo de Comprobante' onChange={(e:any) => setTipo(e.target.value)} options={tipoComprobantes} error={false} size='md'/>
                  <Input className='w-full' size='md' type="text" label="Número" onChange={(e:any) => setFolio(e.target.value)} value={folio} name='folio' placeholder='' />
                  

                  <ContableButton tooltipText='Editar Folio' onClick={() => {
                   setEditable(!editable) 
                  }}
                  disabled={folio < 1}
                  >
                    <PencilSquareIcon className='w-4 h-4'/>
                  </ContableButton>
                  <ContableButton disabled={editable} tooltipText='Crear un nuevo Folio' onClick={handleCreateFolio}>
                    <PlusIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton disabled={editable} tooltipText='Duplicar Folio' onClick={() => CopiaFolio(1)}>
                    <Image
                        src={copia}
                        alt="Duplicar"
                        className='w-4 h-4'
                      />
                  </ContableButton>
                  <ContableButton disabled={editable} tooltipText='Duplicar Folio, Reversa Debe y Haber' onClick={() => CopiaFolio(0)}>
                    <Image
                      src={reversa}
                      alt="Reversa"
                      className='w-4 h-4'
                    />
                  </ContableButton>
              
                  <div>
                    
                    <label className="block dark:text-white text-gray-700 text-sm font-bold mb-1"
                      htmlFor="fechares">Fecha</label>

                    <input
                      type="date"
                      placeholder="2018-01-01"
                      className="border mr-8 rounded-sm shadow px-3 py-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="fecha"
                      value={folioValues.fecha}
                      onChange={(e) => setFolioValues({...folioValues, fecha: e.target.value})} 
                      disabled={!editable}
                    />
                  </div>
                  <ContableButton tooltipText='Buscar Folio por Glosa' onClick={handleSearch} disabled={!tipo || editable}>
                    <MagnifyingGlassIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton tooltipText='Guardar folio' onClick={handleSaveFolio} disabled={!editable}>
                    <Image
                      src={disk}
                      alt="Guardar"
                      className='w-4 h-4'
                    />
                  </ContableButton>

                  <ContableButton tooltipText='Guardar comprobante como pdf' onClick={CreatePDF} >
                  <Image
                      src={impresora}
                      alt="Imprimir pdf"
                      className='w-4 h-4'
                    />   
                  </ContableButton>
                  <ContableButton tooltipText='Subir lineas por excel' onClick={loadExcelData}  disabled={!editable} >
                  <Image
                      src={excelLinea}
                      alt="tabla excel"
                      className='w-4 h-4'
                    />   
                  </ContableButton>
                </div>
                
                <div className='flex gap-3'>
                    <div className='flex '>
                      <Input className='w-full text-end ' size='md' type='text' label='Rut' placeholder='11.111.111-1' name="rut" value={folioValues.rut} onChange={(e) => {
                         
                          const inputValue = e.target.value
                          if (/^[0-9]*$/.test(inputValue)) {
                            const truncatedValue = inputValue.slice(0, 8);
                            setFolioValues({...folioValues, rut: Number(truncatedValue)})
                          }
                        }
                          
                      } disabled={!editable}/>
                      <div className='my-auto mt-6 mx-1 '>
                        -
                      </div>
                      <Input className='w-9 pr-4 ' size='md' type='text' label='Dv' name="dv" value={folioValues.dv} onChange={(e) => {
                         
                         const inputValue = e.target.value
                         if (/^[0-9]*$/.test(inputValue)) {
                           const truncatedValue = inputValue.slice(0, 1);
                           setFolioValues({...folioValues, dv: (truncatedValue)})} 
                         }
                     } disabled={!editable}/>

                      <ContableButton tooltipText='Buscar Rut' className=' ml-2 h-7 my-auto mt-6 '  onClick={()=>{ setRutFolioSelector(true)}}disabled={!editable}>
                          <div >...</div>
                      </ContableButton>
                    </div>
                    <div className='w-full'>
                      <Input className='w-full' size="md" type='text' label='Nombre' placeholder='' value={folioValues.nombre} onChange={(e)=> setFolioValues({...folioValues, nombre:e.target.value})} name="nombre" disabled={!editable}/>
                    </div>
                </div>
                
                <div className='flex gap-3 w-full'>
                  <Input className='w-full' size="md" type='text' label="Banco" name="banco" value={folioValues.banco} onChange={(e)=> setFolioValues({...folioValues, banco: e.target.value})} disabled={!editable}/>
                    <ContableButton tooltipText='Buscar Banco' className='h-7 my-auto mt-6 '  onClick={()=>{ setCuentaFolioSelector(true)}}disabled={!editable}>
                        <div >...</div>
                  </ContableButton>
                  <Input className='w-full' size="md" type='text' label="Nro Doc" name="noDoc" onChange={(e)=> setFolioValues({...folioValues, noDoc: Number(e.target.value)})} value={folioValues.noDoc} disabled={!editable}/>
                  
                  <Input size="md" type='text' className=' w-full text-right ' label="Valor" name="valor" value={Intl.NumberFormat("es-CL").format(folioValues.valor) } onChange={(e)=> setFolioValues({...folioValues, valor: Number(e.target.value)})} disabled={true}/>
                  
                  <div>
                  <label className="block dark:text-white text-gray-700 text-sm font-bold mb-1"
                    htmlFor="fechares">Vencimiento</label>

                  <input
                    type="date"
                    placeholder="2018-01-01"
                    className="border rounded-sm shadow px-3 py-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="vencimiento"
                    value={folioValues.vencim}
                    onChange={(e) => setFolioValues({...folioValues, vencim: e.target.value})} 
                    disabled={!editable}
                  />
                  </div>
                </div>
                <div >
                <Input className='w-full' size="md" type='text' label="Glosa" name="glosa" value={folioValues.glosa} onChange={(e)=> setFolioValues({...folioValues, glosa: e.target.value})} disabled={!editable}/>
                </div>
            </div>

            <div id="configuracion" className='bg-white dark:bg-slate-800 p-2'>
              <div className='flex gap-1'>

                  <ContableButton  tooltipText='Ir al primer folio' onClick={handleStart} disabled={tipo==="" || editable}>
                    <ChevronDoubleLeftIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton tooltipText='Ir al folio anterior' onClick={handleLeft} disabled={tipo==="" || editable}>
                    <ChevronLeftIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton tooltipText='Ir al siguiente folio' onClick={handleRight} disabled={tipo==="" || editable}>
                    <ChevronRightIcon className='w-4 h-4'/>
                  </ContableButton>
                  
                  <ContableButton tooltipText='Ir al ultimo folio' onClick={handleFinal} disabled={tipo==="" || editable}>
                    <ChevronDoubleRightIcon className='w-4 h-4'/>
                  </ContableButton>

              </div>

            </div>
        </div>
        <div></div>
        <div id="tabla-contable" className='bg-white dark:bg-slate-800 dark:text-white'>
          <div className='grid justify-end'>
            <button
            className="disabled:opacity-50 center mr-8 text-white  bg-green-400 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium mb-1 rounded-lg text-sm px-3 py-2.5 text-center "
            disabled={!editable}
            onClick={handleAddLine} 
          >
            <PlusIcon className='w-4 h-4'/>
          </button>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'scroll'  }}>
            <DataTable
              columns={TableComprobantesContablesColumns}
              data={lineasData}
              customStyles={gridStyle}
              dense
              className='border dark:border-slate-900'
              theme={theme}
            />
          </div>
          <div className=' flex  mt-3'>
            <div className=' w-2/5 '>
              
            </div>
            <div className='w-3/12'>
            Totales Iguales
            </div>
            <div className='flex w-1/5 ' >       
              {lineasData && 
              <div className='text-sm text-end w-full border px-2 '>
                { 
                  lineasData.reduce((accumulator, currentObject) => {
                    return accumulator + Number(currentObject.debe);
                  }, 0).toLocaleString()
                }
              </div>}
              <div className='px-1'>=</div>
              <div className='text-sm text-end w-full border px-2 '>
              { 
                lineasData.reduce((accumulator, currentObject) => {
                  return accumulator + Number(currentObject.haber);
                }, 0).toLocaleString()
              }
              </div> 
            </div>
            
          </div>
        </div>

        <ToastList position='center' toasts={toastConfirm} setToasts={setToastConfirm}/>
        <ToastList toasts={toasts} setToasts={setToasts}/>
        
        {/*Modal Para editar Fila*/}
        { isModalOpen && 
           <div>
              <div
                className="fixed top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-50 "
                onClick={handleModalClose}
              ></div>
              <div className={`max-h-screen-md overflow-y-auto flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 z-60 ${isModalOpen ? '' : 'hidden'}`}>
                  <div className="relative w-1/2 px-4 max-h-full">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-2  border-b rounded-t dark:border-gray-600">
                          <h3 className="text-xl ml-4 font-semibold text-gray-900 dark:text-white">
                            Editar Linea
                          </h3>
                          <button
                            type="button"
                            onClick={handleModalClose}
                            className="mr-8 w-auto dark:text-white h-10 flex items-center"
                            data-modal-toggle="crud-modal"
                          >
                            <XMarkIcon className='w-6 h-6'></XMarkIcon>
                          </button>
                        </div>
                        
                        <form onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => handleKeyDown(e)}>
                            <div className="flex-row p-3 md:p-5 ">
                              <div className="gap-4 mx-3 ">
                                <div className="mb-2 col-span-2 dark:text-white">
                                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Cuenta
                                  </label>
                                  <div className="flex ">
                                      <div className=" justify-between  w-full flex">
                                          
                                          <input
                                              type="text"
                                              className="bg-gray-50 border text-center border-black p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                                              dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 
                                              text-gray-900 text-sm pl-4 rounded-lg w-1/4 focus:ring-primary-600
                                              focus:border-primary-600 flex-grow mr-2 "
                                              value={editedData?.cuenta}
                                              onFocus={evento => evento.target.select()}
                                              
                                              onChange={(e) => {
                                                const inputValue = e.target.value
                                                if (/^[0-9]*$/.test(inputValue)) {
                                                  const truncatedValue = inputValue.slice(0, 4);
                                                  handleInputChange('cuenta', editedData?.referencia, Number(truncatedValue))
                                                }}
                                              }
                                              tabIndex={0}
                                          />
                                          <button
                                              className=" bg-gray-400 dark:bg-gray-200 dark:text-black p-2  mr-3 rounded-md text-white text-sm"
                                              onClick={() => {
                                                  setCuentaSelector(true);
                                              }}
                                              tabIndex={1}
                                          >
                                              ...
                                          </button>
                                          <div className='bg-gray-50  border border-black p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400
                                              dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 
                                              text-gray-900 text-sm rounded-lg w-3/4 focus:ring-primary-600
                                              focus:border-primary-600'>
                                            {editedData?.cuenta_nombre && <p className=" mr-8">{editedData.cuenta_nombre}</p>}
                                          </div>
                                          
                                      </div>
                                  </div>                                                      
                                </div>
                                <div className=" mb-2  col-span-2  ">
																		
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Centro
                                    </label>

                                    <div className='flex'>
                                      <div className=" justify-between w-full flex">
                                        
                                        <input
                                            type="text"
                                            className={ "bg-gray-50 dark:text-white border text-center p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                          " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                          "text-gray-900 text-sm pl-4 rounded-lg w-1/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 flex-grow mr-2 "+ (editedData?.cuentaObject?.centro !== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}
                                            value={editedData?.obra} 
                                            onFocus={evento => evento.target.select()}
                                            onChange={(e) => {
                                              const inputValue = e.target.value
                                              if (/^[0-9]*$/.test(inputValue)) {
                                                const truncatedValue = inputValue.slice(0, 4);
                                                handleInputChange('obra', editedData?.referencia, Number(truncatedValue))
                                              }}
                                            } 
                                            tabIndex={2}
                                            disabled= {editedData?.cuentaObject?.centro != "S"}
                                        />
                                        
                                        <button className={"px-2 mr-3 rounded-md text-sm "+ (editedData?.cuentaObject?.centro !== "S" ? " bg-gray-200 opacity-2 dark:bg-gray-500 dark:text-black text-slate-500 " : "bg-gray-400 dark:bg-gray-200 dark:text-black text-white border-black ")}
                                         disabled= {editedData?.cuentaObject?.centro != "S"} tabIndex={3} onClick={()=>{
                                          setCentroSelector(true)
                                        }}>...</button>

                                        <div className={"bg-gray-50 dark:text-white border p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                            " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                            "text-gray-900 text-sm rounded-lg w-3/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 " + (editedData?.cuentaObject?.centro !== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}>
                                              
                                        {editedData?.obra_nombre && <p className=" mr-8">{editedData?.obra_nombre}</p>}

                                        </div>
                                        
                                    </div>
                                    
                                      
                                  </div>

                                </div>
                                    
                                <div className="mb-2  col-span-2  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Item
                                  </label>
                                  <div className='flex'>
                                    <div className=" justify-between w-full flex">
                                        <input
                                            type="text"
                                            className={ "bg-gray-50 dark:text-white border text-center p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                          " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                          "text-gray-900 text-sm pl-4 rounded-lg w-1/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 flex-grow mr-2 "+ (editedData?.cuentaObject?.item !== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}
                                            value={editedData?.item} 
                                            onFocus={evento => evento.target.select()}
                                            onChange={(e) => {
                                              const inputValue = e.target.value
                                              if (/^[0-9]*$/.test(inputValue)) {
                                                const truncatedValue = inputValue.slice(0, 4);
                                                handleInputChange('item', editedData?.referencia, Number(truncatedValue))
                                              }}
                                            }
                                            tabIndex={4}
                                            disabled= {editedData?.cuentaObject?.item != "S"}
                                        />
                                        <button className={"px-2 mr-3 rounded-md text-sm "+ (editedData?.cuentaObject?.item !== "S" ? " bg-gray-200 opacity-2 dark:bg-gray-500 dark:text-black text-slate-500 " : "bg-gray-400 dark:bg-gray-200 dark:text-black text-white border-black ")}
                                          disabled= {editedData?.cuentaObject?.item != "S"}
                                          tabIndex={5}
                                          onClick={()=>{
                                          setItemsSelector(true)
                                          
                                        }}>...</button>
                                        <div className={"bg-gray-50 dark:text-white border p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                            " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                            "text-gray-900 text-sm rounded-lg w-3/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 " + (editedData?.cuentaObject?.item !== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}>
                                              
                                              {editedData?.item_nombre && <p className="mr-8">{editedData?.item_nombre}</p>}

                                        </div>
                                        
                                    </div>    

                                   
                                    
                                  </div>    
                                 
                                </div>  
                                <div  className=" mb-2  col-span-2  dark:text-white">
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Rut
                                    </label>
                                    <div className='flex'>
                                      <div className=" justify-between w-full flex">
                                        <input
                                            type="text"
                                            className={ "bg-gray-50 dark:text-white border p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                          " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                          "text-gray-900 text-sm pl-4 rounded-lg w-1/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 flex-grow mr-2 "+ (editedData?.cuentaObject?.rut !== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}
                                            value={editedData?.auxiliar} 
                                            onFocus={evento => evento.target.select()}
                                            onChange={(e) => {
                                              const inputValue = e.target.value
                                              if (/^[0-9]*$/.test(inputValue)) {
                                                const truncatedValue = inputValue.slice(0, 8);
                                                handleInputChange('auxiliar', editedData?.referencia, Number(truncatedValue))
                                              }}
                                            }
                                            tabIndex={6}
                                            disabled= {editedData?.cuentaObject?.rut != "S"}
                                        />
                                        <button className={"px-2 mr-3 rounded-md text-sm "+ (editedData?.cuentaObject?.rut !== "S" ?" bg-gray-200 opacity-2 dark:bg-gray-500 dark:text-black text-slate-500 " : "bg-gray-400 dark:bg-gray-200 dark:text-black text-white border-black ")}
                                         disabled= {editedData?.cuentaObject?.rut != "S"}
                                         tabIndex={7}
                                         onClick={()=>{
                                            setRutSelector(true)
                                          }}>...</button>
                                        <div className={"bg-gray-50 dark:text-white border  p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                            " dark:focus:ring-primary-500 dark:focus:border-primary-500 "+
                                            "text-gray-900 text-sm rounded-lg w-3/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 " + (editedData?.cuentaObject?.rut!== "S" ? " border-gray-300 opacity-2 text-slate-500" : "border-black")}>
                                              
                                              {editedData?.auxiliar_nombre && <p className=" mr-8">{editedData?.auxiliar_nombre}</p>}

                                        </div>
                                        
                                      </div>    

                                   
                                    
                                    </div>
                                </div>     
                                
                              </div>
                              <div className="justify-between w-full flex mx-3 ">
                                  
                                  <div className=" w-1/4 dark:text-white">
                                    <label className='block mb-2 text-sm text-gray-900 dark:text-white'>
                                      Número Documento
                                    </label>
                                    
                                    <input type="text" className="bg-gray-50 border w-full mt-3 pl-4 border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  p-1  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 flex" 
                                      value={editedData?.noDoc} 
                                      onFocus={evento => evento.target.select()}
                                      tabIndex={8}
                                      onChange={(e) => {
                                        const inputValue = e.target.value
                                        if (/^[0-9]*$/.test(inputValue)) {
                                          const truncatedValue = inputValue.slice(0, 8);
                                          handleInputChange('noDoc', editedData?.referencia, Number(truncatedValue))
                                        }}
                                      } />
                                         
                                
                                  </div>          
                                  
                                  <div className=" py-4 pl-2 pt-4  dark:text-white">
                                    <button data-tooltip-id="tooltipDoc" tabIndex={9} data-tooltip-content="Modificar el tipo y fechas del documento" className="px-2 text-sm bg-gray-400 dark:bg-gray-200 dark:text-black h-full rounded-md mt-4 text-white"  onClick={()=>{
                                            setEditarDoc(true)
                                    }}>...</button>
                                      <Tooltip id="tooltipDoc" place="bottom" ></Tooltip>
                                  </div> 

                                  <div className='flex w-3/4 mx-3 mr-5 gap-3'>
                                    <div className="w-full dark:text-white">
                                      <label  className="block text-sm text-gray-900 dark:text-white">
                                        N° Ref
                                      </label>
                                      <input type="text" 
                                        className={"bg-gray-50 border mt-3 pl-4 border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500  flex"}
                                        value={editedData?.nroRef} 
                                        tabIndex={10}
                                        onFocus={evento => evento.target.select()}
                                        onChange={(e) => {
                                          const inputValue = e.target.value
                                          if (/^[0-9]*$/.test(inputValue)) {
                                            const truncatedValue = inputValue.slice(0, 4);
                                            handleInputChange('nroRef', editedData?.referencia, Number(truncatedValue))
                                          }}
                                        }
                                        />
                                      
                                    </div>
                                    <div className=" w-full dark:text-white">
                                      <label  className="block text-sm  text-gray-900 dark:text-white">
                                        CP
                                      </label>
                                      <input type="text" 
                                        className={"bg-gray-50 border  mt-3  pl-4 border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex"}
                                        value={editedData?.codigoCP} 
                                        onFocus={evento => evento.target.select()}
                                        tabIndex={11}
                                        onChange={(e) => {
                                          const inputValue = e.target.value
                                          if (/^[0-9]*$/.test(inputValue)) {
                                            const truncatedValue = inputValue.slice(0, 4);
                                            handleInputChange('codigoCP', editedData?.referencia, Number(truncatedValue))
                                          }}
                                        }
                                        />
                                      
                                    </div>
                                  </div>
                                    
                                  
                                  
                              </div>
                              

                                <div className="grid grid-cols-2 gap-4 m-3  ">
                                  <div className="col-span-2 sm:col-span-1  dark:text-white">
                                      <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Debe
                                      </label>
                                      <input
                                        type="text"
                                        className="bg-gray-50 border text-end border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex"
                                        value={editedData?.debe !== 0 ? Intl.NumberFormat("es-CL").format(Number(editedData?.debe)) : ''}
                                        disabled={editedData?.haber !== 0}
                                        onFocus={evento => evento.target.select()}
                                        tabIndex={12}
                                        onChange={(e) => {
                                          const inputValue = e.target.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
                                          if (!isNaN(Number(inputValue))) {
                                            handleInputChange('debe', editedData?.referencia, parseInt(inputValue, 10));
                                          }
                                        }}
                                      />
                                  </div>
                                  
                                  <div className="col-span-2 sm:col-span-1 dark:text-white">
                                    <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Haber
                                    </label>
                                    <input
                                        type="text"
                                        className="bg-gray-50 border text-end border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600 w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex"
                                        value={editedData?.haber !== 0 ? Intl.NumberFormat("es-CL").format(Number(editedData?.haber)) : ''}
                                        disabled={editedData?.debe !== 0}
                                        onFocus={evento => evento.target.select()}
                                        tabIndex={13}
                                        onChange={(e) => {
                                          const inputValue = e.target.value.replace(/[^\d]/g, ''); // Elimina caracteres no numéricos
                                          if (!isNaN(Number(inputValue))) {
                                            handleInputChange('haber', editedData?.referencia, parseInt(inputValue, 10));
                                          }
                                        }}
                                      />
                                    
                                  </div>
                                  
                                </div>
                                <div className="px-3 mb-2 col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Flujo
                                    </label>
                                    <div className='flex'>
                                      <div className=" justify-between w-full flex">
                                        <input
                                            type="text"
                                            className={ "bg-gray-50 border border-black p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                          "dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300"+
                                          "text-gray-900 text-sm pl-4 rounded-lg w-1/4 focus:ring-primary-600"+
                                            "focus:border-primary-600 flex-grow mr-2 "}
                                            value={editedData?.flujo} 
                                            onFocus={evento => evento.target.select()}
                                            tabIndex={14}
                                            onChange={(e) => {
                                              const inputValue = e.target.value
                                              if (/^[0-9]*$/.test(inputValue)) {
                                                const truncatedValue = inputValue.slice(0, 4);
                                                handleInputChange('flujo', editedData?.referencia, Number(truncatedValue))
                                              }}
                                            }
                                        />
                                        <button
                                          className="bg-gray-400 dark:bg-gray-200 dark:text-black px-2 mr-3 rounded-md text-white text-sm"
                                          tabIndex={15}
                                          onClick={() => {
                                              setFlujoSelector(true);
                                          }}>
                                          ...
                                      </button>

                                        <div className={"bg-gray-50 border border-black p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"+
                                            "dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 border-gray-300"+
                                            "text-gray-900 text-sm rounded-lg w-3/4 focus:ring-primary-600"+
                                            "focus:border-primary-600" }>
                                              
                                              {editedData?.flujo_nombre && <p className=" mr-8">{editedData.flujo_nombre}</p>}

                                        </div>
                                        
                                      </div>                     
                                    </div>
                                                                                   
                                </div>

                               
                                <div className="px-3 col-span-2  dark:text-white ">
                                  <label  className="block mb-2 w-full text-sm font-medium text-gray-900 dark:text-white">
                                    Glosa
                                  </label>
                                  <input type="text" className="bg-gray-50 px-4 border border-black text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                                  value={editedData?.glosa}
                                  tabIndex={16}
                                  onFocus={evento => evento.target.select()}
                                  onChange={(e) => handleInputChange('glosa', editedData?.referencia, e.target.value)} />
                                  
                                </div>
                                
                            </div>
                            <div className="flex justify-center h-20 dark:text-white">
																<button
																		onClick={handleEditChange}
                                    tabIndex={17}
																		className="text-white w-auto h-10 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 "
																>
																		Aceptar
																</button>
																
														</div>

                        </form>
                        
                    </div>
                  </div>

              </div> 
           </div>
          
          }

        
        {  editarDoc &&
          <section>
            <Modal width='w-2/5 ' type="info" title='Fechas y el tipo de documento' onClose={()=>setEditarDoc(false)}>
              <div className='grid grid-cols-2 gap-5'>
                <div className=" mb-2  dark:text-white">
                  <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Número Documento
                  </label>
                                      
                  <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                    value={editedData?.noDoc} 
                    onFocus={evento => evento.target.select()}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      if (/^[0-9]*$/.test(inputValue)) {
                        const truncatedValue = inputValue.slice(0, 8);
                        handleInputChange('noDoc', editedData?.referencia, Number(truncatedValue))
                      }}
                    } />
                </div>
                <div className=" mb-2  dark:text-white">
                  <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Tipo de Documento
                  </label>
                  <input type="number" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                    value={editedData?.td} onFocus={evento => evento.target.select()}
                    onChange={(e) => handleInputChange('td', editedData?.referencia, e.target.value)} />

                </div>
              </div>
              <div className='grid grid-cols-2 gap-5'>
                <div  className="mb-2 dark:text-white">
                  <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Fecha del Documento
                  </label>
                  <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                  value={formatDate(editedData?.feDoc.split(" ")[0])} 
                  onChange={(e) => handleInputChange('feDoc', editedData?.referencia, e.target.value)} />
                  
                </div>
                <div className="dark:text-white">
                  <label  className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                    Vencimiento
                  </label>
                  <input type="date" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                    value={formatDate(editedData?.feVen.split(" ")[0])} onChange={(e) => handleInputChange('feVen', editedData?.referencia, e.target.value)} 
                  />
                  
                </div>
              </div>
              
            </Modal>
          </section>
        }
        {isFoliosSelectorVisible && 
          <FolioSelector 
            folios = {foliosData}
            lineas= {lineasTotalData}
            handleSelectWithReference={(selected:any) => {
              setFolio(selected.numero)
              setFoliosSelector(false)
            }}
            onClose={()=>setFoliosSelector(false)}
          />
        }
        {isCuentaSelectorVisible && 
          <CuentaSelector 
            cuentas = {cuentasData}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData: any) => {
                const updatedData = { ...prevData };
                updatedData["cuenta"] = selected.codigo;
                updatedData["cuenta_nombre"] = selected.nombre;
                updatedData["cuentaObject"] = selected;
                return updatedData;
              });
              setCuentaSelector(false)
            }}
            onClose={()=>setCuentaSelector(false)}
          />
        } 

        {isFlujoSelectorVisible && 
          <FlujosSelector 
            flujos = {flujosData}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData: any) => {
                const updatedData = { ...prevData };
                updatedData["flujo"] = selected.codigo;
                updatedData["flujo_nombre"] = selected.nombre;
                
                return updatedData;
              });
              setFlujoSelector(false)
            }}
            onClose={()=>setFlujoSelector(false)}
          />
        } 

        {isCuentaSelectorFolioVisible && 
          <CuentaSelector 
            cuentas = {cuentasData}
            handleSelectWithReference={(selected:any) => {
              setFolioValues((prevData) => {
                const updatedData = { ...prevData };
                updatedData.banco = selected.codigo;
                return updatedData;
              });
              setCuentaFolioSelector(false)
            }}
            onClose={()=>setCuentaFolioSelector(false)}
          />
        } 
        {isRutSelectorFolioVisible && 
          <RutSelector 
            nombres = {ruts}
            handleSelectWithReference={(selected:any) => {
              setFolioValues((prevData) => {
                const updatedData = { ...prevData };
                updatedData.rut = selected.codigo;
                updatedData.nombre = selected.nombre;
                updatedData.dv = selected.dv;
                return updatedData;
              });
              setRutFolioSelector(false)
            }}
            onClose={()=>setRutFolioSelector(false)}
          />
        }

        {isRutSelectorVisible && 
          <RutSelector 
            nombres = {ruts}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData: any) => {
                const updatedData = { ...prevData };
                updatedData["auxiliar"] = selected.codigo;
                updatedData["dv"] = selected.dv;
                updatedData["auxiliar_nombre"] = selected.nombre
                return updatedData;
              });
              setRutSelector(false)
            }}
            onClose={()=>setRutSelector(false)}
          />
        } 

        {isCentroSelectorVisible && 
          <CentroSelector 
            centros = {centros}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData: any) => {
                const updatedData = { ...prevData };
                updatedData.obra = selected.codigo;
                updatedData["obra_nombre"] = selected.nombre;
                return updatedData;
              });
              setCentroSelector(false)
            }}
            onClose={()=>setCentroSelector(false)}
          />
        } 

        {isItemsSelectorVisible && 
          <ItemsSelector 
            items = {Items}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData:any) => {
                const updatedData = { ...prevData };
                updatedData["item"] = selected.codigo;
                updatedData["item_nombre"] = selected.nombre;
                return updatedData;
              });
              setItemsSelector(false)
            }}
            onClose={()=>setItemsSelector(false)}
          />
        }

        

        {confirmModal && 
          <Modal type="info" title='Confirmar cambios' onClose={()=>setConfirmModal(false)}>
              Los cambios realizados no han sido guardados, ¿desea continuar?
          </Modal>
        }
    </section>
  );
};

export default ComprobantesContables;