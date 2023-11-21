import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatRut, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { IProyecto } from "@/interfaces/IProyecto"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormProyectosProps {
    Proyecto?: IProyecto
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    empresa?: number
    onError: (message?:string)=>void;
    codigosList: number[]
}

const FormProyectos: React.FC<FormProyectosProps> = ({Proyecto, type, onFormSubmit, empresa, onError, codigosList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Proyecto?.nombre || '')
    const [codigo, setCodigo] = useState(Proyecto?.codigo || '')
    const [fuentefinanc, setFuentefinanc] = useState(Proyecto?.fuentefinanc || '')
    const [instrumento, setInstumento] = useState(Proyecto?.instrumento || "")
    const [codigobp, setCodigobp] = useState(Proyecto?.codigobp || "")
    const [codigosap, setCodigosap] = useState(Proyecto?.codigosap || "")
    const [rut, setRut] = useState(Proyecto?.dv !== undefined ? (Proyecto?.rut +"-"+Proyecto?.dv) : "")

    const [tried, setTried] = useState(false)

    const handleSubmit = async() =>{

        if(codigo === "" || nombre === ""){
            setTried(true)
            return
        }

        if(type === CREATE_ACTION && codigosList.includes(Number(codigo))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let proyecto = {    codigo: codigo,
                            nombre: nombre,
                            fuentefinanc: fuentefinanc,
                            instrumento: instrumento,
                            codigobp: codigobp,
                            empresa: empresa,
                            codigosap: codigosap,
                            rut: rut!=="" ? rut.split("-")[0] : 0,
                            dv: rut!=="" ? rut.split("-")[1] : "?"
                            }

        try{
            if(type === UPDATE_ACTION){
                await sendRequest(proyecto, "PUT");
            }
    
            if(type === CREATE_ACTION){
                await sendRequest(proyecto, "POST")
            }
    
            onFormSubmit(type, proyecto)
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
            const response = await fetch(API_CONTABILIDAD + "/Proyectos/", requestOptions)
            if(!response.ok){
                throw new Error("Error");
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
                    value={codigo}
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

            <div className="mb-4">
            <Input
                    type="text"
                    label="Fuente Financiamiento"
                    name="fuentefinanc"
                    error={false}
                    placeholder="Interna"
                    value={fuentefinanc}
                    maxLength={50}
                    onChange={(e:any)=> setFuentefinanc(e.target.value)}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Instrumento"
                    name="instrumento"
                    error={false}
                    placeholder=""
                    value={instrumento}
                    maxLength={50}
                    onChange={(e:any)=> setInstumento(e.target.value)}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Rut"
                    name="rut"
                    error={false}
                    placeholder="1111111-1"
                    value={rut}
                    maxLength={12}
                    onChange={(e:any)=> setRut(formatRut(e.target.value))}/>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
            <Input
                    type="number"
                    label="Código BP"
                    name="codigobp"
                    error={false}
                    placeholder="123"
                    value={codigobp}
                    maxLength={50}
                    onChange={(e:any)=> setCodigobp(e.target.value)}/>
            <Input
                    type="number"
                    label="Código SAP"
                    name="codigosap"
                    error={false}
                    placeholder="123"
                    value={codigosap}
                    maxLength={50}
                    onChange={(e:any)=> setCodigosap(e.target.value)}/>
            </div>


            <div className="flex justify-end">
               <Button text="Enviar" onClick={handleSubmit} type="primary"/>
            </div>

        </div>
    )
}

export default FormProyectos