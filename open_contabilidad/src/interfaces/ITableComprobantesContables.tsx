import { formatNumberWithPoints } from "@/variablesglobales";

export interface ITableComprobantesContables {
    
}

export const TableComprobantesContablesColumns = [
  {
    name: 'Cuenta',
    selector: (row: any) => row.cuenta,
    sortable: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.cuenta} onChange={(e) => handleInputChange('cuenta', row, e)} />
      ) : (
        row.cuenta
      );
    },
  },
  {
    name: 'Centro',
    selector: (row: any) => row.centro,
    sortable: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.centro} onChange={(e) => handleInputChange('centro', row, e)} />
      ) : (
        row.centro
      );
    },
  },
  {
    name: 'Item',
    selector: (row: any) => row.item,
    sortable: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.item} onChange={(e) => handleInputChange('item', row, e)} />
      ) : (
        row.item
      );
    },
  },
  {
    name: 'Rut',
    selector: (row: any) => row.auxiliar,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.auxiliar} onChange={(e) => handleInputChange('auxiliar', row, e)} />
      ) : (
        row.auxiliar
      );
    },
  },
  {
    name: 'TD',
    selector: (row: any) => row.td,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.td} onChange={(e) => handleInputChange('td', row, e)} />
      ) : (
        row.td
      );
    },
  },
  {
    name: 'Fecha Doc',
    selector: (row: any) => row.feDoc.split(" ")[0],
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="date" className="w-full" value={row.feDoc} onChange={(e) => handleInputChange('feDoc', row, e)} />
      ) : (
        row.feDoc.split(" ")[0]
      );
    }
  },
  {
    name: 'Glosa',
    selector: (row: any) => row.glosa,
    wrap: true,
    cell:(row:any)=>{
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.glosa} onChange={(e) => handleInputChange('glosa', row, e)} />
      ) : (
        row.glosa
      );
    }
  },
  {
    name: 'N° Ref',
    selector: (row: any) => row.nroRef,
    wrap: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.nroRef} onChange={(e) => handleInputChange('nroRef', row, e)} />
      ) : (
        row.nroRef
      );
    },
  },
  {
    name: 'CP',
    selector: (row: any) => row.codigoCP,
    wrap: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.codigoCP} onChange={(e) => handleInputChange('codigoCP', row, e)} />
      ) : (
        row.codigoCP
      );
    },
  },
  {
    name: 'Debe',
    selector: (row: any) => row.debe,
    wrap: true,
    right: true,
    format: (row: any) => formatNumberWithPoints(row.debe),
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.debe} onChange={(e) => handleInputChange('debe', row, e)} />
      ) : (
        formatNumberWithPoints(row.debe)
      );
    },
  },
  {
    name: 'Haber',
    selector: (row: any) => row.haber,
    wrap: true,
    right: true,
    format: (row: any) => formatNumberWithPoints(row.haber),
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.haber} onChange={(e) => handleInputChange('haber', row, e)} />
      ) : (
        row.haber
      );
    },
  },
  {
    name: 'Vencimiento',
    selector: (row: any) => row.feVen.split(" ")[0],
    cell: (row: any) => {
      console.log(row)
      return row.type === "new" ? (
        <input type="date" className="w-full" value={row.feVen} onChange={(e) => handleInputChange('feVen', row, e)} />
      ) : (
        row.feVen.split(" ")[0]
      );
    },
  },
  {
    name: 'Flujo',
    selector: (row: any) => row.flujo,
    wrap: true,
    cell: (row: any) => {
      return row.type === "new" ? (
        <input type="text" className="w-full" value={row.flujo} onChange={(e) => handleInputChange('flujo', row, e)} />
      ) : (
        row.flujo
      );
    },
  },
];

const handleEdit = (columnName:any, rowId:any, newValue:any) => {
  // Update the data in response to user input
  const updatedData = tableData.map((row) => {
    if (row.id === rowId) {
      return { ...row, [columnName]: newValue };
    }
    return row;
  });
