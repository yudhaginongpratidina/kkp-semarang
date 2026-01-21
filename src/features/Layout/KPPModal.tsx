import { useModalStore } from "../../stores";
import { IoClose } from "react-icons/io5";

const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export default function KPPModal() {
    const { isOpen, title, content, size, close } = useModalStore();
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop dengan warna hitam transparan dan blur */}
            <div 
                onClick={close} 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
            />
            
            {/* Modal Container */}
            <div className={`relative z-10 w-full ${sizeMap[size]} rounded-lg bg-white shadow-2xl transform transition-all duration-200 overflow-hidden`}>
                
                {/* Header dengan nuansa Biru */}
                {title && (
                    <div className="flex items-center justify-between border-b border-blue-100 px-6 py-4 bg-blue-600">
                        <h1 className="text-lg font-bold text-white tracking-wide">
                            {title}
                        </h1>
                        <button
                            onClick={close}
                            className="flex items-center justify-center w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                            aria-label="Close modal"
                        >
                            <IoClose className="w-6 h-6" />
                        </button>
                    </div>
                )}
                
                {/* Content dengan background Putih & teks gelap */}
                <div className="px-6 py-6 text-slate-700 bg-white">
                    {content}
                </div>

                {/* Optional: Footer jika dibutuhkan untuk estetika */}
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                        Sistem Informasi Layanan
                    </p>
                </div>
            </div>
        </div>
    );
}