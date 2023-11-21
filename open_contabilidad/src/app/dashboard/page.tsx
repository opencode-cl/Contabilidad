"use client"
import Sidebar from "@/componentes/Utils/Sidebar"
import { redirect, useSearchParams } from "next/navigation"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState } from "react"

interface Cliente {
    rut: string,
    dv: string,
    nombre: string
}

export default function Home() {

    const [clientes, setClientes] = useState<Cliente[]>([])
    const [filtro, setFiltro] = useState("")

    const leerclientes = async () => {
        alert("click")
        const rpta = await fetch("Services/ApiAuth/buscarclientes?" + new URLSearchParams({
            filtro: filtro
        }),

        )
        const data = await rpta.json()
        setClientes(data)
    }

    return (
        <p></p>
    )
}