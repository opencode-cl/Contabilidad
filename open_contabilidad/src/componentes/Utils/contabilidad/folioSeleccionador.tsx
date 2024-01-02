import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import secureLocalStorage from 'react-secure-storage';
import React, { useContext, useState } from 'react';
import { API_CONTABILIDAD, SESSION_NAMES } from '@/variablesglobales';
import { ThemeContext } from '../../Providers/darkModeContext';
interface ItemsSelectorProps {
    folios: any[],
    lineas: any[],
    handleSelectWithReference: (selected: any) => void;
    onClose:()=>void
}

const FolioSelector: React.FC<ItemsSelectorProps> = ({ folios,lineas, handleSelectWithReference, onClose }) => {
    
    const [data,setData] = useState(folios)
    const { theme } = useContext(ThemeContext);
    const [searchText, setSearchText] = useState('');
    const [searchByLineas, setSearchByLineas] = useState(false);
    const periodo = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, '');
    const mes = String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_MONTH))!.replace(/"/g, '');
   

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
    const modificarFechaDoc = (fecha:any) => {
        if(fecha==="" || fecha===undefined ||  fecha===null){
            return "";
        }
        // Dividir la fecha 
        const partesFecha = fecha.split('-');
        
        // Fecha en formato DD/MM/YYYY
        const fechaModificada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;
        
        return fechaModificada;
    }
    const lineasColumns:TableColumn<any>[] = [
        { 
            id: 'numero',
            name: 'Folio',
            sortable: true,
            width: '11%',
            selector:(row) => row.numero
        },
        { 
            id: 'cuenta',
            name: 'Cuenta',
            sortable: true,
            width: '12%',
            selector:(row) => row.cuenta
        },
        { 
            id: 'glosa',
            name: 'Glosa',
            width: '36s%',
            selector:(row) => row.glosa
        },
        { 
            id: 'debe',
            name: 'Debe',
            width: '15%',

            selector:(row) => Intl.NumberFormat("es-CL").format(row.debe)
        },
        { 
            id: 'haber',
            name: 'Haber',
            width: '15%',
            wrap:true,
            selector:(row) => Intl.NumberFormat("es-CL").format(row.haber)
        },
        {
            name: 'Seleccionar',
            width: '14%',
            center: true,
            cell: (row: any) =>
              !String(row.codigo).endsWith('00') && (
                <button
                  className="py-2 px-2 bg-blue-500 hover:bg-blue-700 rounded-md p-2 text-white"
                  onClick={() => {
                    handleSelectWithReference(row);
                  }}
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </button>
              ),
          }
    ]
    
    const flujosColumns:TableColumn<any>[] = [
        { 
            id: 'numero',
            name: 'Nº',
            sortable: true,
            width: '11%',
            selector:(row) => row.numero
        },
        { 
          id: 'fecha',
          name: 'Fecha',
          sortable: true,
          wrap:true,
          width: '15%',
          selector:(row) => modificarFechaDoc(formatDate(row.fecha))
        },
        { 
            id: 'glosa',
            name: 'Glosa',
            width: '44%',
            selector:(row) => row.glosa
        },
        { 
            id: 'valor',
            name: 'Valor',
            width: '15%',
            wrap:true,
            selector:(row) => Intl.NumberFormat("es-CL").format(row.valor)
        },
        {
            name: 'Seleccionar',
            width: '15%',
            center: true,
            cell: (row: any) =>
                (
                <button
                  className="py-2 px-2 bg-blue-500 hover:bg-blue-700 rounded-md p-2 text-white"
                  onClick={() => {
                    handleSelectWithReference(row);
                  }}
                >
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                </button>
              ),
          }
    ]

  
    const filteredData = data.filter((row) => {
      return Object.entries(row).some(([key, value]) => {
          const glosa=row.glosa;
          return glosa?.toString().toLowerCase().includes(searchText.toLowerCase());
        
      });
    });
  
    const customStyles = {
      rows: {
        style: {
          fontSize: '11px', // Ajusta el tamaño de la fuente según tus necesidades
        },
      },
      headCells: {
        style: {
          fontSize: '14px', // Ajusta el tamaño de la fuente según tus necesidades
        },
      },
    };

    const customPaginationComponentOptions = {
      rowsPerPageText: 'Filas por página:',
      rangeSeparatorText: 'de',
      noRowsPerPage: false,
      selectAllRowsItem: false,
      selectAllRowsItemText: 'All',
    };
    
  return (
    <section>
        <Modal width='w-3/5' type="info" title={"Selector de folios del perido: "+ periodo+" y mes: "+mes } onClose={onClose}>
            <div className="flex justify-center space-x-4 mb-2">
                <button
                    className={`px-3 ${
                        !searchByLineas ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
                    } rounded-md text-white`}
                    onClick={() => {setSearchByLineas(false); setData(folios)}}
                >
                    Folio
                </button>
                <button
                    className={`px-3 ${
                        searchByLineas ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
                    } rounded-md text-white`}
                    onClick={() => {setSearchByLineas(true); setData(lineas)}}
                >
                    Linea
                </button>
                <input
                        type="text"
                        placeholder="Buscar por Glosa..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border w-full h-9 rounded-sm shadow px-3 py-0.5 mb-2 
                        dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                         dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
            </div>
            <DataTable
                columns={searchByLineas ? lineasColumns : flujosColumns}
                data={filteredData}
                pagination
                theme={theme}
                customStyles={customStyles}
                paginationComponentOptions={customPaginationComponentOptions}
            />
        </Modal>
    </section>
  );
};

export default FolioSelector;