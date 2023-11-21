import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatNumber, formatToFloatOnly, NO_OPTION, ERROR_CODE_EXISTS } from "@/variablesglobales"
import { ITipoDocumento } from "@/interfaces/ITipoDocumento"
import { ICuenta } from "@/interfaces/ICuenta"
import Input from "@/componentes/Utils/Input"
import InputTableSelector from "@/componentes/Utils/InputTableSelector"
import Modal from "@/componentes/Utils/Modal"
import TableSelector from "@/componentes/Utils/TableSelector"
import Checkbox from "@/componentes/Utils/Checkbox"
import Select from "@/componentes/Utils/Select"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormTipoDocumentoProps {
    TipoDocumento?: ITipoDocumento
    action: ActionType
    onFormSubmit: (type:string, TipoDocumento:ITipoDocumento) => void
    cuentasList: ICuenta[]
    onError: (message?:string) => void
    codigoList: { codigo: number; libro: string }[]
}

const FormTipoDocumento: React.FC<FormTipoDocumentoProps> = ({TipoDocumento, action, onFormSubmit, cuentasList, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(TipoDocumento?.nombre || '')
    const [codigo, setCodigo] = useState(TipoDocumento?.codigo || 0)
    const [cuenta, setCuenta] = useState(TipoDocumento?.cuenta || 0)
    const [exenta, setExenta] = useState(TipoDocumento?.exenta === "S" ? true : false)
    const [sigla, setSigla] = useState(TipoDocumento?.sigla || "")
    const [retencion, setRetencion] = useState(TipoDocumento?.retencion || 0)
    const [bonificacion, setBonificacion] = useState(TipoDocumento?.bonificacion || 0)
    const [electronico, setElectronico] = useState(TipoDocumento?.electronico || 0)
    const [libro, setLibro] = useState<"C"|"H"|"V"| "">(TipoDocumento?.libro || '')

    const[cuentaText, setCuentaText] = useState<string>(formatNumber(cuenta)) 
    const[isModalCuenta, setModalCuenta] = useState(false)

    const [tried, setTried] = useState(false)

    const librosOptions = [ {value:"C", text:"C"},
                            {value:"V", text:"V"},
                            {value:"H", text:"H"}]

    const handleSubmit = async () =>{

        if(libro === "" || libro === NO_OPTION || codigo === 0 || nombre === "" || cuenta === 0){
            setTried(true)
            return
        }
        
        if(action===CREATE_ACTION && codigoList.some(item => item.libro === libro && item.codigo === codigo)){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let tipoDocumento: ITipoDocumento = {    referencia: TipoDocumento?.referencia || 0,
                                                codigo: codigo,
                                                nombre: nombre,
                                                libro: libro,
                                                exenta: exenta ? "S" : "N",
                                                cuenta: cuenta,
                                                sigla: sigla,
                                                retencion: retencion,
                                                bonificacion: bonificacion,
                                                electronico: electronico
                                                }

    try{
        if(action === UPDATE_ACTION){
            await sendRequest(tipoDocumento, "PUT")
        }

        if(action === CREATE_ACTION){
            await sendRequest(tipoDocumento, "POST")
        }

        onFormSubmit(action, tipoDocumento)
    }catch(e){
        onError()
    }

    }

    const cuentasColumn = [
        { name: 'Código', width: "6rem", selector: (row: any) => row.codigo },
        { name: 'Nombre', width: "8rem", selector: (row: any) => row.nombre, wrap:true},
        { name: 'Grupo', width: "6rem", selector: (row: any) => row.grupo },
        { name: 'Nombre Grupo', wrap:true, selector: (row: any) => row.nGrupo }
]


    async function sendRequest(data:any, method:string){
        const requestOptions = {
            method: method,
            headers: getHeaders(),
            body: JSON.stringify(data)
          };

        try{
            const response = await fetch(API_CONTABILIDAD + "/TipoDocumento/", requestOptions)
            if(!response.ok){
                throw new Error("Error en la petición.")
            }
        }catch(e){
            throw e;
        }   
    }
    
    return(
        <div>
            <div className="mb-4 grid grid-cols-3 gap-4">

                <div>
                    <Select 
                        title="Libros"
                        label="libros"
                        name="libros"
                        error={tried && (libro === "" || libro === NO_OPTION)}
                        options={librosOptions}
                        selected={libro}
                        onChange={(e:any)=>setLibro(e.target.value)}
                        />
                </div>
            
                <div className="col-span-2">
                    <Input
                    type="text" 
                    label="Código" 
                    placeholder="1000" 
                    value={codigo}
                    name="codigo"
                    error={tried && codigo === 0} 
                    onChange={(e:any) => setCodigo(Number(formatToNumbersOnly(e.target.value)))}/>
                </div>
            </div>
            <div className="mb-4">
            <Input 
                type="text" 
                label="Nombre" 
                placeholder="Nombre"
                value={nombre}
                name="codigo"
                error={tried && nombre === ""} 
                maxLength={50}
                onChange={(e) => setNombre(e.target.value)}/>
            </div>

            <InputTableSelector 
                label="Cuenta" 
                description={cuentaText} 
                error = {tried && cuenta === 0}
                onClick={()=>setModalCuenta(true)}/> 

            <div className="mb-4">
            <Input 
                type="text" 
                label="Sigla" 
                placeholder="AAA"
                value={sigla}
                name="codigo"
                error={false}
                maxLength={3}
                onChange={(e) => setSigla(e.target.value)}/>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 place-items-center">
                <Input type="text" label="Bonificación"
                    value={bonificacion}
                    placeholder="0"
                    name="bonificacion" error={false} onChange={(e:any) => setBonificacion(Number(formatToFloatOnly(e.target.value)))} />
                <Input type="text" label="Retención"
                    value={retencion}
                    placeholder="0"
                    name="" error={false} onChange={(e:any) => setRetencion(Number(formatToFloatOnly(e.target.value)))} />
                <Input type="text" label="Eléctronico"
                    value={electronico}
                    placeholder="0"
                    name="" error={false} onChange={(e:any) => setElectronico(Number(formatToNumbersOnly(e.target.value)))} />
                <Checkbox label="Exenta" checked={exenta} name="exenta"  onChange={() => setExenta(!exenta)}/>
            </div>

            <div className="flex justify-end">
                <Button text="Enviar" onClick={handleSubmit} type="primary"/>
            </div>
        
            {isModalCuenta && <Modal type="info" title="Selecionar Cuenta" width="w-1/2" onClose={() => (setModalCuenta(false))}>
                <TableSelector columns={cuentasColumn} data={cuentasList} onSelect={(cuentaSelected:any) => {
                    setCuenta(cuentaSelected.referencia)
                    setCuentaText(cuentaSelected.codigo + " - " + cuentaSelected.nombre)
                    setModalCuenta(false)
                }
                } title="Selector" />
            </Modal>}

        </div>
    )
}

export default FormTipoDocumento