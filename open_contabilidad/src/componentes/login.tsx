"use client"
import { useEffect, useState, useContext } from "react"
import { signIn } from "next-auth/react"
import  secureLocalStorage  from  "react-secure-storage";
import { useRouter } from "next/navigation"
import Toast from "@/componentes/Utils/Toast";
import ToastList from "./Utils/ToastList";
import { IToast } from "@/interfaces/IToast";
import axios from "axios";
import { API_CONTABILIDAD } from "@/variablesglobales";
import { headers } from "next/dist/client/components/headers";
import { RequestHeadersContext, RequestHeadersContextType } from "./Providers/RequestHeadersProvider";
import { SESSION_NAMES } from "@/variablesglobales";

const Login = () => {

    const router = useRouter()
    const { getHeaders } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [usuario, setUsuario] = useState("")
    const [password, setPassword] = useState("")
    const [isRememember, setRememberMe] = useState(false);
    const [isFalied, setFailed] = useState(false);

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(()=>{

        var user = localStorage.getItem("user");
        var password = secureLocalStorage.getItem("password");
        setUsuario(user !== null ? JSON.parse(user) : "");
        setPassword(password !== null ? JSON.parse(String(password)): "");

    },[]);

    const ingresar = async () => {

        if(isRememember){
            localStorage.setItem("user", JSON.stringify(usuario));
            secureLocalStorage.setItem("password", JSON.stringify(password));
            
        }

        axios.post(API_CONTABILIDAD + "/usuarios/login", {
            codigo: usuario,
            clave: password
          }, {headers: getHeaders()})
          .then((response) => {
            secureLocalStorage.setItem("USER", usuario)
            secureLocalStorage.setItem(SESSION_NAMES.USER_NAME, JSON.stringify(usuario));
            router.push("/dashboard")
          }).catch((error) => {
            setPassword("");
                setFailed(true);
                const newToast:IToast = {
                    id: Date.now(),
                    message: "Usuario o contraseña incorrectos.",
                    duration: 3000,
                    type: "danger",
                  }

                  setToasts([...toasts, newToast])
          });
    }

    const handleRememberChange = () =>{
        setRememberMe(!isRememember);
    }

    const handleOnClose = () =>{
        setFailed(false);
    }

    return (
        <section className="p-6 bg-white rounded-lg shadow-md grid sm:w1-2 md:w-1/3">
            <div className="mb-4">
                <span className="text-2xl">Establecer Cuenta</span>
            </div>

            <div className="w-full md:w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Usuario</label>

                <input className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                    name="user"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={evento => { setUsuario(evento.target.value) }} // onchage responde con un evento
                />
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">    
                    Contraseña
                </label>
                <input className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                    placeholder="Contraseña"
                    type="password"
                    value={password}
                    onChange={evento => { setPassword(evento.target.value) }} // onchage responde con un evento
                />
            </div>

            <div className="w-full flex items-center justify-between px-3 mb-3 ">
            <label htmlFor="remember" className="flex items-center w-1/2">
               <input onChange={handleRememberChange} type="checkbox" name="" id="" className="mr-1 bg-white shadow" />
               <span className="text-sm text-gray-700">Recuérdame</span>
            </label>
         </div>

            <ToastList toasts = {toasts} position="bottom-right" setToasts={setToasts}/>

            <div className="w-full md:w-full px-3 mb-2">
                <button onClick={ingresar} className="text-white w-full bg-sky-500 hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-amber-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <span className="text-lg font-semibold">Ingresar</span>
                </button>
            </div>

        </section>
    )

}

export default Login

