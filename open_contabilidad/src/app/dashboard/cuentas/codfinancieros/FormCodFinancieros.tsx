import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, ERROR_CODE_EXISTS } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormCodFinancieroProps {
    CodFinanciero?: {referencia:number, codigo:number, nombre:string}
    type: ActionType
    onFormSubmit: (type:string, codigoFinanciero:any) => void
    onError: (message?:string) => void;
    codigoList: number[]
}

const FormCodFinancieros: React.FC<FormCodFinancieroProps> = ({CodFinanciero, type, onFormSubmit, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
    
    const [codigo, setCodigo] = useState(CodFinanciero?.codigo || "")
    const [nombre, setNombre] = useState(CodFinanciero?.nombre || '')

    const [tried, setTried] = useState(false)

    const handleCodigoChange = (e:any) =>{
        setCodigo(formatToNumbersOnly(e.target.value))
    }

    const handleNombreChange = (e:any) =>{
        setNombre(e.target.value)
    }

    const handleSubmit = async() =>{

        if(codigo === "" || nombre === ""){
            setTried(true)
            return
        }

        if(type=== CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return;
        }

        let codigoFinanciero = { referencia: CodFinanciero?.referencia || 0,
                                codigo: codigo,
                                nombre: nombre}

        try{
            if(type === UPDATE_ACTION){
            await sendRequest(codigoFinanciero, "PUT");
        }

        if(type === CREATE_ACTION){
            await sendRequest(codigoFinanciero, "POST");
        }

        onFormSubmit(type, codigoFinanciero)
        }
        catch(error){
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
            const response = await fetch(API_CONTABILIDAD + "/CodigosFinancieros/", requestOptions)
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
                    name="codigo"
                    placeholder="1000"
                    value={formatNumber(codigo)}
                    onChange={handleCodigoChange}
                    maxLength={4}
                    error={tried && codigo ===""}/>
            </div>

            <div className="mb-4">

            <Input
                type="text"
                name="nombre"
                label="Nombre"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Nombre"
                maxLength={150}
                error={tried && nombre===""}
            />
            </div>
            <div className="flex justify-end">
                <Button text="Enviar" type="primary" onClick={handleSubmit}/>
            </div>
        
        </div>
    )
}

export default FormCodFinancieros