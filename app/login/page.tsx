import type { Metadata } from "next";
import LoginForm from "./login-form";
import BotonInstalar from "@/components/BotonInstalar"; // Verifica que esta ruta sea correcta

export const metadata: Metadata = {
  title: "Iniciar Sesión | ProVenta Dev",
  description: "Accede al sistema ProVenta Dev",
};

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] font-sans antialiased">

      {/* 1. CONTENEDOR DE LA IMAGEN (Fondo total en móvil, mitad izquierda en PC) */}
      <div className="absolute inset-0 z-0 md:w-1/2 lg:w-3/5">
        <img
          src="https://wallpapers.com/images/hd/bus-pictures-rl32oz1943hfntb7.jpg"
          alt="ProVenta Dev Studio"
          className="h-full w-full object-cover"
        />

        {/* === AQUÍ AJUSTAS LA OPACIDAD DEL COVER === */}
        {/* Modifica el /60 o el /80 para cambiar la transparencia */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply" />

        {/* Texto decorativo sobre la imagen (solo visible en PC) */}
        <div className="absolute bottom-12 left-12 z-10 hidden md:block text-white/80">
          <p className="text-xl font-extrabold tracking-tighter">
            ProVenta<span className="text-red-600">.</span>Dev
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-400">
            Potencia Tecnológica
          </p>
        </div>
      </div>

      {/* 2. CONTENEDOR DEL FORMULARIO (Flota en móvil, se ancla a la derecha en PC) */}
      {/* En PC tiene un fondo sólido oscuro para separar visualmente la imagen */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center p-6 md:ml-auto md:w-1/2 md:bg-[#0a0a0a] lg:w-2/5 md:border-l md:border-white/5">

        {/* Tarjeta: Efecto cristal difuminado en móvil, totalmente plana e integrada en PC */}
        <div className="w-full max-w-sm rounded-xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md md:border-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white">
              ProVenta<span className="text-red-600">.</span>Dev
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Ingresa tus credenciales para acceder
            </p>
          </div>

          {/* Formulario interactivo */}
          <LoginForm />

          {/* === BOTÓN INTELIGENTE DE INSTALACIÓN PWA === */}
          <BotonInstalar />

          <p className="mt-12 text-center text-[10px] uppercase tracking-widest text-slate-500 md:text-left">
            Comercial Proventa © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}