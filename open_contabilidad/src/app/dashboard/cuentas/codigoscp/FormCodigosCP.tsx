import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { ICodigoCP } from "@/interfaces/ICodigoCP"
import { formatNumber } from "@/variablesglobales"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormCodigosCPsProps {
    CodigosCP?: ICodigoCP
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    empresa?: number
    onError: (message?:string)=>void;
    codigosList : number[]
}

const FormCodigosCP: React.FC<FormCodigosCPsProps> = ({CodigosCP, type, onFormSubmit, empresa=0, onError, codigosList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(CodigosCP?.nombre || '')
    const [codigo, setCodigo] = useState(CodigosCP?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleSubmit = async () =>{

        if(codigo === "" || nombre === ""){
            setTried(true)
            return
        }

        if(type === CREATE_ACTION && codigosList.includes(Number(codigo))){
            onError("Código ya existe en la tabla.")
            return
        }

        let codigoCP = {    referencia: CodigosCP?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre,
                            empresa: empresa
                            }

        try{
            if(type === UPDATE_ACTION){
                await sendRequest(codigoCP, "PUT");
            }
    
            if(type === CREATE_ACTION){
                await sendRequest(codigoCP, "POST")
            }
    
            onFormSubmit(type, codigoCP)
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


        try{
            const response = await fetch(API_CONTABILIDAD + "/CodigosCP/", requestOptions)

            if(!response.ok){
                throw new Error(`Request failed with status ${response.status}`);
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
                    error={tried && codigo === ""}
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
                    error={tried && nombre === ""}
                    maxLength={40}
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>
        
            <div className="flex">
                <button  className="py-2 px-4 border ml-auto border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white"
                 onClick={handleSubmit}>
                    Enviar
                </button>
            </div>

        </div>
    )
}

export default FormCodigosCP