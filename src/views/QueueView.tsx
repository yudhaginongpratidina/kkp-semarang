import { useEffect, useState, useCallback } from "react";
import useQueueStore from "../stores/useQueueStore";
import { FaMobileAlt, FaFlask, FaHeadset, FaMicrochip, FaExpand } from "react-icons/fa";

export default function QueueView() {
    const { smkhp, laboratorium, customer_service, getSMKHP, getLaboratorium, getCustomerService } = useQueueStore();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isFullscreen, setIsFullscreen] = useState(false);

    const CONFIG = {
        SMKHP: { prefix: "A", color: "text-blue-400", border: "border-blue-500", icon: <FaMobileAlt /> },
        Laboratorium: { prefix: "B", color: "text-purple-400", border: "border-purple-500", icon: <FaFlask /> },
        "Customer Service": { prefix: "C", color: "text-emerald-400", border: "border-emerald-500", icon: <FaHeadset /> }
    };

    // --- LOGIC FULLSCREEN ---
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message}`);
            });
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && document.fullscreenElement) {
                document.exitFullscreen();
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        window.addEventListener("keydown", handleKeyDown);

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const unsubSMKHP = getSMKHP();
        const unsubLAB = getLaboratorium();
        const unsubCS = getCustomerService();

        return () => {
            clearInterval(timer);
            unsubSMKHP(); unsubLAB(); unsubCS();
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const formatQueue = (type: string, num: any) => {
        const prefix = CONFIG[type as keyof typeof CONFIG]?.prefix || "";
        const paddedNum = String(num || 0).padStart(3, '0');
        return `${prefix}${paddedNum}`;
    };

    const processingSMKHP = smkhp.find(q => q.subStatus === "Diproses");
    const processingLAB = laboratorium.find(q => q.subStatus === "Diproses");
    const processingCS = customer_service.find(q => q.subStatus === "Diproses");

    const latestFeed = [...smkhp, ...laboratorium, ...customer_service]
        .filter(q => q.subStatus !== "Diproses")
        .sort((a) => (a.subStatus === "Dipanggil" ? -1 : 1))
        .slice(0, 8); // Ditambah satu karena layar fullscreen lebih luas

    return (
        <div
            onClick={!isFullscreen ? toggleFullscreen : undefined}
            className={`min-h-screen bg-[#050608] text-zinc-300 p-6 font-mono overflow-hidden flex flex-col selection:bg-orange-500/30 ${!isFullscreen ? 'cursor-zoom-in' : 'cursor-default'}`}
        >
            {/* --- FULLSCREEN OVERLAY HINT --- */}
            {!isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border-4 border-orange-600 m-4 rounded-sm">
                    <FaExpand className="text-6xl text-orange-500 mb-4 animate-bounce" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest">Klik Dimana Saja Untuk Mode Fullscreen</h2>
                    <p className="text-zinc-500 mt-2 italic text-sm">Tekan 'ESC' untuk keluar dari terminal</p>
                </div>
            )}

            {/* --- INDUSTRIAL HEADER --- */}
            <header className="flex justify-between items-center mb-8 border-b-4 border-zinc-800 pb-4 relative">
                <div className="flex items-center gap-6">
                    <div className="bg-zinc-800 p-3 border border-zinc-700 rounded-sm shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        <FaMicrochip className="text-orange-500 text-3xl animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-white">
                            TERMINAL<span className="text-orange-500">_MONITOR</span>
                        </h1>
                        <div className="flex gap-3 items-center mt-2">
                            <span className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-sm border border-blue-500/30 font-black uppercase tracking-widest">System.Active</span>
                            <span className="text-xs text-zinc-600 font-bold uppercase tracking-tighter">NODE_ID: BPPMHKP_SHP_v4.0</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.4em] mb-1">Temporal_Stamp</div>
                    <div className="text-6xl font-black text-white bg-zinc-900 border-x-4 border-orange-600 px-8 py-2 rounded-sm shadow-[inset_0_0_30px_rgba(0,0,0,1)] tabular-nums">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-12 gap-6 flex-1 mb-16">

                {/* --- LEFT: CORE OPS --- */}
                <div className="col-span-8 flex flex-col gap-6">

                    {/* STATION A: INDUSTRIAL PANEL */}
                    <div className="flex-1 bg-zinc-950 border-2 border-zinc-800 rounded-sm p-8 relative overflow-hidden flex flex-col shadow-2xl">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <FaMobileAlt className="text-[30rem]" />
                        </div>

                        <div className="flex justify-between items-center border-b border-zinc-800/50 pb-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>
                                <span className="text-lg font-black text-blue-400 tracking-[.5em] uppercase">Station_Alpha // SMKHP</span>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-2 w-8 bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-2/3 animate-pulse"></div>
                                </div>
                                <span className="text-xs text-zinc-500 font-bold uppercase">Signal_Stable</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center relative">
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)]"></div>
                            <span className="text-[24rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_60px_rgba(59,130,246,0.3)] z-10">
                                {processingSMKHP ? formatQueue("SMKHP", processingSMKHP.queueNo) : "---"}
                            </span>
                            <div className="w-full max-w-3xl bg-zinc-900/90 border border-zinc-700/50 p-6 mt-4 backdrop-blur-xl rounded-sm z-10 shadow-2xl">
                                <p className="text-xs text-zinc-500 uppercase mb-2 font-black tracking-widest border-l-2 border-orange-500 pl-3">Authorized_Registrant</p>
                                <h2 className="text-6xl font-black text-white truncate uppercase italic tracking-tighter">
                                    {processingSMKHP?.userName || "SYSTEM_WAITING_FOR_DATA..."}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* STATION B & C: SUB PANELS */}
                    <div className="h-56 grid grid-cols-2 gap-6">
                        {[
                            { label: 'BRAVO', data: processingLAB, config: CONFIG.Laboratorium, id: 'LAB' },
                            { label: 'CHARLIE', data: processingCS, config: CONFIG["Customer Service"], id: 'CS' }
                        ].map((station, i) => (
                            <div key={i} className="bg-zinc-900/40 border-2 border-zinc-800 rounded-sm p-6 relative flex flex-col justify-between group overflow-hidden">
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${i === 0 ? 'bg-purple-600 shadow-[2px_0_15px_rgba(147,51,234,0.4)]' : 'bg-emerald-600 shadow-[2px_0_15px_rgba(5,150,105,0.4)]'}`}></div>
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-black tracking-[.4em] uppercase ${i === 0 ? 'text-purple-400' : 'text-emerald-400'}`}>
                                        Station_{station.label} // {station.id}
                                    </span>
                                    <div className="text-2xl text-zinc-700">{station.config.icon}</div>
                                </div>
                                <div className="text-8xl font-black text-white tracking-tighter leading-none">
                                    {station.data ? formatQueue(station.id === 'LAB' ? "Laboratorium" : "Customer Service", station.data.queueNo) : "---"}
                                </div>
                                <div className="text-xs font-bold text-zinc-500 truncate uppercase border-t border-zinc-800/50 pt-4 flex justify-between">
                                    <span className="max-w-[80%] truncate">{station.data?.userName || "STANDBY_MODE"}</span>
                                    <span className="opacity-30">V.04</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT: DATA FEED --- */}
                <div className="col-span-4 flex flex-col bg-zinc-950 border-2 border-zinc-800 rounded-sm overflow-hidden shadow-2xl">
                    <div className="bg-zinc-900 p-5 border-b border-zinc-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-black tracking-[.3em] uppercase italic text-white">Next_Protocol</span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-6 h-1 bg-orange-600"></div>
                            <div className="w-3 h-1 bg-zinc-700"></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-size-[30px_30px]">
                        {latestFeed.length > 0 ? latestFeed.map((item, idx) => (
                            <div key={idx} className={`p-4 rounded-sm border-l-4 transition-all duration-500 ${item.subStatus === 'Dipanggil'
                                    ? 'bg-orange-600 border-white shadow-[0_0_30px_rgba(234,88,12,0.4)] animate-pulse scale-[1.02]'
                                    : 'bg-zinc-900/80 border-zinc-700 hover:bg-zinc-800'
                                }`}>
                                <div className="flex justify-between items-end">
                                    <div className={`text-5xl font-black tracking-tighter leading-none ${item.subStatus === 'Dipanggil' ? 'text-white' :
                                            item.type === 'SMKHP' ? 'text-blue-400' :
                                                item.type === 'Laboratorium' ? 'text-purple-400' : 'text-emerald-400'
                                        }`}>
                                        {formatQueue(item.type, item.queueNo)}
                                    </div>
                                    <span className={`text-[10px] font-black px-2 py-0.5 border-2 ${item.subStatus === 'Dipanggil' ? 'border-white text-white' : 'border-zinc-700 text-zinc-600'}`}>
                                        {item.subStatus?.toUpperCase()}
                                    </span>
                                </div>
                                <div className={`mt-3 text-sm font-bold uppercase truncate border-t border-black/10 pt-2 ${item.subStatus === 'Dipanggil' ? 'text-white' : 'text-zinc-400'
                                    }`}>
                                    {item.userName}
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-700 gap-4 opacity-20">
                                <FaMicrochip className="text-6xl" />
                                <p className="font-black uppercase tracking-widest italic">No_Data_Stream</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- INDUSTRIAL FOOTER MARQUEE --- */}
            <footer className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t-4 border-orange-600 py-3 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,1)] z-50">
                <div className="flex whitespace-nowrap animate-marquee font-black text-sm uppercase tracking-[.5em] text-orange-500/90">
                    <span className="mx-20">[ ALERT ] HARAP PERIKSA KEMBALI KELENGKAPAN DOKUMEN FISIK ANDA SEBELUM NOMOR DIPANGGIL</span>
                    <span className="mx-20">[ STATUS ] ALL SYSTEMS OPERATIONAL // CORE_DB: CONNECTED // LATENCY: 12ms</span>
                    <span className="mx-20 text-zinc-600">[ ESC ] TO EXIT FULLSCREEN MODE</span>
                    <span className="mx-20 text-zinc-500">TIMESTAMP: {new Date().toISOString()}</span>
                </div>
            </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
                @keyframes marquee { 0% { transform: translateX(100vw); } 100% { transform: translateX(-100%); } }
                .animate-marquee { animation: marquee 40s linear infinite; }
                :fullscreen { background-color: #050608; }
            `}</style>
        </div>
    );
}