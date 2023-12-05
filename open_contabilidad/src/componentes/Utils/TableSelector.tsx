import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import React, { useContext, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ThemeContext } from '../Providers/darkModeContext';

interface TableSelectorProps {
  data: any[];
  columns: any[];
  onSelect: (referencia: any) => void;
  title?: string;
}

const TableSelector: React.FC<TableSelectorProps> = ({ data, columns, title, onSelect }) => {
  const { theme } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState('');

  const filteredData = data.filter((row) => {
    return Object.entries(row).some(([key, value]) => {
      if (key === 'codigo') {
        // Handle the 'Rut' column separately
        const concatenatedRut = `${row.codigo}-${row.dv}`;
        return concatenatedRut.toLowerCase().includes(searchText.toLowerCase());
      }else{
        const nombre=row.nombre;
        return nombre.toString().toLowerCase().includes(searchText.toLowerCase());
      }
      // Handle other columns
    });
  });

  columns.push({
    name: 'Seleccionar',
    width: '9rem',
    center: true,
    cell: (row: any) =>
      !String(row.codigo).endsWith('00') && (
        <button
          className="py-2 px-2 bg-blue-500 hover:bg-blue-700 rounded-md p-2 text-white"
          onClick={() => {
            onSelect(row);
          }}
        >
          <ArrowTopRightOnSquareIcon className="w-6 h-6" />
        </button>
      ),
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
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        theme={theme}
        paginationComponentOptions={customPaginationComponentOptions}
        subHeader
        subHeaderComponent={
          <input
            type="text"
            placeholder="Buscar..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border w-full rounded-sm shadow px-3 py-0.5 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        }
      />
    </section>
  );
};

export default TableSelector;