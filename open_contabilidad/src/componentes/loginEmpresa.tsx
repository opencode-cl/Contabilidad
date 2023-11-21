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
import { RequestHeadersContext, RequestHeadersContextType } from "./Providers/RequestHeadersProvider";
import logo from '@/public/images/opencodeicon.png'
import Image from "next/image";

const LoginEmpresa = () => {

    const router = useRouter()
    const { setToken } = useContext(RequestHeadersContext) as RequestHeadersContextType;

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isRememember, setRememberMe] = useState(false);
    const [isFailed, setFailed] = useState(false);

    const [toasts, setToasts] = useState<IToast[]>([])

    useEffect(()=>{

        var user = localStorage.getItem("user-cmp");
        var password = secureLocalStorage.getItem("password-cmp");
        setEmail(user !== null ? JSON.parse(user) : "");
        setPassword(password !== null ? JSON.parse(String(password)): "");

    },[]);

    const ingresar = async () => {

        if(isRememember){
            localStorage.setItem("user-cmp", JSON.stringify(email));
            secureLocalStorage.setItem("password-cmp", JSON.stringify(password));
        }

        console.log(API_CONTABILIDAD);
        axios.post(API_CONTABILIDAD + "/auth/login", {
            email: email,
            password: password
          })
          .then((response) => {
            setToken(response.data);
            router.push("/login")
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
            <div className="flex justify-center">
                <Image src={logo} alt="Opencode logo" className="w-48"/>
            </div>

            <div className="mb-4">
                <span className="text-2xl">Iniciar Sesión</span>
            </div>

            <div className="w-full md:w-full px-3 mb-6">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Correo</label>

                <input className="block w-full bg-white text-gray-900 font-medium border border-gray-400 rounded-lg py-3 px-3 leading-tight focus:outline-none"
                    name="user"
                    placeholder="Correo@abc.com"
                    value={email}
                    onChange={evento => { setEmail(evento.target.value) }} // onchage responde con un evento
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

            <ToastList toasts = {toasts} setToasts={setToasts} position="bottom-right"/>

            <div className="w-full md:w-full px-3 mb-2">
                <button onClick={ingresar} className="text-white w-full bg-amber-500 hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-amber-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mt-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <span className="text-lg font-semibold">Ingresar</span>
                </button>
            </div>

        </section>
    )

}

export default LoginEmpresa

