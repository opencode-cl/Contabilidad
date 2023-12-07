import DataTable, {TableColumn} from 'react-data-table-component';
import Modal from '../Modal';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react';
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
            name: 'Folio Numero',
            width: '6rem',
            selector:(row) => row.numero
        },
        { 
            id: 'cuenta',
            name: 'Cuenta',
            width: '6rem',
            selector:(row) => row.cuenta
        },
        { 
            id: 'nombre',
            name: 'Nombre',
            wrap:true,
            selector:(row) => row.nombre
        },
        { 
            id: 'fecha',
            name: 'Fecha',
            wrap:true,
            selector:(row) => row.fecha
        },
        {
            name: 'Seleccionar',
            width: '9rem',
            center: true,
            cell: (row: any) =>
              !String(row.codigo).endsWith('00') && (
                <button
                  className="py-2 px-2 bg-blue-500 hover:bg-blue-700 rounded-md p-2 text-white"
                  onClick={() => {
                    handleSelectWithReference(row);
                  }}
                >
                  <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                </button>
              ),
          }
    ]
    
    const flujosColumns:TableColumn<any>[] = [
        { 
            id: 'numero',
            name: 'Numero',
            width: '6rem',
            selector:(row) => row.numero
        },
        { 
            id: 'glosa',
            name: 'Glosa',
            width: '23rem',
            selector:(row) => row.glosa
        },
        { 
            id: 'fecha',
            name: 'Fecha',
            wrap:true,
            selector:(row) => modificarFechaDoc(formatDate(row.fecha))
        },
        { 
            id: 'valor',
            name: 'Valor',
            wrap:true,
            selector:(row) => row.valor
        },
        {
            name: 'Seleccionar',
            width: '9rem',
            center: true,
            cell: (row: any) =>
                (
                <button
                  className="py-2 px-2 bg-blue-500 hover:bg-blue-700 rounded-md p-2 text-white"
                  onClick={() => {
                    handleSelectWithReference(row);
                  }}
                >
                  <ArrowTopRightOnSquareIcon className="w-6 h-6" />
                </button>
              ),
          }
    ]

  
    const filteredData = data.filter((row) => {
      return Object.entries(row).some(([key, value]) => {
        
          const glosa=row.glosa;
          return glosa.toString().toLowerCase().includes(searchText.toLowerCase());
        
      });
    });
  
  
    const customPaginationComponentOptions = {
      rowsPerPageText: 'Filas por página:',
      rangeSeparatorText: 'de',
      noRowsPerPage: false,
      selectAllRowsItem: false,
      selectAllRowsItemText: 'All',
    };

  return (
    <section>
        <Modal type="info" title="Selector de folios" onClose={onClose}>
            <div className="flex space-x-4 mb-4">
                <button
                    className={`py-2 px-4 ${
                        !searchByLineas ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
                    } rounded-md p-2 text-white`}
                    onClick={() => {setSearchByLineas(false); setData(folios)}}
                >
                    Buscar por Folios
                </button>
                <button
                    className={`py-2 px-4 ${
                        searchByLineas ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
                    } rounded-md p-2 text-white`}
                    onClick={() => {setSearchByLineas(true); setData(lineas)}}
                >
                    Buscar por Líneas
                </button>
            </div>
            <DataTable
                columns={searchByLineas ? lineasColumns : flujosColumns}
                data={filteredData}
                pagination
                theme={theme}
                paginationComponentOptions={customPaginationComponentOptions}
                subHeader
                subHeaderComponent={
                <input
                    type="text"
                    placeholder="Buscar por Glosa..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border w-full rounded-sm shadow px-3 py-0.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                }
            />
        </Modal>
    </section>
  );
};

export default FolioSelector;