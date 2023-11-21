export interface ISucursal{
    referencia:number;
    empresa:number;
    codigo:number;
    nombre:string;
    direccion:string;
    factura: "S" | "N" | undefined;
    tipo: "S" | "N" | undefined;
}