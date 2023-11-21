import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, ERROR_CODE_EXISTS } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface IFormIFRS {
    IFRS?: {referencia:number, codigo:number, nombre:string}
    type: ActionType
    onFormSubmit: (type:string, codigoFinanciero:any) => void
    onError: (message?:string) => void;
    codigoList: number[]
}

const FormIFRS: React.FC<IFormIFRS> = ({IFRS, type, onFormSubmit, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [codigo, setCodigo] = useState(IFRS?.codigo || "")
    const [nombre, setNombre] = useState(IFRS?.nombre || '')

    const [tried, setTried] = useState(false)

    const handleCodigoChange = (e:any) =>{
        setCodigo(formatToNumbersOnly(e.target.value))
    }

    const handleNombreChange = (e:any) =>{
        setNombre(e.target.value)
    }

    const handleSubmit = async () =>{

        if(codigo === "" || nombre === ""){
            setTried(true)
            return
        }

        if(type === CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let ifrs = { referencia: IFRS?.referencia || 0,
                                codigo: codigo,
                                nombre: nombre}

        try{
            if(type === UPDATE_ACTION){
                sendRequest(ifrs,"PUT");
            }
    
            if(type === CREATE_ACTION){
                sendRequest(ifrs, "POST");
            }
            onFormSubmit(type, ifrs)
        }catch (error){
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

            const response = await fetch(API_CONTABILIDAD + "/IFRS/", requestOptions)

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
            <Input type="text"
                label="Código"
                value={formatNumber(codigo)} 
                onChange={handleCodigoChange}
                name="codigo"
                placeholder="1000"
                maxLength={11}
                error={tried && codigo===""} />
            </div>

            <div className="mb-4">

                <Input type="text"
                label="Nombre"
                value={nombre} 
                onChange={handleNombreChange}
                name="nombre"
                placeholder="1000"
                maxLength={100}
                error={tried && nombre===""} />

            </div>

            <div className="flex justify-end">
               <Button text="Enviar" onClick={handleSubmit} type="primary"/>
            </div>
        
        </div>
    )
}

export default FormIFRS