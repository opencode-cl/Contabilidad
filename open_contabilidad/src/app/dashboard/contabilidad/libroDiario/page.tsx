"use client"
import Button from "@/componentes/Utils/Button"
import { useState, useContext } from "react"
import DataTable, { TableColumn, ExpanderComponentProps } from "react-data-table-component"
import { gridStyle, gridStyleBold } from "@/globals/tableStyles"
import LibroDiario from "@/interfaces/ILibroDiario"
import axios from "axios"
import { API_CONTABILIDAD, SESSION_NAMES } from "@/variablesglobales"
import secureLocalStorage from "react-secure-storage"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"
import { ThemeContext } from "@/componentes/Providers/darkModeContext"
import APIDownloadButton from "@/componentes/ApiDownloadButton"
import { TableCellsIcon } from "@heroicons/react/24/solid"

const ExpandedComponent: React.FC<ExpanderComponentProps<any>> = ({ data }) => {

  const { theme } = useContext(ThemeContext);

  return (
    <DataTable
      columns={itemsColumns}
      data={data.items}
      customStyles={gridStyle}
      dense
      theme={theme} />

  )
};

const itemsColumns: TableColumn<LibroDiario>[] = [
  {
    name: 'Tipo',
    selector: (row) => row.tipo
  },
  {
    name: 'Compbte',
    selector: (row) => row.numero
  },
  {
    name: 'Cuenta',
    selector: (row) => row.cuenta
  },
  {
    name: 'Nombre',
    selector: (row) => row.ncuenta
  },
  {
    name: 'Debe',
    selector: (row) => row.debe,
    format: (row) => row.debe.toLocaleString(),
    right: true
  },
  {
    name: 'Haber',
    selector: (row) => row.haber,
    format: (row) => row.haber.toLocaleString(),
    right: true
  },
  {
    name: 'Glosa',
    selector: (row) => row.glosa
  }

]

export default function libroDiario() {

  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  const { theme } = useContext(ThemeContext);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const [dataLibroDiario, setDataLibroDiario] = useState([]);

  const params = {
    empresa: String(secureLocalStorage.getItem(SESSION_NAMES.EMPRESA_ID))!.replace(/"/g, ''),
    periodo: String(secureLocalStorage.getItem(SESSION_NAMES.PERIODO_YEAR))!.replace(/"/g, ''),
    fechai: fechaInicio,
    fechaf: fechaFinal,
  };

  const handleSubmitDates = () => {

    // Make the Axios GET request
    axios
      .get(API_CONTABILIDAD + "/LibroDiario", { params: params, headers: getHeaders() })
      .then((response) => {

        const groupedData = Object.entries(response.data.reduce((acc: any, item: any) => {
          const date = item.fecha;

          if (!acc[date]) {
            acc[date] = { items: [], totalDebe: 0, totalHaber: 0 };
          }

          acc[date].items.push(item);
          acc[date].totalDebe += item.debe;
          acc[date].totalHaber += item.haber;

          return acc;
        }, {})).map(([date, { items, totalDebe, totalHaber }]) => ({
          date,
          items,
          totalDebe,
          totalHaber
        }));

        setDataLibroDiario(groupedData);
        console.log(groupedData)// Handle the response data
      })
      .catch((err) => {
        //// Handle any errors
      });
  }

  const columnsLibroDiario: TableColumn<any>[] = [
    {
      id: 'fecha',
      name: 'Fecha',
      sortable: true,
      selector: (row) => row.date.split("T")[0]
    },
    {
      id: 'debe',
      name: 'Debe',
      sortable: true,
      selector: (row) => row.totalDebe,
      format: (row) => row.totalDebe.toLocaleString(),
      right: true
    },
    {
      id: 'haber',
      name: 'Haber',
      sortable: true,
      selector: (row) => row.totalHaber,
      format: (row) => row.totalHaber.toLocaleString(),
      right: true
    },

  ]

  return (
    <section>
      <h1 className="text-xl dark:text-white">Libro Diario</h1>

      <div className="flex gap-2 items-center">

        <label className="block dark:text-white text-gray-700 text-sm font-bold"
          htmlFor="fechares">Fecha Inicio</label>

        <input
          type="date"
          placeholder="2018-01-01"
          className="border shadow px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="fechares"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />


        <label className="block dark:text-white text-gray-700 text-sm font-bold"
          htmlFor="fechares">Fecha Final</label>

        <input
          type="date"
          placeholder="2018-01-01"
          className="border shadow px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="fechares"
          value={fechaFinal}
          onChange={(e) => setFechaFinal(e.target.value)}
        />
        <Button text="Enviar" onClick={handleSubmitDates} />

        <APIDownloadButton options={{ params: params, headers: getHeaders(), endpoint: "/LibroDiario/excel" }} >
          <TableCellsIcon className="w-4 h-4" />
        </APIDownloadButton>

      </div>

      <DataTable
        columns={columnsLibroDiario}
        data={dataLibroDiario}
        customStyles={gridStyleBold}
        dense
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        className="mt-2"
        theme={theme}
      />

    </section>
  )
}