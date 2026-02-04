import { useModalStore } from "../../stores";
import { IoClose, IoTerminal } from "react-icons/io5";

const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl", // Diperlebar sedikit untuk kenyamanan input data
};

export default function KPPModal() {
    const { isOpen, title, content, size, close } = useModalStore();
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* BACKDROP: High isolation contrast */}
            <div 
                onClick={close} 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
            />
            
            {/* MODAL CONTAINER: Industrial Chassis */}
            <div className={`
                relative z-10 w-full ${sizeMap[size]} 
                bg-white border border-slate-800 
                shadow-[20px_20px_0px_0px_rgba(0,0,0,0.2)] 
                transform transition-all duration-200 
                overflow-hidden rounded-xs
            `}>
                
                {/* HEADER: Unit Identifier Style */}
                <div className="flex items-center justify-between bg-slate-900 px-5 py-3 text-white">
                    <div className="flex items-center gap-3">
                        <IoTerminal className="text-emerald-400 text-sm" />
                        <h1 className="text-[11px] font-black uppercase tracking-[0.3em]">
                            {title || "SYSTEM_DIALOG"}
                        </h1>
                    </div>
                    <button
                        onClick={close}
                        className="p-1 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-transparent hover:border-white/20"
                        aria-label="Terminate"
                    >
                        <IoClose className="w-5 h-5" />
                    </button>
                </div>

                {/* STATUS BAR: Decorative technical line */}
                <div className="h-0.5 w-full bg-slate-200 flex">
                    <div className="h-full w-1/3 bg-blue-600"></div>
                    <div className="h-full w-1/6 bg-emerald-500"></div>
                </div>
                
                {/* CONTENT: Focus Zone */}
                <div className="px-8 py-8 text-slate-800 font-sans">
                    {content}
                </div>

                {/* FOOTER: System Signature */}
                <div className="px-6 py-2 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-slate-300"></div>
                        <div className="w-4 h-1 bg-slate-300"></div>
                    </div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                        Authorization_Required // {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </div>
    );
}