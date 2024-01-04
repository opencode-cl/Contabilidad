import React from "react";
import * as XLSX from "xlsx-js-style";
import ContableButton from "./contabilidad/contableButton";
import excelDescarga from "../../public/images/excelDescarga.svg";
import Image from "next/image";

interface ButtonTableExcelProps {
  data: any[]; // Cambiar a un arreglo de objetos
  filename: string;
}

const ButtonTableExcel: React.FC<ButtonTableExcelProps> = ({ data, filename }) => {
    const exportToExcel = () => {
        // Crear el libro
        const workbook = XLSX.utils.book_new();

        // Crear datos y estilos para los títulos de las columnas
        const titleRow = Object.keys(data[0]).map((title) => (
            { v: title, t: "s", s: { alignment: { horizontal: "left" }, fill: { fgColor: { rgb: "7A7A7A" } }, font: { color: { rgb: "FFFFFF" } } } }
        ));

        // Crear datos y estilos para el resto de las filas
        let rows = [titleRow];

        // Agregar datos
        data.forEach((linea, index) => {
            const rowData:any = Object.values(linea).map((value) => (
                { v: value, t: "s", s: { alignment: { horizontal: "left" } } }
            ));
            rows.push(rowData);
        });

        // Crear hoja de cálculo
        const worksheet = XLSX.utils.aoa_to_sheet(rows);

        // Agregar hoja de cálculo al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, "Excel Lineas");

        // Escribir el archivo Excel
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

  return (
    <ContableButton onClick={exportToExcel} disabled={data.length === 0} className={`text-white font-bold ${data.length === 0 ? 'opacity-50' : ''}`}>
      <Image src={excelDescarga} alt="Descargar excel" className="w-4 h-4" />
    </ContableButton>
  );
};

export default ButtonTableExcel;