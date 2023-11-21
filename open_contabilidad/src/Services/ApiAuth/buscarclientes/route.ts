import { API } from "@/variablesglobales";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const res = await fetch(API + "/clientes/buscarcliente?" + new URLSearchParams({
        filtro: req.nextUrl.searchParams.get("filtro") as string
    }),
    )

    const data = await res.json()

    return NextResponse.json(data)
}