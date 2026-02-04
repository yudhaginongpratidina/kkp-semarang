// libraries
import { useEffect, useMemo } from "react"
import { FaUsers, FaClock, FaSpinner, FaChartLine, FaExclamationTriangle } from "react-icons/fa"
import { useQueueStore, useAuthStore } from "../../stores"

export default function StatisticsDashboard() {
    const {
        smkhp, laboratorium, customer_service,
        isLoading, error, getSMKHP, getLaboratorium, getCustomerService
    } = useQueueStore()
    const { user } = useAuthStore()

    useEffect(() => {
        const role = user.role;
        if (role === "superuser" || role === "operator") getSMKHP();
        if (role === "superuser" || role === "laboratorium") getLaboratorium();
        if (role === "superuser" || role === "customer_service") getCustomerService();
    }, [user.role, getSMKHP, getLaboratorium, getCustomerService]);

    const stats = useMemo(() => {
        const process = (data: any[]) => ({
            total: data.length,
            menunggu: data.filter(d => d.subStatus?.toLowerCase() === "menunggu").length,
            diproses: data.filter(d => d.subStatus?.toLowerCase() === "diproses").length
        });

        return {
            smkhp: process(smkhp),
            lab: process(laboratorium),
            cs: process(customer_service)
        };
    }, [smkhp, laboratorium, customer_service]);

    if (isLoading) return <LoadingState />;

    return (
        <div className="p-4 space-y-6 font-mono animate-in fade-in duration-500">
            {/* System Status Header */}
            <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">System Analytics</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Data Stream Active</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[9px] font-black text-emerald-700 uppercase">Live Feed</span>
                </div>
            </div>

            {error && <ErrorState message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Logic Penampilan Berdasarkan Role */}
                {(user.role === "superuser" || user.role === "operator") && (
                    <InstrumentCard title="SMKHP Unit" data={stats.smkhp} variant="blue" />
                )}
                {(user.role === "superuser" || user.role === "laboratorium") && (
                    <InstrumentCard title="Laboratory" data={stats.lab} variant="purple" />
                )}
                {(user.role === "superuser" || user.role === "customer_service") && (
                    <InstrumentCard title="Service Desk" data={stats.cs} variant="emerald" />
                )}
            </div>
        </div>
    )
}

/* ================= COMPONENT: INSTRUMENT CARD ================= */
function InstrumentCard({ title, data, variant }: { title: string, data: any, variant: 'blue' | 'purple' | 'emerald' }) {
    const theme = {
        blue: "border-t-blue-600 text-blue-600",
        purple: "border-t-purple-600 text-purple-600",
        emerald: "border-t-emerald-600 text-emerald-600",
    }[variant];

    return (
        <div className={`bg-white border border-slate-300 border-t-4 ${theme} p-5 shadow-sm relative overflow-hidden group`}>
            {/* Background Decoration */}
            <FaChartLine className="absolute -bottom-4 -right-4 text-slate-50 text-6xl opacity-50 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{title}</h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-xs">UNIT_{title.substring(0,3).toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Main Metric */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{data.total}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Total Active Registry</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-200 text-slate-400">
                            <FaUsers className="text-xl" />
                        </div>
                    </div>

                    {/* Sub Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 border border-slate-200 p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <FaClock className="text-[10px] text-amber-500" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Waiting</span>
                            </div>
                            <p className="text-xl font-black text-slate-800 tracking-tighter">{data.menunggu}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <FaSpinner className="text-[10px] text-blue-500 animate-spin" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Process</span>
                            </div>
                            <p className="text-xl font-black text-slate-800 tracking-tighter">{data.diproses}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-sm">
            <FaSpinner className="text-3xl text-slate-400 animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Synchronizing Data Modules...</p>
        </div>
    )
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 flex items-center gap-4">
            <FaExclamationTriangle className="text-red-500" />
            <div>
                <p className="text-[10px] font-black text-red-700 uppercase">System Error Detected</p>
                <p className="text-xs text-red-600">{message}</p>
            </div>
        </div>
    )
}