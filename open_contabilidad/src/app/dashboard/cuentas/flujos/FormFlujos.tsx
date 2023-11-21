import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, ERROR_CODE_EXISTS } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { ICodigoCP } from "@/interfaces/ICodigoCP"
import { IFlujo } from "@/interfaces/IFlujo"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormFlujosProps {
    CodigoDeFlujo?: IFlujo
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    onError: (message?:string)=>void
    codigoList: number[]
}

const FormFlujos: React.FC<FormFlujosProps> = ({CodigoDeFlujo, type, onFormSubmit, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(CodigoDeFlujo?.nombre || '')
    const [codigo, setCodigo] = useState(CodigoDeFlujo?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleSubmit = async () =>{

        if(codigo ==="" || nombre ===""){
            setTried(true);
            return;
        }

        if(type === CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let codigoFlujo = {    referencia: CodigoDeFlujo?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre
                            }
      try{
        if(type === UPDATE_ACTION){
            await sendRequest(codigoFlujo, "PUT");
        }

        if(type === CREATE_ACTION){
            await sendRequest(codigoFlujo, "POST")
        }
        onFormSubmit(type, codigoFlujo)
      }catch(error){
        onError();
      }

    }

    async function sendRequest(data:any, method:string){

        const requestOptions = {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data) // Convert request data to JSON string if needed
          };
        
        try { 
            const response = await fetch(API_CONTABILIDAD + "/Flujos/", requestOptions)
            if(!response.ok){
                throw new Error("Error en la petición.")
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
                    error={tried && codigo ===""}
                    placeholder="1000"
                    maxLength={4}
                    value={formatNumber(codigo)}
                    onChange={(e:any)=> setCodigo(formatToNumbersOnly(e.target.value))}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Nombre"
                    name="Nombre"
                    error={tried && nombre ===""}
                    maxLength={50}
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>
            
            <div className="flex justify-end">
                <Button text="Editar" onClick={handleSubmit} type="primary"/>
            </div>

        </div>
    )
}

export default FormFlujos