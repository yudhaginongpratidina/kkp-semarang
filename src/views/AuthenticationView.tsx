// libraries
import { useLocation } from "react-router-dom"

// features
import { LoginForm } from "../features/Authentication"

export default function AuthenticationView() {
    const location = useLocation()

    return (
        <main className="w-full min-h-screen flex flex-col justify-center items-center bg-[#E2E8F0] p-6 font-mono relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-30" 
                 style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>
            <div className="absolute top-10 left-0 w-full h-px bg-slate-300 z-0"></div>
            <div className="absolute top-0 left-20 w-px h-full bg-slate-300 z-0"></div>

            <div className="w-full max-w-lg z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-slate-800 p-2 rounded-sm shadow-lg">
                        <img 
                            src="./logo.png" 
                            alt="Logo" 
                            className="w-12 h-12 object-contain brightness-200" 
                        />
                    </div>
                    <div className="border-l-2 border-slate-800 pl-4">
                        <h1 className="text-lg font-black tracking-tighter text-slate-800 uppercase leading-none">
                            User Auth <span className="font-light text-slate-500">v1.0</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-1">
                            KKP RI - SEMARANG 
                        </p>
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-2 border-l-2 border-slate-800"></div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-2 border-r-2 border-slate-800"></div>

                    <div className="w-full bg-[#F1F5F9] border border-slate-300 rounded-sm shadow-[20px_20px_0px_rgba(30,41,59,0.1)] p-8 sm:p-10">
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-2 h-2 bg-slate-800 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">System Ready</span>
                        </div>

                        <div className="space-y-6">
                            {(location.pathname === "/" || location.pathname === "/login") && <LoginForm />}
                        </div>
                    </div>
                </div>

                {/* Footer Data */}
                <div className="flex justify-between items-center mt-2">
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Core_System.Initialize()
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                        Loc: 6.9667° S, 110.4167° E
                    </div>
                </div>
            </div>
        </main>
    )
}