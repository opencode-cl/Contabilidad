export interface ITipoDocumento{
    referencia: number;
    libro: "C" | "H" | "V" | '';
    codigo: number;
    cuenta: number;
    nombre: string;
    exenta: "S" | "N";
    sigla: string;
    retencion: number;
    bonificacion: number;
    electronico: number;
}