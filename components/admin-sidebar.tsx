"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Limpiamos los emojis y usamos nombres ultra técnicos y directos

type SubItemType = { name: string; href: string };
type LinkType = { name: string; href: string; icon: React.ReactNode; subItems?: SubItemType[] };
type MenuGroupType = { grupo: string; links: LinkType[] };

const MENU_ITEMS: MenuGroupType[] = [
    {
        grupo: "Gestión Principal",
        links: [
            {
                name: "Usuarios", href: "/admin/usuarios", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                )
            },
            {
                name: "Maestro Flota", href: "/admin/flota", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
                )
            },
        ]
    },
    {
        grupo: "Módulo Neumáticos",
        links: [
            {
                name: "Inventario Central", href: "/admin/neumaticos/inventario", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg>
                )
            },
            {
                name: "Catálogo Modelos", href: "/admin/neumaticos/modelos", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )
            },
        ]
    },
    {
        grupo: "Auditoría y Control",
        links: [
            {
                name: "Centro Inteligencia", href: "/admin/inteligencia", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
                ),
                subItems: [
                    { name: "Combustible", href: "/admin/inteligencia/combustible" },
                    { name: "Neumáticos", href: "/admin/inteligencia/neumaticos" },
                    { name: "Mantenimiento", href: "/admin/inteligencia/mantenimiento" },
                ]
            },
            {
                name: "Bitácora Eventos", href: "/admin/auditoria", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
                )
            },
        ]
    },
    {
        grupo: "Correcciones",
        links: [
            {
                name: "Panel de Corrección", href: "/admin/registros", icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                ),
                subItems: [
                    { name: "Cargas Combustible", href: "/admin/registros/combustible" },
                    { name: "Movs. Neumáticos", href: "/admin/registros/neumaticos" },
                ]
            }
        ]
    }
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-[#0a0a0a] min-h-screen sticky top-0 h-screen">

            {/* Header del Sidebar (Logo/Marca) */}
            <div className="flex h-14 items-center px-6 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-500/10 text-sky-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">Proventa Admin</span>
                </div>
            </div>

            {/* Navegación */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                {MENU_ITEMS.map((seccion) => (
                    <div key={seccion.grupo}>
                        <h4 className="px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2.5">
                            {seccion.grupo}
                        </h4>
                        <nav className="space-y-0.5">
                            {seccion.links.map((link) => {
                                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                                const hasSubItems = "subItems" in link && Array.isArray(link.subItems) && link.subItems.length > 0;

                                return (
                                    <div key={link.name} className="space-y-1">
                                        <Link
                                            href={link.href}
                                            className={`flex items-center gap-2.5 rounded px-2.5 py-2 text-[13px] font-medium transition-colors ${isActive
                                                ? "bg-white/10 text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                                }`}
                                        >
                                            <span className={isActive ? "text-sky-400" : "text-slate-500"}>
                                                {link.icon}
                                            </span>
                                            {link.name}
                                        </Link>

                                        {/* Sub-Items (solo se muestran si aplican y si el grupo está activo) */}
                                        {hasSubItems && isActive && link.subItems && (
                                            <div className="ml-5 mt-1 space-y-1 border-l-2 border-white/5 pl-2 mb-2">
                                                {link.subItems.map((sub) => {
                                                    const isSubActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.name}
                                                            href={sub.href}
                                                            className={`flex items-center gap-2 rounded px-2.5 py-1.5 text-[11px] font-medium transition-colors ${isSubActive
                                                                    ? "bg-white/10 text-white"
                                                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                                                }`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>

            {/* Footer del Sidebar (Usuario) */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 rounded bg-[#121214] border border-white/5 p-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-white">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[12px] font-semibold text-white truncate">Administrador</p>
                        <p className="text-[10px] text-slate-500 truncate">admin@proventa.cl</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}