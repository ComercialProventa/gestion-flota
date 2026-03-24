"use client";

import { useEffect, useState } from "react";

export default function BotonInstalar() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // 1. Detectar si ya está instalada (Standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsStandalone(true);
        }

        // 2. Detectar el sistema operativo del celular
        const userAgent = window.navigator.userAgent.toLowerCase();
        const esDispositivoIOS = /iphone|ipad|ipod/.test(userAgent);
        const esDispositivoAndroid = /android/.test(userAgent);

        setIsIOS(esDispositivoIOS);
        setIsAndroid(esDispositivoAndroid);

        // 3. Capturar el evento de instalación de Android/Chrome
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    // Evitamos errores de hidratación ocultándolo hasta que el cliente cargue
    if (!isMounted || isStandalone) return null;

    // Si NO es ni Android ni iOS (ej: están en PC), NO mostramos nada
    if (!isIOS && !isAndroid) return null;

    // ==========================================
    // VISTA PARA IPHONE (Instrucciones manuales)
    // ==========================================
    if (isIOS) {
        return (
            <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center shadow-lg backdrop-blur-sm">
                <p className="text-[12px] text-slate-300 font-medium leading-relaxed">
                    📲 <span className="font-bold text-white">Instala la App nativa:</span> Toca el botón <span className="font-bold text-white">Compartir</span> en tu navegador y luego selecciona <span className="font-bold text-white">Agregar al inicio</span>.
                </p>
            </div>
        );
    }

    // ==========================================
    // VISTA PARA ANDROID (Botón de 1 Clic)
    // ==========================================
    if (isAndroid && deferredPrompt) {
        const handleInstallClick = async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                setDeferredPrompt(null);
            }
        };

        return (
            <button
                onClick={handleInstallClick}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-sky-600/20 hover:bg-sky-500 transition-all cursor-pointer border border-sky-500/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Instalar Aplicación Nativa
            </button>
        );
    }

    return null;
}