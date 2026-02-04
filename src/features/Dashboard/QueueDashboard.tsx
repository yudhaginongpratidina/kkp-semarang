import { useEffect, useState } from "react"
import { FaMobileAlt, FaFlask, FaHeadset, FaClock } from "react-icons/fa"
import { useQueueStore, useAuthStore, useModalStore } from "../../stores"

import SMKHPQueueDetail from "./SMKHPQueueDetail"
import LabQueueDetail from "./LabQueueDetail"
import CustomerServiceQueueDetail from "./CustomerServiceQueueDetail"

/* ================= TYPE ================= */
type StatusFilter = "all" | "menunggu" | "diproses"

/* ================= COMPONENT ================= */
export default function QueueDashboard() {
    const [tabActive, setTabActive] = useState("smkhp")
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

    const {
        smkhp,
        laboratorium,
        customer_service,
        getSMKHP,
        getLaboratorium,
        getCustomerService
    } = useQueueStore()
    const { user } = useAuthStore()

    /* ================= FETCH REALTIME ================= */
    useEffect(() => {
        const unsub1 = getSMKHP()
        const unsub2 = getLaboratorium()
        const unsub3 = getCustomerService()

        return () => {
            unsub1()
            unsub2()
            unsub3()
        }
    }, [])

    /* ================= HELPER ================= */
    const filterByStatus = <T extends { subStatus: string }>(data: T[]) => {
        if (statusFilter === "all") return data
        return data.filter(
            i => i.subStatus.toLowerCase() === statusFilter
        )
    }

    const countByStatus = (data: any[]) => ({
        total: data.length,
        menunggu: data.filter(i => i.subStatus?.toLowerCase() === "menunggu").length,
        diproses: data.filter(i => i.subStatus?.toLowerCase() === "diproses").length
    })

    const activeData =
        tabActive === "smkhp"
            ? smkhp
            : tabActive === "laboratorium"
                ? laboratorium
                : customer_service

    const stat = countByStatus(activeData)

    return (
        <div className="w-full p-4 space-y-6 font-mono">
            {/* Dashboard Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(user.role === "superuser" || user.role === "operator") && (
                    <TriggerButton
                        id="smkhp"
                        title="SMKHP Unit"
                        count={smkhp.length}
                        activeTab={tabActive}
                        onClick={() => setTabActive("smkhp")}
                        variant="blue"
                        icon={<FaMobileAlt />}
                    />
                )}
                {(user.role === "superuser" || user.role === "laboratorium") && (
                    <TriggerButton
                        id="laboratorium"
                        title="Lab Analyst"
                        count={laboratorium.length}
                        activeTab={tabActive}
                        onClick={() => setTabActive("laboratorium")}
                        variant="purple"
                        icon={<FaFlask />}
                    />
                )}
                {(user.role === "superuser" || user.role === "customer_service") && (
                    <TriggerButton
                        id="customer_service"
                        title="Front Desk"
                        count={customer_service.length}
                        activeTab={tabActive}
                        onClick={() => setTabActive("customer_service")}
                        variant="emerald"
                        icon={<FaHeadset />}
                    />
                )}
            </div>

            {/* Main Monitoring Section */}
            <div className="bg-white border border-slate-300 shadow-sm rounded-sm overflow-hidden">
                <div className="bg-slate-800 px-4 py-3 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaClock className="text-slate-400 animate-pulse" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em]">Queue Monitoring System</h2>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Total Registry: {stat.total}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="p-2 border-b border-slate-200 bg-slate-50 flex gap-1 overflow-x-auto">
                    <FilterButton label="ALL UNITS" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} total={stat.total} />
                    <FilterButton label="WAITING" active={statusFilter === "menunggu"} onClick={() => setStatusFilter("menunggu")} total={stat.menunggu} />
                    <FilterButton label="PROCESSING" active={statusFilter === "diproses"} onClick={() => setStatusFilter("diproses")} total={stat.diproses} />
                </div>

                {/* Queue List Grid */}
                <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-3 max-h-[calc(100vh-320px)] overflow-y-auto bg-slate-100/50">
                    {filterByStatus(activeData).length > 0 ? (
                        filterByStatus(activeData).map(item => (
                            <ItemQueue
                                key={item.token}
                                {...item} // Spread props jika key-nya cocok
                                queue={item.queueNo}
                                name={item.userName}
                                phone={item.nomorHp}
                                service_type={item.type}
                                status={item.subStatus}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-sm">
                            <span className="text-[10px] font-bold uppercase tracking-widest">No Active Data in This Sector</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const FilterButton = ({ label, active, onClick, total }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-[10px] font-black tracking-widest transition-all
        ${active ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-200 border border-transparent"}`}
    >
        {label} <span className="opacity-50">[{total}]</span>
    </button>
);


const TriggerButton = ({ id, title, icon, count, onClick, activeTab, variant }: any) => {
    const isActive = activeTab === id;
    const variants: any = {
        blue: "border-blue-500 text-blue-600",
        purple: "border-purple-500 text-purple-600",
        emerald: "border-emerald-500 text-emerald-600",
    };

    return (
        <button
            onClick={onClick}
            className={`relative p-4 border-2 rounded-sm text-left transition-all duration-200 bg-white group
                ${isActive ? `${variants[variant]} shadow-md  z-10` : "border-slate-200 grayscale opacity-70 hover:grayscale-0 hover:opacity-100"}
            `}
        >
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-sm ${isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {icon}
                </div>
                <span className={`text-2xl font-black tracking-tighter ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {count.toString().padStart(2, '0')}
                </span>
            </div>
            <div className="mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Sector</p>
                <h3 className="text-sm font-black uppercase text-slate-800">{title}</h3>
            </div>
            {isActive && <div className="absolute bottom-0 left-0 h-1 w-full bg-current" />}
        </button>
    );
};

import { useQueueCaller } from "../../stores"

const ItemQueue = ({ token, queue, name, phone, service_type, status }: any) => {
    const { callQueue } = useQueueCaller();
    const { open } = useModalStore();
    const { updateSMKHPStatus, updateLaboratoriumStatus, updateCustomerServiceStatus, getLaboratorium, getSMKHP, getCustomerService } = useQueueStore();

    // Helper Styles
    const config: any = {
        smkhp: { icon: <FaMobileAlt />, color: "bg-blue-600", prefix: "A" },
        laboratorium: { icon: <FaFlask />, color: "bg-purple-600", prefix: "B" },
        "customer service": { icon: <FaHeadset />, color: "bg-emerald-600", prefix: "C" },
    };
    const current = config[service_type.toLowerCase()] || { icon: null, color: "bg-slate-600", prefix: "Z" };

    const handleAction = async () => {
        callQueue(name, queue, service_type);

        if (status.toLowerCase() === 'menunggu') {
            if (service_type === 'Laboratorium') await updateLaboratoriumStatus(token, "Diproses");
            if (service_type === 'SMKHP') await updateSMKHPStatus(token, "Diproses");
            if (service_type === 'Customer Service') await updateCustomerServiceStatus(token, "Diproses");
            getLaboratorium(); getSMKHP(); getCustomerService();
        } else {
            // Open Modal based on type
            const content = service_type === 'SMKHP' ? <SMKHPQueueDetail token={token} /> :
                service_type === 'Laboratorium' ? <LabQueueDetail token={token} /> :
                    <CustomerServiceQueueDetail token={token} />;
            open({ title: `OPERATIONAL_DETAIL: ${token.substring(0, 8)}`, content, size: "lg" });
        }
    };

    return (
        <div className="bg-white border border-slate-200 p-3 flex items-center justify-between hover:border-slate-400 transition-all shadow-xs relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${current.color}`} />

            <div className="flex items-center gap-4 min-w-0">
                <div className="flex flex-col items-center justify-center bg-slate-100 border border-slate-200 w-16 h-16 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 leading-none">REF</span>
                    <span className="text-lg font-black text-slate-800 tracking-tighter">
                        {current.prefix}{queue.toString().padStart(3, '0')}
                    </span>
                </div>

                <div className="min-w-0">
                    <h4 className="text-xs font-black uppercase text-slate-800 truncate tracking-tight">{name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase mb-2">{phone}</p>
                    <div className="flex gap-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 text-white uppercase ${current.color}`}>
                            {service_type}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 border uppercase ${status.toLowerCase() === 'diproses' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleAction}
                className={`ml-4 px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all
                    ${status.toLowerCase() === 'menunggu'
                        ? 'bg-slate-800 border-slate-800 text-white hover:bg-black'
                        : 'border-slate-200 text-slate-400 hover:border-slate-800 hover:text-slate-800'}
                `}
            >
                {status.toLowerCase() === 'menunggu' ? 'START_PROSES' : 'VIEW_DATA'}
            </button>
        </div>
    );
};