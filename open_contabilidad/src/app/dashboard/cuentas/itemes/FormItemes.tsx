import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { IItem } from "@/interfaces/IItem"
import InputTableSelector from "@/componentes/Utils/InputTableSelector"
import { IItemMae } from "@/interfaces/IItemMae"
import Modal from "@/componentes/Utils/Modal"
import { formatNumber } from "@/variablesglobales"
import TableSelector from "@/componentes/Utils/TableSelector"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormItemesProps {
    Item?: IItem
    type: ActionType
    onFormSubmit: (type:string, item:any) => void
    empresa?: number
    itemesMae: IItemMae[]
    onError: (message?:string) => void
    codigoList: number[]
}

const FormItemes: React.FC<FormItemesProps> = ({Item, type, onFormSubmit, empresa=0, itemesMae, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Item?.nombre || '')
    const [codigo, setCodigo] = useState(Item?.codigo || '')
    const [codpre, setCodpre] = useState(Item?.codpre || '')
    const [codigomae, setCodigomae] = useState(Item?.codigomae || '')

    const [itemesMaeText, setItemesMaeText] = useState(Item?.codigomae !== undefined ? formatNumber(Item?.codigomae) : "")
    const [itemesMaeSelector, setItemesMaeSelector] = useState(false)

    const [tried, setTried] = useState(false)

    const columns = [
        { name: 'Codigo', selector:(row:any) => row.codigo, format:(row:any) => formatNumber(row.codigo)},
        { name: 'Nombre', selector:(row:any) => row.nombre },
    ]

    const handleSubmit = async () =>{

        if(codigo === "" || nombre === ""){
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
                            empresa: empresa,
                            codpre: codpre !== ""? codpre: 0,
                            codigomae: codigomae !== "" ? codigomae : 0
                            }
        
        try{
            if(type === UPDATE_ACTION){
                await sendRequest(item, "PUT");
            }
    
            if(type === CREATE_ACTION){
                await sendRequest(item, "POST")
            }
    
            onFormSubmit(type, item)
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

          console.log(JSON.stringify(data))

        try{
            const response = await fetch(API_CONTABILIDAD + "/Itemes/", requestOptions)
            if(!response.ok){
                throw new Error("Error en la petición.")
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
                    error={tried && nombre===""}
                    placeholder="Nombre"
                    value={nombre}
                    maxLength={50}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
            </div>

            
            <div className="mb-4">
            <Input
                    type="text"
                    label="Código Pre"
                    name="codpre"
                    error={false}
                    placeholder="1000"
                    value={codpre}
                    maxLength={10}
                    onChange={(e:any)=> setCodpre(formatToNumbersOnly(e.target.value))}/>
            </div>

            
            <div className="mb-4">
                <InputTableSelector label="Itemes Maestros" 
                onClick={()=> setItemesMaeSelector(!itemesMaeSelector)} description={itemesMaeText}/>
            </div>
        
            <div className="flex justify-end">
                <Button onClick={handleSubmit} text="Enviar" type="primary"/>
            </div>

            {itemesMaeSelector && <Modal type="info" title="Selecionar IFRS" onClose={() => (setItemesMaeSelector(false))} menu>
                <TableSelector columns={columns} data={itemesMae} onSelect={(itemesMaeSelected:any) => {
                    setCodigomae(itemesMaeSelected.codigo)
                    setItemesMaeText(itemesMaeSelected.codigo + " - " + itemesMaeSelected.nombre)
                    setItemesMaeSelector(false)
                }
                } title="Selector" />
            </Modal>}

        </div>
    )
}

export default FormItemes