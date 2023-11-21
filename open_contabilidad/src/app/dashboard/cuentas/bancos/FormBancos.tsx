import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { IBanco } from "@/interfaces/IBanco"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormBancoProps {
    Banco?: IBanco
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    onError: (message?:string)=>void;
    codigoList: number[]
}

const FormBanco: React.FC<FormBancoProps> = ({Banco, type, onFormSubmit, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Banco?.nombre || '')
    const [codigo, setCodigo] = useState(Banco?.codigo || '')

    const [tried, setTried] = useState(false)

    const handleSubmit = async () =>{

        if(codigo === "" || nombre ===""){
            setTried(true);
            return false
        }

        if(type === CREATE_ACTION && codigoList.includes(Number(codigo))){
            onError("Código ya existe en la tabla.")
            return;
        }

        let banco = {referencia: Banco?.referencia || 0,
                            codigo: codigo,
                            nombre: nombre
                            }

        try{
            if(type === UPDATE_ACTION){
                await sendRequest(banco, "PUT");
            }

            if(type === CREATE_ACTION){
                await sendRequest(banco, "POST")
            }

            onFormSubmit(type, banco)
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
            const response = await fetch(API_CONTABILIDAD + "/Bancos/", requestOptions)

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
                    value={codigo}
                    onChange={(e:any)=> setCodigo(formatToNumbersOnly(e.target.value))}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Nombre"
                    name="Nombre"
                    error={tried && nombre === ""}
                    placeholder="Nombre"
                    maxLength={50}
                    value={nombre}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>
        
            <div className="flex justify-end">
                <Button text="Enviar" onClick={handleSubmit} type="primary"/>
            </div>

        </div>
    )
}

export default FormBanco