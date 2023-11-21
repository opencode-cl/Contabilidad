"use client"
import React, { useState, useEffect, useContext} from 'react';
import Input from '../Input';
import Select from '../Select';
import DataTable from 'react-data-table-component';
import { gridStyle } from '@/globals/tableStyles';
import ContableButton from './contableButton';
import { CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon, DocumentMinusIcon, DocumentPlusIcon, MagnifyingGlassIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';
import { API_CONTABILIDAD, SESSION_NAMES } from '@/variablesglobales';
import { RequestHeadersContext, RequestHeadersContextType } from '@/componentes/Providers/RequestHeadersProvider';
import { tipoComprobantes } from '@/globals/contabilidad/tipoComprobantes';
import { IToast, dangerToast } from '@/interfaces/IToast';
import ToastList from '../ToastList';
import { ThemeContext } from '@/componentes/Providers/darkModeContext';
import CuentaSelector from './cuentaSelector';
import RutSelector from './rutSeleccionador';
import Modal from '../Modal';
import CentroSelector from './centroSeleccionador';

interface comprobantesContablesProps {
}

const ComprobantesContables: React.FC<comprobantesContablesProps> = () => {

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext)

  const [isModalOpen, setModalOpen] = useState(false);

  const [tipo, setTipo] = useState("");
  const [folio, setFolio] = useState(0)
  const [foliosData, setFoliosData] = useState<any[]>([])
  const [lineasData, setLineasData] = useState<any[]>([])
  const [nombre_rut,setNombre_rut] = useState([])
  const [centros_select,setCentros] = useState([])
  const [editable, setEditable] = useState(false)
  const [newCount, setNewCount] = useState(0);

  const [cuentasData, setCuentasData] = useState([])
  const [lineaSelected, setLineaSelected] = useState(null)

  const [toasts, setToasts] = useState<IToast[]>([])
  const [confirmModal, setConfirmModal] = useState(false)
  const [isCuentaSelectorVisible, setCuentaSelector] = useState(false)
  const [isRutSelectorVisible, setRutSelector] = useState(false)
  const [isCentroSelectorVisible, setCentroSelector] = useState(false)

  
  const getLocalStorageParams = () => {
    const empresa = String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, '');
    const periodo = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, '');
    const mes = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH))!.replace(/"/g, '');
    return { empresa, periodo, mes };
  };

  const obtenerFechaActual = () => {
    const {empresa,periodo,mes} = getLocalStorageParams();
    const fechaActual = new Date();
    const year = String(fechaActual.getFullYear());
    const month = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Sumamos 1 ya que los meses comienzan desde 0
    const day = String(fechaActual.getDate()).padStart(2, '0');
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
    id:0,
    nombre: "",
    glosa: "",
    banco: "",
    valor: 0,
    vencimiento: "",
    type: "",
    usuario:"",
    fechareg:"",
    tipo:"",
    referencia: "NEW" + newCount
  }
  
  const [folioValues, setFolioValues] = useState(defaultFolioValues)
  const [lineasEliminadas, setLineasEliminadas] = useState<any[]>([])
  const [editedData, setEditedData] = useState([]);

  useEffect(() => {
    
    axios
    .get(API_CONTABILIDAD + "/Nombres/", { headers: getHeaders() })
    .then((response) => {
      setNombre_rut(response.data);
    })
    .catch((err) => {
      
    });

    axios
    .get(API_CONTABILIDAD + "/Centro/", { headers: getHeaders() })
    .then((response) => {
      setCentros(response.data);
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
    
  }, [])
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { empresa, periodo, mes } = getLocalStorageParams();
        if (empresa && periodo && mes) {
          const response = await axios.get(API_CONTABILIDAD+`/Folios/periodo`, {
            params: { empresa, periodo, mes, tipo },
            headers: getHeaders(),
          });
  
          if(response.data.length > 0){
            setFoliosData(response.data);
            setFolio(response.data[0].numero)
            setFolioValues(response.data[0])
          }else{
            setFolio(0)
            setFoliosData([])
            setFolioValues({
              noDoc: 0,
              fecha: obtenerFechaActual(),
              rut: 0,
              id:0,
              nombre: "",
              glosa: "",
              banco: "",
              valor: 0,
              vencimiento: "",
              type: "",
              usuario:"",
              fechareg:"",
              tipo:"",
              referencia: "NEW" + newCount
            })
          }
          
        } else {
          console.error('empresa, periodo, or mes is missing in localStorage.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [tipo] );

  useEffect(()=>{

    if(folio === 0){
      setLineasData([])
      return;
    }

    if(foliosData.some(item => Number(item.numero) === Number(folio))){
      const fetchData = async () => {
        try {
          const { empresa, periodo, mes } = getLocalStorageParams();
          if (empresa && periodo && mes) {
            const response = await axios.get(API_CONTABILIDAD+`/Folios/lineas`, { 
              params: { empresa, periodo, mes, tipo, cuenta:folio },
              headers: getHeaders(),
            });
    
            setLineasData(response.data);
          } else {
            console.error('empresa, periodo, or mes is missing in localStorage.');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData();
    }
  }, [folio])

  useEffect(() =>{
    setEditable(false)
  }, [folio, tipo]) 

  

  
 const TableComprobantesContablesColumns = [
    {
      name: 'Cuenta',
      selector: (row: any) => row.cuenta,
      sortable: true,
      cell: (row: any) => {
        return (
          row.cuenta
        );
      },
    },
    {
      name: 'Centro',
      selector: (row: any) => row.centro,
      sortable: true,
      cell: (row: any) => {
        return (
          row.centro
        );
      },
    },
    {
      name: 'Item',
      selector: (row: any) => row.item,
      sortable: true,
      cell: (row: any) => {
        return (
          row.item
        );
      },
    },
    {
      name: 'Rut',
      selector: (row: any) => row.auxiliar,
      cell: (row: any) => {
        return (
          row.auxiliar
        );
      },
    },
    {
      name: 'TD',
      selector: (row: any) => row.td,
      cell: (row: any) => {
        return (
          row.td
        );
      },
    },
    {
      name: 'Fecha Doc',
      selector: (row: any) => row.feDoc.split(" ")[0],
      cell: (row: any) => {
        return (
          row.feDoc
        );
      },
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
    },
    {
      name: 'N° Ref',
      selector: (row: any) => row.nroRef,
      wrap: true,
      cell: (row: any) => {
        return (
          row.nroRef
        );
      },
    },
    {
      name: 'CP',
      selector: (row: any) => row.codigoCP,
      wrap: true,
      cell: (row: any) => {
        return (
          row.codigoCP
        );
      },
    },
    {
      name: 'Debe',
      selector: (row: any) => row.debe,
      wrap: true,
      right: true,
      format: (row: any) => row.debe.toLocaleString(),
      cell: (row: any) => {
        return (
          row.debe
        );
      },
    },
    {
      name: 'Haber',
      selector: (row: any) => row.haber,
      wrap: true,
      right: true,
      format: (row: any) => row.haber.toLocaleString(),
      cell: (row: any) => {
        return (
          row.haber
        );
      },
    },
    {
      name: 'Vencimiento',
      selector: (row: any) => row.feVen.split(" ")[0],
      cell: (row: any) => {
        return (
          row.feVen.split(" ")[0]
        );
      },
      
    },
    {
      name: 'Flujo',
      selector: (row: any) => row.flujo,
      wrap: true,
      cell: (row: any) => {
        return (
          row.flujo
        );
      },
    },
    {
      name: "Editar",
      cell: (row:any) => {
        return (
          <button
          className="center text-white bg-amber-400 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium my-3 rounded-lg text-sm px-2 py-2.5 text-center "
          onClick={() => {handleToggleEdit(row.referencia)}}
        >
          <PencilSquareIcon className='w-6 h-6'/>
        </button>
        )
      }
    },
    {
      name: "Eliminar",
      cell: (row:any) => {
        return (
          <button
          className="center text-white  bg-red-400 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium my-3 rounded-lg text-sm px-3 py-2.5 text-center "
          onClick={() => {handleEraseLine(row.referencia)}}
        >
          <DocumentMinusIcon className='w-6 h-6'/>
        </button>
        )
      }
    },
  ];
  
  const handleInputChange= (columnName:any, rowId:any, newValue:any) => {
    console.log(rowId);

    setEditedData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[columnName] = newValue;
      return updatedData;
    });;

  }

  const handleEditChange= () => {
    setLineasData((prevLineasData) => {
      // Puedes agregar la lógica necesaria para determinar qué línea se está editando actualmente.
      // Supongamos que tienes una variable llamada currentEditingRow que contiene la referencia de la fila que se está editando.
  
      const updatedLineasData = prevLineasData.map((fila) =>
        fila.referencia === editedData.referencia ? editedData : fila
      );
      
      return updatedLineasData;
    });
    setModalOpen(false);
    setEditedData([]);
    // También puedes restablecer el estado de EditedData si es necesario
  }

  const handleToggleEdit = (referencia:any) => {
    const selectedData = lineasData.find((fila) => fila.referencia === referencia);
    setEditedData(selectedData);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditedData([]);
  };

  const handleSearch = () => {
    /// Rellenar con una busqyeda de los numero de folio ?????
    try {
      // Your existing code...
    } catch (error) {
      console.error('Error in handleSearch:', error);
    }
  }

  const handleLeft = () =>{
    if(foliosData.length > 0 && foliosData[0].numero < folio){
      setFolio(folio-1)
      const foundObject = foliosData.find(item => item.numero === folio-1)
      if(foundObject){
        setFolioValues(foundObject)
      }
    }
  }
  const handleRight = () =>{
    if(foliosData.length > 0 && foliosData.at(-1).numero > folio){
      setFolio(folio+1)
      const foundObject = foliosData.find(item => item.numero === folio+1)
      if(foundObject){
        setFolioValues(foundObject)
      }
    }
  }

  const handleAddLine = () =>{
    setNewCount(newCount+1)
    setLineasData([...lineasData, {cuenta:"", feDoc: "", debe: "0", haber: "0", feVen:"", item:0, auxiliar:0, td:0, codigoCP:0, flujo:0, type:"new", referencia:"NEW"+newCount}])
  }   

  const handleEraseLine = (referencia:any) => {
    const selectedLinea = lineasData.find((fila) => fila.referencia === referencia);

    if (selectedLinea) {
      // Filtra las líneas excluyendo aquella que tiene la referencia que deseas eliminar
      const updatedLineasData = lineasData.filter((fila) => fila.referencia !== referencia);
  
      // Actualiza el estado con las líneas filtradas
      setLineasData(updatedLineasData);
    }

  }

  const handleCreateFolio = () =>{
    
    if(!["G", "I", "E", "T"].includes(tipo)){
      setToasts([...toasts, dangerToast("Sólo se pueden agregar tipos G, I, E, T. ")])
      return
    }
      
    if(foliosData.length > 0){

        if(folioValues.type === "new" ){
          setFolioValues({...defaultFolioValues, type:"new"})
          setFolio(foliosData.at(-1).numero)
          setLineasData([])
          return
        }

        setFolioValues({...defaultFolioValues, type:"new"})
        setFolio(foliosData.at(-1).numero + 1)
        setFoliosData([...foliosData, {numero: foliosData.at(-1).numero + 1}]);
      }
      else{
        setFoliosData([])
        setFolio(Number(getLocalStorageParams().mes+ "0000") + 1)
        setFolioValues({
          noDoc: 0,
          fecha: obtenerFechaActual(),
          rut: 0,
          id:0,
          nombre: "",
          glosa: "",
          banco: "",
          valor: 0,
          vencimiento: "",
          type: "new",
          usuario:"",
          fechareg: "",
          tipo: "",
          referencia: "NEW" + newCount
        })
      }

      setLineasData([]) 
  }


  const handleSaveFolio = ()=>{

    console.log("SAVING DATA...")

    if(lineasData.length < 1){
      setToasts([...toasts, dangerToast("Folio no está asignado correctamente.")])
      return;
    }

    for (let i = 0; i < lineasData.length; i++) {

      const cuenta = lineasData[i].cuenta;

      if (cuenta === "") {
        setToasts([...toasts, dangerToast("Lineas sin cuenta asignada.")])
        return;
      }
      if(cuenta.length < 4){
        setToasts([...toasts, dangerToast("Cuenta " + cuenta + " incorrecta.")])
        return;
      }
      
      if (!cuentasData.some((e:any)=> e.codigo === cuenta)) {
        setToasts([...toasts, dangerToast("Cuenta " + cuenta + " no existe.")])
        return;
      }

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

    const { empresa, periodo, mes } = getLocalStorageParams();

    let data = lineasData.filter(item => item.action === "edit")

    data = data.map(item => {
      if(item.type === "new"){
        item.empresa = Number(empresa);
        item.periodo = Number(periodo);
        item.tipo = tipo;
        item.numero = folio;
        item.referencia = 0;
        item.dv = "0";
        item.usuario = secureLocalStorage.getItem("USER") as string;
        item.fechareg = new Date().toISOString().split('T')[0];

      }else{
        item.type === "update"
      }

      item.debe = Number(item.debe);
      item.haber = Number(item.haber);

      return item
    })

    const folioObject:any = folioValues;
    const folioLineas = data.concat(lineasEliminadas) as any

    if(folioObject.type === "new"){
      folioObject.usuario = secureLocalStorage.getItem("USER") as string;
      folioObject.fechareg = new Date().toISOString().split('T')[0];
      folioObject.empresa = empresa;
      folioObject.periodo = periodo;
      folioObject.tipo = tipo;
      folioObject.numero = folio;
      folioObject.value = debe;
      folioObject.debe = debe;
      folioObject.haber = haber;
      folioObject.fecha = folioObject.fecha === "" ? "0000-00-00" : folioObject.fecha;
      folioObject.vencimiento = folioObject.vencimiento === "" ? "0000-00-00" : folioObject.vencimiento;
      folioObject.dv = "";

      axios.post(API_CONTABILIDAD + "/Folios/completo", {folio: folioObject, lineas:folioLineas} , {headers: getHeaders()})
      .then((response) => {
        setFolioValues({...folioValues, type: ""})
      }).catch((error) => {
        setToasts([...toasts, dangerToast("Error en la operación.")])
      });
    }
  }

  return (
    <section className='w-full h-4/5'>

        <div className='grid grid-cols-6 gap-4 mb-2'>
            <div id="datos-contable" className='col-span-5 bg-white dark:bg-slate-800 p-3'>
                <div className='flex items-end gap-2'>
                  
                  <Select label='Número' name="numero" title='Número' onChange={(e:any) => setTipo(e.target.value)} options={tipoComprobantes} error={false} size='md'/>
                  <Input size='md' type="text" label="Número" onChange={(e:any) => setFolio(e.target.value)} value={folio} name='folio' placeholder='' />
                  
                  <ContableButton onClick={handleSearch}>
                    <MagnifyingGlassIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton onClick={() => {
                   setEditable(!editable) 
                  }}
                  disabled={folio < 1}
                  >
                    <PencilSquareIcon className='w-4 h-4'/>
                  </ContableButton>
                  <ContableButton onClick={handleCreateFolio}>
                    <PlusIcon className='w-4 h-4'/>
                  </ContableButton>
                  
                  <Input size="md" type='text' label="Nro Doc" name="noDoc" onChange={(e)=> setFolioValues({...folioValues, noDoc: Number(e.target.value)})} value={folioValues.noDoc} disabled={!editable}/>
                  <div>
                    
                    <label className="block dark:text-white text-gray-700 text-sm font-bold mb-1"
                      htmlFor="fechares">Fecha</label>

                    <input
                      type="date"
                      placeholder="2018-01-01"
                      className="border rounded-sm shadow px-3 py-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="fecha"
                      value={folioValues.fecha}
                      onChange={(e) => setFolioValues({...folioValues, fecha: e.target.value})} 
                      disabled={!editable}
                    />

                  </div>
                </div>
                
                <div className='flex gap-2'>
                    <Input size='md' type='text' label='Rut' placeholder='11.111.111-1' name="rut" value={folioValues.rut} onChange={(e) => setFolioValues({...folioValues, rut: Number(e.target.value)})} disabled={!editable}/>
                      <div className='w-full'>
                        <Input size="md" type='text' label='Nombre' placeholder='' value={folioValues.nombre} onChange={(e)=> setFolioValues({...folioValues, nombre:e.target.value})} name="nombre" disabled={!editable}/>
                      </div>
                </div>

                <div className='flex gap-2 w-full'>
                  <div className='w-4/5'>
                  <Input size="md" type='text' label="Glosa" name="glosa" value={folioValues.glosa} onChange={(e)=> setFolioValues({...folioValues, glosa: e.target.value})} disabled={!editable}/>
                  </div>
                  <Input size="md" type='text' label="Banco" name="banco" value={folioValues.banco} onChange={(e)=> setFolioValues({...folioValues, banco: e.target.value})} disabled={!editable}/>
                  <Input size="md" type='text' label="Valor" name="valor" value={folioValues.valor} onChange={(e)=> setFolioValues({...folioValues, valor: Number(e.target.value)})} disabled={!editable}/>
                  
                  <div>
                  <label className="block dark:text-white text-gray-700 text-sm font-bold mb-1"
                    htmlFor="fechares">Vencimiento</label>

                  <input
                    type="date"
                    placeholder="2018-01-01"
                    className="border rounded-sm shadow px-3 py-0.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="vencimiento"
                    value={folioValues.vencimiento}
                    onChange={(e) => setFolioValues({...folioValues, vencimiento: e.target.value})} 
                    disabled={!editable}
                  />
                  </div>
                  
                </div>
            </div>

            <div id="configuracion" className='bg-white dark:bg-slate-800 p-2'>
            <div className='flex gap-1'>

                  <ContableButton onClick={() => setFolio(foliosData[0].numero)}>
                    <ChevronDoubleLeftIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton onClick={handleLeft}>
                    <ChevronLeftIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton onClick={handleRight}>
                    <ChevronRightIcon className='w-4 h-4'/>
                  </ContableButton>

                  <ContableButton onClick={() => setFolio(foliosData.at(-1).numero)}>
                    <ChevronDoubleRightIcon className='w-4 h-4'/>
                  </ContableButton>

            </div>

            <div className="flex gap-1 mt-10">
                <ContableButton onClick={handleAddLine} disabled={!editable}>
                    <DocumentPlusIcon className='w-4 h-4'/>
                </ContableButton>

                <ContableButton onClick={handleEraseLine} disabled={!editable}>
                    <DocumentMinusIcon className='w-4 h-4'/>
                </ContableButton>

                <ContableButton onClick={handleSaveFolio} disabled={!editable}>
                  <CheckIcon className='w-4 h-4'/>
                </ContableButton>
            </div>

            </div>
        </div>

        <div id="tabla-contable" className='bg-white dark:bg-slate-800 dark:text-white'>
          <DataTable
            columns={TableComprobantesContablesColumns}
            data={lineasData}
            customStyles={gridStyle}
            dense
            className='border dark:border-slate-900'
            theme={theme}
          />
          <div className=''>
          <table className='text-sm'>
            <tr>
              <td className=''>
                <span>Totales Iguales</span>
              </td>
              {lineasData && 
              <td className='border px-2'>
                { 
                  lineasData.reduce((accumulator, currentObject) => {
                    return accumulator + Number(currentObject.debe);
                  }, 0).toLocaleString()
                }
              </td>}
                <td className='border px-2'>
                { 
                  lineasData.reduce((accumulator, currentObject) => {
                    return accumulator + Number(currentObject.haber);
                  }, 0).toLocaleString()
                }
                </td> 
            </tr>
          </table>
          </div>
        </div>
        
        <ToastList toasts={toasts} setToasts={setToasts}/>
        
        {/*Modal Para editar Fila*/}
        { isModalOpen && 
           <div>
              <div
                className="fixed top-0 right-0 bottom-0 left-0 bg-gray-800 opacity-50 "
                onClick={handleModalClose}
              ></div>
              <div className={`flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 z-60 ${isModalOpen ? '' : 'hidden'}`}>
                  <div className="relative p-4 w-1/3 max-h-full">
                      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Editar ... Contable
                          </h3>
                          
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="p-4 md:p-5">
                            <div className="grid grid-cols-2 gap-4 m-3 mb-5">
                                <div className="col-span-2">
                                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                      Cuenta
                                  </label>
                                  <div className="grid grid-cols-3  dark:text-white ">
                                      <div className=" bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex">
                                          {editedData.id && <p className="mr-2">{editedData.id}</p>}
                                          <input
                                              type="text"
                                              className=" bg-transparent w-full mr-5 "
                                              value={editedData.cuenta}
                                              onChange={(e) => handleInputChange('cuenta', editedData.referencia, e.target.value)}
                                          />
                                      </div>
                                      <button
                                          className="bg-gray-200 ml-3 rounded-md text-black text-sm"
                                          onClick={() => {
                                              setCuentaSelector(true);
                                          }}
                                      >
                                          ...
                                      </button>
                                  </div>                                                      
                                </div>
                                <div className=" grid grid-cols-2 col-span-2  dark:text-white">
																		<div >
																			<label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
																				Centro
																			</label>
																			<div className='flex'>
																				<input type="text" 
																					className={"bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" + (editedData.cuentaObject?.centro !== "S" ? " opacity-25" : "")}
																					value={editedData.centro} 
																					onChange={(e) => handleInputChange('centro', editedData.referencia, e.target.value)} 
																					disabled= {editedData.cuentaObject?.centro !== "S"}
																				/>
																				<button className="bg-gray-200 mr-3 rounded-md px-2 text-black" onClick={()=>{
																						setCentroSelector(true)
																					}}>...</button>
																			</div>
																			
																		</div>
																		<div className='ml-1'>
																			<label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
																				Rut
																			</label>
																			<div className='flex'>
																				<input type="text" 
																					className={"bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" + (editedData.cuentaObject?.rut !== "S" ? " opacity-25" : "")}
																					value={editedData.auxiliar} 
																					onChange={(e) => handleInputChange('auxiliar', editedData.referencia, e.target.value)}
																					disabled= {editedData.cuentaObject?.rut !== "S"} />
																				<button className="bg-gray-200 ml-3 rounded-md px-2 text-black" onClick={()=>{
																							setRutSelector(true)
																						}}>...</button>
																			</div>
																			
																		</div>

                                </div>

                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Item
                                  </label>
                                  <input type="text" className={"bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" + (editedData.cuentaObject?.item !== "S" ? " opacity-25" : "")}
                                    value={editedData.item} 
                                    onChange={(e) => handleInputChange('item', editedData.referencia, e.target.value)}
                                    disabled= {editedData.cuentaObject?.item !== "S"}
                                  />
                                </div> 
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Tg
                                  </label>
                                  <input type="text" 
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                                  value={editedData.td} onChange={(e) => handleInputChange('td', editedData.referencia, e.target.value)} />

                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Nº Documento
                                  </label>
                                  <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" value={editedData.feDoc.split(" ")[0]} 
                                  onChange={(e) => handleInputChange('feDoc', editedData.referencia, e.target.value)} />
                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Glosa
                                  </label>
                                  <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" value={editedData.glosa}
                                  onChange={(e) => handleInputChange('glosa', editedData.referencia, e.target.value)} />
                                  
                                </div>

                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    N° Ref
                                  </label>
                                  <input type="text" 
                                    className={"bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" + (editedData.cuentaObject?.nroRef !== "S" ? " opacity-25" : "")}
                                    value={editedData.nroRef} 
                                    onChange={(e) => handleInputChange('nroRef', editedData.referencia, e.target.value)}
                                    disabled= {editedData.cuentaObject?.nroRef !== "S"} />
                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    CP
                                  </label>
                                  <input type="text" 
                                    className={"bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" + (editedData.cuentaObject?.codigocp !== "S" ? " opacity-25" : "")}
                                    value={editedData.codigoCP} 
                                    onChange={(e) => handleInputChange('codigoCP', editedData.referencia, e.target.value)}
                                    disabled= {editedData.cuentaObject?.codigocp !== "S"} />
                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Debe
                                  </label>
                                  <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                                  value={editedData.debe} onChange={(e) => handleInputChange('debe', editedData.referencia, e.target.value)} />

                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1 dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Haber
                                  </label>
                                  <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                                  value={editedData.haber} onChange={(e) => handleInputChange('haber', editedData.referencia, e.target.value)} />

                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Vencimiento
                                  </label>
                                  <input type="date" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" 
                                    value={editedData.feVen.split(" ")[0]} onChange={(e) => handleInputChange('feVen', editedData.referencia, e.target.value)} 
                                  />
                                  
                                </div>
                                <div className="col-span-2 sm:col-span-1  dark:text-white">
                                  <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Flujo
                                  </label>
                                  <input type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-primary-600 focus:border-primary-600  w-full p-1 mr-3 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 col-span-2 flex" value={editedData.flujo} onChange={(e) => handleInputChange('flujo', editedData.referencia, e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 mt-8  dark:text-white">
																<button
																		onClick={handleEditChange}
																		className="text-white  bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-800 mr-2"
																>
																		Agregar
																</button>
																<button
																		type="button"
																		onClick={handleModalClose}
																		className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-500 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
																		data-modal-toggle="crud-modal"
																>
																		Cancelar
																</button>
														</div>

                        </form>
                        
                    </div>
                  </div>

              </div> 
           </div>
          
          }
        
        {isCuentaSelectorVisible && 
          <CuentaSelector 
            cuentas = {cuentasData}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData) => {
                const updatedData = { ...prevData };
                updatedData["cuenta"] = selected.nombre;
                updatedData["id"] = selected.codigo;
                updatedData["cuentaObject"] = selected;
                return updatedData;
              });
              setCuentaSelector(false)
            }}
            onClose={()=>setCuentaSelector(false)}
          />
        } 

        {isRutSelectorVisible && 
          <RutSelector 
            nombres = {nombre_rut}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData) => {
                const updatedData = { ...prevData };
                console.log(selected)
                updatedData["auxiliar"] = selected.codigo+"-"+selected.dv;
                return updatedData;
              });
              setRutSelector(false)
            }}
            onClose={()=>setRutSelector(false)}
          />
        } 

        {isCentroSelectorVisible && 
          <CentroSelector 
            centros = {centros_select}
            handleSelectWithReference={(selected:any) => {
              setEditedData((prevData) => {
                const updatedData = { ...prevData };
                console.log(selected)
                updatedData["centro"] = selected.nombre;
                return updatedData;
              });
              setCentroSelector(false)
            }}
            onClose={()=>setCentroSelector(false)}
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