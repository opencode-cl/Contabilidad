import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormGlosasPagosProps {
    GlosaPago?: {referencia:number, nombre:string}
    type: ActionType
    onFormSubmit: (type:string, glosaPago:any) => void
    onError: () =>void
}

const FormGlosasPagos: React.FC<FormGlosasPagosProps> = ({GlosaPago, type, onFormSubmit, onError}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(GlosaPago?.nombre || '')

    const [tried, setTried] = useState(false)

    const handleNombreChange = (e:any) =>{
        setNombre(e.target.value)
    }

    const handleSubmit = () =>{

        if(nombre ===""){
            setTried(true)
            return
        }

        let glosaPago = { referencia: GlosaPago?.referencia || 0,
                                nombre: nombre}
        
        try{
            if(type === UPDATE_ACTION){
                sendRequest(glosaPago, "PUT");
            }
    
            if(type === CREATE_ACTION){
                sendRequest(glosaPago, "POST");
            }
    
            onFormSubmit(type, glosaPago)
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
            const response = await fetch(API_CONTABILIDAD + "/Glosas/", requestOptions)
            
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
                    label="Nombre"
                    name="name"
                    value={nombre}
                    onChange={handleNombreChange}
                    placeholder="Nombre"
                    maxLength={50}
                    error={tried && nombre===""}
                />
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSubmit} text="Enviar" type="primary"/>
            </div>
        
        </div>
    )
}

export default FormGlosasPagos