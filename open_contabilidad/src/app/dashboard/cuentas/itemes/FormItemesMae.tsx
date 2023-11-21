import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, ERROR_CODE_EXISTS } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { IItemMae } from "@/interfaces/IItemMae"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormItemesMaeProps {
    Item?: IItemMae
    type: ActionType
    onFormSubmit: (type:string, item:any) => void
    empresa: number
    onError: (message?:string)=>void
    codigoList: number[]
}

const FormItemesMae: React.FC<FormItemesMaeProps> = ({Item, type, onFormSubmit, empresa, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Item?.nombre || '')
    const [codigo, setCodigo] = useState(Item?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleSubmit = async () =>{

        if(nombre === "" || codigo === ""){
            setTried(true)
            return
        }

        if(type===CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let item = {    referencia: Item?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre,
                            empresa: empresa
                            }
        try{
            
        
       if(type === UPDATE_ACTION){
            await sendRequest(item, "PUT");
        }

        if(type === CREATE_ACTION){
            await sendRequest(item, "POST")
        }

        onFormSubmit(type, item)
    }catch(e){
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
            const response = await fetch(API_CONTABILIDAD + "/Itemes/maestros/", requestOptions)
            if(!response.ok){
                throw new Error("Error de petición.")
            }
        }catch(e){
            throw e;
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
                    value={formatNumber(codigo)}
                    maxLength={4}
                    onChange={(e:any)=> setCodigo(formatToNumbersOnly(e.target.value))}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Nombre"
                    name="Nombre"
                    error={tried && nombre === ""}
                    placeholder="Nombre"
                    value={nombre}
                    maxLength={50}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>

        
            <div className="flex justify-end">
                <Button onClick={handleSubmit} text="Enviar" type="primary" />
            </div>

        </div>
    )
}

export default FormItemesMae