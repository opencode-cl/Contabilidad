import { useState, useContext } from "react"
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, ERROR_CODE_EXISTS, UPDATE_ACTION, formatRut, formatToNumbersOnly } from "@/variablesglobales"
import Input from "@/componentes/Utils/Input"
import { IProyecto } from "@/interfaces/IProyecto"
import { IRut } from "@/interfaces/IRut"
import Select from "@/componentes/Utils/Select"
import TableSelector from "@/componentes/Utils/TableSelector"
import Modal from "@/componentes/Utils/Modal"
import InputTableSelector from "@/componentes/Utils/InputTableSelector"
import { IBanco } from "@/interfaces/IBanco"
import Button from "@/componentes/Utils/Button"
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider"

interface FormRutsProps {
    Rut?: IRut
    type: ActionType
    onFormSubmit: (type:string, grupoCuentas:any) => void
    bancosData: IBanco[]
    onError: (message?:string)=>void
    codigoList: number[]
}

const FormRuts: React.FC<FormRutsProps> = ({Rut, type, onFormSubmit, bancosData, onError, codigoList}) =>{

    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [nombre, setNombre] = useState(Rut?.nombre || '')
    const [codigo, setCodigo] = useState(Rut?.codigo !== undefined ? (Rut?.codigo+"-"+Rut?.dv) : '')
    const [direccion, setDireccion] = useState(Rut?.direccion || '')
    const [ciudad, setCiudad] = useState(Rut?.ciudad || '')
    const [comuna, setComuna] = useState(Rut?.comuna || '')
    const [giro, setGiro] = useState(Rut?.giro || '')
    const [telefono, setTelefono] = useState(Rut?.telefonos || '')
    const [fax, setFax] = useState(Rut?.fax || '')
    const [email, setEmail] = useState(Rut?.email || '')
    const [emailContribuyentes, setEmailContribuyentes] = useState(Rut?.emailintercambio || '')
    const [codigoBanco, setCodigoBanco] = useState(Rut?.banco || '')
    const [nroCuenta, setNroCuenta] = useState(Rut?.nrocuenta || '')
    const [tipoCuenta, setTipocuenta] = useState(Rut?.tipocuenta || '')
    const [condiciones, setCondiciones] = useState(Rut?.condiciones || '')

    const[isBancoSelectorVisible, setBancoSelectorVisible] = useState(false)
    const[textBanco, setTextBanco] = useState(Rut?.banco !== undefined ? Rut?.banco : "")

    const[tried, setTried] = useState(false)
    
    const tipoCuentaOptions = [
        {value: "1", text:"Cuenta Vista"},
        {value: "2", text:"Cuenta Ahorro"},
        {value: "3", text:"Cuenta Corriente"},
        {value: "4", text:"Cuenta en Línea"},
    ]

    const colums_data = [
        { name: 'Código', width: "6rem", selector: (row: any) => row.codigo },
        { name: 'Nombre', width: "15rem", selector: (row: any) => row.nombre }
    ]

    const handleSubmit = async () =>{

        if(codigo === "" || nombre === ""){
            setTried(true)
            return
        }

        if(type === CREATE_ACTION && codigoList.includes(Number(codigo.split("-")[0]))){
            onError(ERROR_CODE_EXISTS)
            return
        }

        let rut = { codigo: Number(codigo.split("-")[0]),
                    dv: codigo.split("-")[1],
                    nombre: nombre,
                    direccion: direccion,
                    ciudad: ciudad,
                    comuna:comuna,
                    giro:giro,
                    telefonos:telefono,
                    fax:fax,
                    email:email,
                    emailintercambio: emailContribuyentes,
                    banco: Number(codigoBanco),
                    nrocuenta: Number(nroCuenta),
                    tipocuenta: Number(tipoCuenta),
                    condiciones: condiciones
                }

        try{
            if(type === UPDATE_ACTION){
                await sendRequest(rut, "PUT")
            }
            else if(type === CREATE_ACTION){
                await sendRequest(rut, "POST")
            }
    
            onFormSubmit(type, rut)
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
            const response = await fetch(API_CONTABILIDAD + "/Nombres/", requestOptions)

            if(!response.ok){
                throw new Error("Error en la petición.")
            }
        }catch(error){
            throw error;
        }
        
    }
    

    return(
        <div>
            <div className="mb-4 grid md:grid-cols-4 gap-4">
                <Input
                    type="text"
                    label="Rut"
                    name="codigo"
                    error={tried && codigo===""}
                    placeholder="11.111.111-1"
                    value={codigo}
                    maxLength={12}
                    onChange={(e:any)=> setCodigo(formatRut(e.target.value))}
                    disabled = {type === UPDATE_ACTION}
                    />
            <div className="md:col-span-3">
               <Input  
                    type="text"
                    label="Nombre"
                    name="Nombre"
                    error={tried && codigo ===""}
                    maxLength={250}
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e:any)=> setNombre(e.target.value)}/>
             </div>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
            <Input
                    type="text"
                    label="Ciudad"
                    name="ciudad"
                    error={false}
                    placeholder="Concepción"
                    value={ciudad}
                    onChange={(e:any)=> setCiudad(e.target.value)}
                    maxLength={250}/>
            <Input
                    type="text"
                    label="Comuna"
                    name="comuna"
                    error={false}
                    placeholder="Talcahuano"
                    value={comuna}
                    onChange={(e:any)=> setComuna(e.target.value)}
                    maxLength={25}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Dirección"
                    name="direccion"
                    error={false}
                    placeholder=""
                    value={direccion}
                    onChange={(e:any)=> setDireccion(e.target.value)}
                    maxLength={250}/>
            </div>

            <div className="mb-4">
            <Input
                    type="text"
                    label="Giro"
                    name="giro"
                    error={false}
                    placeholder=""
                    value={giro}
                    onChange={(e:any)=> setGiro(e.target.value)}
                    maxLength={200}/>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
            <Input
                    type="text"
                    label="Teléfono"
                    name="telefono"
                    error={false}
                    placeholder="911111111"
                    value={telefono}
                    onChange={(e:any)=> setTelefono(e.target.value)}
                    maxLength={20}/>
            <Input
                    type="text"
                    label="Fax"
                    name="fax"
                    error={false}
                    placeholder=""
                    value={fax}
                    onChange={(e:any)=> setFax(e.target.value)}
                    maxLength={20}/>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
            <Input
                    type="text"
                    label="Email Comercial"
                    name="email"
                    error={false}
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e:any)=> setEmail(e.target.value)}
                    maxLength={50}/>
            <Input
                    type="text"
                    label="Email Contribuyente"
                    name="email"
                    error={false}
                    placeholder="email@email.com"
                    value={emailContribuyentes}
                    onChange={(e:any)=> setEmailContribuyentes(e.target.value)}
                    maxLength={90}/>
            </div>
            
            <div className="mb-4 grid grid-cols-2 gap-4">
            <InputTableSelector 
                label="Banco"
                onClick={()=>setBancoSelectorVisible(!isBancoSelectorVisible)}
                description={textBanco}/>
            <Input
                    type="text"
                    label="N° Cuenta"
                    name="ncuenta"
                    error={false}
                    placeholder="1"
                    maxLength={12}
                    value={nroCuenta}
                    onChange={(e:any)=> setNroCuenta(formatToNumbersOnly(e.target.value))}/>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-4">
            <Select label="cuenta" 
                    name="cuenta"
                    title="Tipo cuenta"
                    error={false}
                    selected={tipoCuenta}
                    options = {tipoCuentaOptions}
                    onChange={(e:any)=>setTipocuenta(e.target.value)}/>
            <Input
                    type="text"
                    label="Condiciones Comerciales"
                    name="condiciones"
                    error={false}
                    placeholder=""
                    maxLength={50}
                    value={condiciones}
                    onChange={(e:any)=> setCondiciones(e.target.value)}/>
            </div>

            <div className="flex justify-end">
                <Button text="Enviar" type="primary" onClick={handleSubmit}/>
            </div>

            {isBancoSelectorVisible && <Modal type="info" title="Selecionar Banco" onClose={() => (setBancoSelectorVisible(false))}>
                <TableSelector columns={colums_data} data={bancosData} onSelect={(bancoSelected:any) => {
                    setCodigoBanco(bancoSelected.codigo)
                    setTextBanco(bancoSelected.codigo + " - " + bancoSelected.nombre)
                    setBancoSelectorVisible(false)
                }
                } 
                title="Selector" />
            </Modal>}

        </div>
    )
}

export default FormRuts