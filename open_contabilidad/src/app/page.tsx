"use client"
import LoginEmpresa from "@/componentes/loginEmpresa";
import background from "@/public/images/fondo.jpg"

export default function Home() {
  
  const backgroundStyle={
    backgroundImage: `url(${background.src})`,
    backgroundSize: 'cover', // You can adjust this based on your needs
    backgroundPosition: 'center', // You can adjust this based on your needs
    backgroundRepeat: 'no-repeat',
  }

  return (
    <main style={backgroundStyle} className="flex items-center justify-center h-screen bg-gradient-to-t from-amber-600 to-yellow-400">
      <LoginEmpresa />
    </main>
  )
}
