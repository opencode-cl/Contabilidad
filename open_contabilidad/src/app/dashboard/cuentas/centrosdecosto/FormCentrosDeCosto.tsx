import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, ERROR_CODE_EXISTS } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { ICodigoCP } from "@/interfaces/ICodigoCP"
import { ICentroDeCosto } from "@/interfaces/ICentroDeCosto"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormCentrosDeCostoProps {
    CentroDeCosto?: ICentroDeCosto
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    empresa?: number
    onError: (message?:string)=> void
    codigoList: number[]
}

const FormCentrosDeCosto: React.FC<FormCentrosDeCostoProps> = ({CentroDeCosto, type, onFormSubmit, empresa=0, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(CentroDeCosto?.nombre || '')
    const [codigo, setCodigo] = useState(CentroDeCosto?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleSubmit = async () =>{

        if(codigo ==="" || nombre === ""){
            setTried(true)
            return
        }

        if(type=== CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let centroDeCosto = {    referencia: CentroDeCosto?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre,
                            empresa: empresa
                            }

       try{
        if(type === UPDATE_ACTION){
            await sendRequest(centroDeCosto, "PUT");
        }

        if(type === CREATE_ACTION){
            await sendRequest(centroDeCosto, "POST")
        }

        onFormSubmit(type, centroDeCosto)
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

        try {
            const response = await fetch(API_CONTABILIDAD + "/Obras/", requestOptions)
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
                    placeholder="1000"
                    value={formatNumber(codigo)}
                    maxLength={4}
                    onChange={(e:any)=> setCodigo(formatToNumbersOnly(e.target.value))}/>
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
        
            <div className="flex justify-end">
                <Button type="primary" text="Enviar" onClick={handleSubmit}/>
            </div>

        </div>
    )
}

export default FormCentrosDeCosto