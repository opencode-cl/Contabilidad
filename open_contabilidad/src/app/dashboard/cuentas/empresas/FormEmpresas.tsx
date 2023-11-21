import { useRef, useState, useContext } from "react";
import { API_CONTABILIDAD, ActionType, CREATE_ACTION, UPDATE_ACTION, formatToNumbersOnly, formatToFloatOnly, ERROR_CODE_EXISTS } from "@/variablesglobales";
import Input from "@/componentes/Utils/Input";
import { IEmpresa } from "@/interfaces/IEmpresa";
import { formatRut } from "@/variablesglobales";
import Button from "@/componentes/Utils/Button";
import { RequestHeadersContext, RequestHeadersContextType } from "@/componentes/Providers/RequestHeadersProvider";

interface FormEmpresasProps {
  Empresa?: IEmpresa;
  type: ActionType;
  onFormSubmit: (type: string, empresa: IEmpresa) => void;
  onError: (message?:string) => void;
  codigoList: number[]
}

const FormEmpresas: React.FC<FormEmpresasProps> = ({ Empresa, type, onFormSubmit, onError, codigoList }) => {
  
  const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;
  
  const [formValues, setFormValues] = useState({
    codigo: Empresa?.codigo || "",
    rut: Empresa?.rut !== undefined ? Empresa?.rut + "-" + Empresa?.dv : "",
    dv: "",
    nombre: Empresa?.nombre || "",
    direccion: Empresa?.direccion || "",
    ciudad: Empresa?.ciudad || "",
    comuna: Empresa?.comuna || "",
    giro: Empresa?.giro || "",
    replegal: Empresa?.replegal || "",
    rutreplegal: Empresa?.rutreplegal !== undefined ? Empresa?.rutreplegal + "-" + Empresa?.dvrutreplegal : "",
    dvrutreplegal: "",
    controlila: Empresa?.controlila || 0,
    email: Empresa?.email || "",
    password: Empresa?.password || "",
    smtp: Empresa?.smtp || "",
    imap: Empresa?.imap || "",
    emailcorp: Empresa?.emailcorp || "",
    puerto: Empresa?.puerto || 0,
    telefono: Empresa?.telefono || 0,
    rutusuariosii: Empresa?.rutusuariosii !== undefined ? Empresa?.rutusuariosii + "-" + Empresa?.dvusuariosii : "",
    dvusuariosii: "",
    codacteco: Empresa?.codacteco || 0,
    codsucsii: Empresa?.codsucsii || 0,
    vbegresos: Empresa?.vbegresos || 0,
    nomsucsii: Empresa?.nomsucsii || "",
    fechares: Empresa?.fechares !== undefined ? Empresa?.fechares.split("T")[0] : "",
    numerores: Empresa?.numerores || 0,
    basecmaf: Empresa?.basecmaf || "",
    ppm: Empresa?.ppm || 0,
    foliomensual: Empresa?.foliomensual || 0,
  });

  const [tried, setTried] = useState(false)
  const startRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {

    if(formValues.codigo === "" || formValues.nombre === "" || formValues.rut === ""){
      setTried(true)
      startRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
      return
    }

    if(type===CREATE_ACTION && codigoList.includes(Number(formValues.codigo))){
      onError(ERROR_CODE_EXISTS)
      startRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth' });
      return
    }

    const empresa = {
      codigo: Number(formValues.codigo),
      rut: parseInt(formValues.rut.split("-")[0]),
      dv: formValues.rut.split("-")[1],
      nombre: formValues.nombre,
      direccion: formValues.direccion,
      ciudad: formValues.ciudad,
      comuna: formValues.comuna,
      giro: formValues.giro,
      replegal: formValues.replegal,
      rutreplegal: formValues.rutreplegal ? parseInt(formValues.rutreplegal.split("-")[0]): 0,
      dvrutreplegal: formValues.rutreplegal.split("-")[1],
      controlila: formValues.controlila,
      email: formValues.email,
      password: formValues.password,
      smtp: formValues.smtp,
      imap: formValues.imap,
      emailcorp: formValues.emailcorp,
      puerto: formValues.puerto,
      telefono: formValues.telefono,
      rutusuariosii: formValues.rutusuariosii ? parseInt(formValues.rutusuariosii.split("-")[0]) : 0,
      dvusuariosii: formValues.rutusuariosii.split("-")[1] || "",
      codacteco: formValues.codacteco,
      codsucsii: formValues.codsucsii,
      vbegresos: formValues.vbegresos,
      nomsucsii: formValues.nomsucsii,
      fechares: formValues.fechares === "" ? undefined : formValues.fechares,
      numerores: formValues.numerores,
      basecmaf: formValues.basecmaf,
      ppm: formValues.ppm,
      foliomensual: formValues.foliomensual
    }
    try {
      if (type === UPDATE_ACTION) {
        await sendRequest(empresa, "PUT");
      } else if (type === CREATE_ACTION) {
        await sendRequest(empresa, "POST");
      }
      onFormSubmit(type, empresa);
    } catch (e) {
      onError();
    }
  };

  async function sendRequest(data: IEmpresa, method: string) {
    const requestOptions = {
      method: method,
      headers: getHeaders(),
      body: JSON.stringify(data),
    };
    console.log(JSON.stringify(data))

    try {
      const response = await fetch(API_CONTABILIDAD + "/Empresas/", requestOptions);
      if (!response.ok) {
        throw new Error("Error en la petición.")
      }
    } catch (e) {
      throw e;
    }
  }

  return (
    <div ref={startRef}>
      
      <Input
        type="text"
        label="Código"
        name="codigo"
        value={formValues.codigo}
        onChange={(e: any) => setFormValues({ ...formValues, codigo: Number(formatToNumbersOnly(e.target.value)) })}
        maxLength={11}
        placeholder="1000"
        error = {tried && formValues.codigo === ""}
        disabled = {type === UPDATE_ACTION}
      />

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Input
            type="text"
            label="RUT"
            name="rut"
            placeholder="11.111.111-1"
            error={tried && formValues.rut === ""}
            value={formValues.rut}
            maxLength={15}
            onChange={(e: any) => setFormValues({ ...formValues, rut: formatRut(e.target.value) })}
          />
        </div>

        <div className="col-span-3">
          <Input
            type="text"
            label="Nombre"
            name="nombre"
            placeholder="Nombre"
            error={tried && formValues.nombre === ""}
            value={formValues.nombre}
            maxLength={50}
            onChange={(e) => setFormValues({ ...formValues, nombre: e.target.value })}
          />
        </div>
      </div>

      <Input
        type="text"
        label="Dirección"
        name="direccion"
        placeholder="Av. Avenida 123"
        value={formValues.direccion}
        maxLength={50}
        onChange={(e) => setFormValues({ ...formValues, direccion: e.target.value })}
      />

      <div className="grid grid-cols-3 gap-4">
        <Input
          type="text"
          label="Ciudad"
          placeholder="Concepción"
          name="ciudad"
          value={formValues.ciudad}
          maxLength={25}
          onChange={(e) => setFormValues({ ...formValues, ciudad: e.target.value })}
        />

        <Input
          type="text"
          label="Comuna"
          name="comuna"
          placeholder="Concepción"
          value={formValues.comuna}
          maxLength={25}
          onChange={(e) => setFormValues({ ...formValues, comuna: e.target.value })}
        />

        <Input
          type="text"
          label="Teléfono"
          placeholder="949999999"
          name="telefono"
          maxLength={11}
          value={formValues.telefono}
          onChange={(e: any) => setFormValues({ ...formValues, telefono: Number(formatToNumbersOnly(e.target.value)) })}
        />

      </div>


      <Input
        type="text"
        label="Giro"
        name="giro"
        placeholder="Giro"
        maxLength={100}
        value={formValues.giro}
        onChange={(e) => setFormValues({ ...formValues, giro: e.target.value })}
      />

      <div className="grid grid-cols-4 gap-3">
        <Input
          type="text"
          label="RUT Representante Legal"
          placeholder="11111111-1"
          name="rutreplegal"
          maxLength={15}
          value={formValues.rutreplegal}
          onChange={(e: any) => setFormValues({ ...formValues, rutreplegal: formatRut(e.target.value) })}
        />

        <div className="col-span-3">
          <Input
            type="text"
            label="Representante Legal"
            name="replegal"
            placeholder="11.111.111-1"
            maxLength={15}
            value={formValues.replegal}
            onChange={(e) => setFormValues({ ...formValues, replegal: e.target.value })}
          />
        </div>

      </div>

      <Input
        type="text"
        label="Email Corporativo"
        placeholder="email@email.com"
        name="emailcorp"
        maxLength={50}
        value={formValues.emailcorp}
        onChange={(e) => setFormValues({ ...formValues, emailcorp: e.target.value })}
      />
      <div className="grid grid-cols-5 gap-3">
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="correo@correo.com"
            label="Email"
            name="email"
            maxLength={90}
            value={formValues.email}
            onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Input
            type="password"
            label="Password"
            placeholder="123"
            name="password"
            maxLength={30}
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <Input
            type="text"
            placeholder="smtp.smtp.cl"
            label="SMTP"
            name="smtp"
            maxLength={30}
            value={formValues.smtp}
            onChange={(e) => setFormValues({ ...formValues, smtp: e.target.value })}
          />
        </div>

        <Input
          type="text"
          label="Puerto"
          placeholder="443"
          name="puerto"
          maxLength={6}
          value={formValues.puerto}
          onChange={(e: any) => setFormValues({ ...formValues, puerto: e.target.value })}
        />

      </div>

      <Input
        type="text"
        label="IMAP"
        name="imap"
        placeholder="imap.imap.cl"
        maxLength={50}
        value={formValues.imap}
        onChange={(e) => setFormValues({ ...formValues, imap: e.target.value })}
      />

      <Input
        type="text"
        label="RUT Usuario SII"
        placeholder="11111111-1"
        name="rutusuariosii"
        maxLength={15}
        value={formValues.rutusuariosii}
        onChange={(e) => setFormValues({ ...formValues, rutusuariosii: formatRut(e.target.value) })}
      />

      <Input
        type="text"
        label="Código Actividad Económica"
        placeholder="1000"
        name="codacteco"
        maxLength={15}
        value={formValues.codacteco}
        onChange={(e: any) => setFormValues({ ...formValues, codacteco: Number(formatToNumbersOnly(e.target.value)) })}
      />

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Input
            type="text"
            label="Código Sucursal SII"
            placeholder="1000"
            name="codsucsii"
            maxLength={11}
            value={formValues.codsucsii}
            onChange={(e: any) => setFormValues({ ...formValues, codsucsii: Number(formatToNumbersOnly(e.target.value)) })}
          />
        </div>
        <div className="col-span-3">
          <Input
            type="text"
            label="Nombre Sucursal SII"
            placeholder="Sucursal"
            name="nomsucsii"
            maxLength={30}
            value={formValues.nomsucsii}
            onChange={(e) => setFormValues({ ...formValues, nomsucsii: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="fechares">Fecha</label>

          <input
            type="date"
            placeholder="12-12-2222"
            className="border shadow w-full px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="fechares"
            value={formValues.fechares}
            onChange={(e) => setFormValues({ ...formValues, fechares: e.target.value })}
          />
        </div>


        <Input
          type="text"
          placeholder="123"
          label="Número Resolución SII"
          name="numerores"
          maxLength={6}
          value={formValues.numerores}
          onChange={(e: any) => setFormValues({ ...formValues, numerores: Number(formatToNumbersOnly(e.target.value)) })}
        />

        <Input
          type="text"
          label="PPM"
          placeholder="0"
          name="ppm"
          value={formValues.ppm}
          onChange={(e: any) => setFormValues({ ...formValues, ppm: Number(formatToFloatOnly(e.target.value)) })}
        />

      </div>

      <div className="flex mt-2 justify-end">
        <Button type="primary" onClick={handleSubmit} text="Enviar"/>
      </div>
    </div>
  );
};

export default FormEmpresas;