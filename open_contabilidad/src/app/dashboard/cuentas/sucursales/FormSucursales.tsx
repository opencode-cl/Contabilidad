import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatNumber, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { ISucursal } from "@/interfaces/ISucursal"
import Checkbox from "@/componentes/Utils/Checkbox"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormSucursalesProps {
    Sucursal?: ISucursal
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    empresa?: number
    onError:(message?:string)=>void;
    codigoList: number[]
}

const FormSucursales: React.FC<FormSucursalesProps> = ({Sucursal, type, onFormSubmit, empresa, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Sucursal?.nombre || '')
    const [codigo, setCodigo] = useState(Sucursal?.codigo || '')
    const [direccion, setDireccion] = useState(Sucursal?.direccion || "")
    const [factura, setFactura] = useState(Sucursal?.factura === "S")
    const [tipo, setTipo] = useState(Sucursal?.tipo === "S")

    const [tried, setTried] = useState(false)

    const handleSubmit = async() =>{

        if(nombre ==="" || codigo ===""){
            setTried(true)
            return
        }

        if(type===CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let sucursal = {    referencia: Sucursal?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre,
                            empresa: empresa,
                            direccion: direccion,
                            tipo: tipo ? "S" : "N",
                            factura: factura? "S": "N"
                            }
        try{
            if(type === UPDATE_ACTION){
                await sendRequest(sucursal, "PUT");
            }
    
            if(type === CREATE_ACTION){
                await sendRequest(sucursal, "POST")
            }
    
            onFormSubmit(type, sucursal)
        }catch(error){
            onError();
        }
    }

    async function sendRequest(data:any, method:string){

        const requestOptions = {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data)
          };
        
          try{
            const response = await fetch(API_CONTABILIDAD + "/Sucursales/", requestOptions)
            if(!response.ok){
                throw new Error("Error en la solicitud.")
            }
        }catch(error){
            throw error;
        }
        
    }

    return(
        <div>
            <div className="mb-4">
                <Input
                    type="text"
                    label="Código"
                    name="Código"
                    error={tried && codigo===""}
                    placeholder="1"
                    maxLength={2}
                    value={codigo}
                    onChange={(e:any)=> setCodigo(e.target.value)}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Nombre"
                    name="Nombre"
                    error={tried && nombre ===""}
                    placeholder="Nombre"
                    value={nombre}
                    maxLength={50}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Dirección"
                    name="direccion"
                    error={false}
                    placeholder="Nombre"
                    value={direccion}
                    maxLength={100}
                    onChange={(e:any)=> setDireccion(e.target.value)}/>
            </div>

            <div className="grid grid-cols-2 place-items-center mb-4">
                <Checkbox label="Factura" name="Factura" checked={factura} onChange={()=> setFactura(!factura)}/>
                <Checkbox label="Tipo" name="Tipo" checked={tipo} onChange={()=> setTipo(!tipo)}/>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} text="Enviar" type="primary"/>
            </div>

        </div>
    )
}

export default FormSucursales