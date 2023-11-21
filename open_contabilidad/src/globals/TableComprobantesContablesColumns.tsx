import { formatNumberWithPoints } from "@/variablesglobales";

export const TableComprobantesContablesColumns= [
    {
      name: 'Cuenta',
      selector: (row:any) => row.cuenta,
      sortable: true,
    },
    {
      name: 'Centro',
      selector: (row:any) => row.centro,
      sortable: true,
    },
    {
      name: 'Item',
      selector: (row:any) => row.item,
      sortable: true,
    },    {
      name: 'Rut',
      selector: (row:any) => row.auxiliar,
    },
    ,    {
      name: 'TD',
      selector: (row:any) => row.td,
    },{
      name: 'Fecha Doc',
      selector: (row:any) => row.feDoc.split(" ")[0],
    },
    ,{
      name: 'Glosa',
      selector: (row:any) => row.glosa,
      wrap:true,
    },{
      name: 'N° Ref',
      selector: (row:any)=> row.nroRef,
      wrap:true,
    },{
      name: 'CP',
      selector: (row:any)=> row.codigoCP,
      wrap:true,
    },{
      name: 'Debe',
      selector: (row:any)=> row.debe,
      wrap:true,
      right: true,
      format: (row:any) => formatNumberWithPoints(row.debe)      
    },{
      name: 'Haber',
      selector: (row:any)=> row.haber,
      wrap:true,
      right: true,
      format: (row:any) => formatNumberWithPoints(row.haber)     
    },{
      name: 'Vencimiento',
      selector: (row:any)=> row.feVen.split(" ")[0],
    },{
      name: 'Flujo',
      selector: (row:any)=> row.flujo,
      wrap:true,
    },
  ];