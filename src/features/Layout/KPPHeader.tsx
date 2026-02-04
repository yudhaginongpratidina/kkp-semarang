// libraries
import { useLocation } from "react-router-dom"
import { useMemo } from "react";

export default function KPPHeader() {
    const location = useLocation()

    // Mapping path ke Title agar kode lebih bersih
    const pageTitle = useMemo(() => {
        const path = location.pathname;
        const routes: Record<string, string> = {
            "/dashboard": "Operational Dashboard",
            "/history": "Access Logs & History",
            "/account": "Security Credentials",
            "/user-management": "Staff Control Unit",
            "/traders-management": "Traders Registry Database",
        };
        return routes[path] || "System Module";
    }, [location.pathname]);

    return (
        <header className=" w-full h-16 px-6 flex items-center justify-between border-b border-slate-300 bg-white/80 backdrop-blur-md sticky top-0 z-30 font-mono">
            <div className="flex items-center gap-4">
                {/* Decorative Line */}
                <div className="w-1 h-6 bg-slate-800 rounded-full"></div>
                
                <div>
                    <h1 className="text-sm font-black uppercase tracking-tighter text-slate-800 italic">
                        {pageTitle}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-[0.2em]">
                            Root{location.pathname.replace("/", " > ")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right Side: System Info */}
            <div className="hidden sm:flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Server Time
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                        {new Date().toLocaleTimeString('id-ID', { hour12: false })} WIB
                    </span>
                </div>
                
                <div className="h-8 w-px bg-slate-200"></div>

                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Protocol
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase">
                        Encrypted
                    </span>
                </div>
            </div>
        </header>
    )
}