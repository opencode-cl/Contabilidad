import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatNumber, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormGrupoCuentasProps {
    GrupoCuentas?: {referencia:number, codigo:number, nombre:string}
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    onError: (message?:string)=> void
    codigoList: number[]
}

const FormGrupoCuentas: React.FC<FormGrupoCuentasProps> = ({GrupoCuentas, type, onFormSubmit, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(GrupoCuentas?.nombre || '')
    const [codigo, setCodigo] = useState(GrupoCuentas?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleNombreChange = (e:any) =>{
        setNombre(e.target.value)
    }

    const handleCodigoChange = (e:any) =>{
        setCodigo(formatToNumbersOnly(e.target.value))
    }

    const handleSubmit = async () =>{

        if(nombre === "" || codigo === ""){
            setTried(true)
            return
        }

        if(type===CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let grupoCuentas = {    referencia: GrupoCuentas?.referencia || 0,
                                codigo: codigo,
                                nombre: nombre}
        try{
            if(type === UPDATE_ACTION){
                await sendRequest(grupoCuentas, "PUT");
            }
    
            if(type === CREATE_ACTION){
                await sendRequest(grupoCuentas, "POST")
            }
    
            onFormSubmit(type, grupoCuentas)
        }catch(error){
            onError()
        }
    }

    async function sendRequest(data:any, method:string){

        const requestOptions = {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data) // Convert request data to JSON string if needed
          };

        try{
            const response = await fetch(API_CONTABILIDAD + "/Grupos/", requestOptions)
            if(!response.ok){
                throw new Error("Error en la solicitud.")
            }
        }catch(error){
            throw error
        }
    }

    return(
        <div>
            <div className="mb-4">
            <Input 
                type="text"
                placeholder="1000"
                name="codigo"
                label="Código"
                maxLength={4}
                error={tried && codigo === ""}
                value={formatNumber(codigo)}
                onChange={handleCodigoChange}/>
            </div>
            <div className="mb-4">

            <Input 
                type="text"
                placeholder="Nombre"
                name="nombre"
                label="Nombre"
                maxLength={250}
                error={tried && nombre === ""}
                value={nombre}
                onChange={handleNombreChange}
            />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} text="Enviar" type="primary"/>
            </div>

        </div>
    )
}

export default FormGrupoCuentas