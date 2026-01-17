import { useEffect, useState } from "react"
import {
    FaEye,
    FaCheck,
    FaMobileAlt,
    FaFlask,
    FaHeadset,
    FaClock
} from "react-icons/fa"
import { HiUsers } from "react-icons/hi"
import { useQueueStore, useAuthStore } from "../../stores"

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

    /* ================= FETCH ================= */
    useEffect(() => {
        getSMKHP()
        getLaboratorium()
        getCustomerService()
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

    /* ================= UI ================= */
    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ================= LEFT ================= */}
                <div className="bg-white rounded-sm border shadow-sm">
                    <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
                        <HiUsers />
                        <h2 className="font-semibold">ANTRIAN AKTIF</h2>
                    </div>

                    <div className="p-4 space-y-3">
                        {(user.role === "superuser" || user.role === "operator") && (
                            <TriggerButton
                                id="smkhp"
                                title="SMKHP"
                                count={smkhp.length}
                                activeTab={tabActive}
                                onClick={() => setTabActive("smkhp")}
                                color="blue"
                                icon={<FaMobileAlt />}
                            />
                        )}

                        {(user.role === "superuser" || user.role === "laboratorium") && (
                            <TriggerButton
                                id="laboratorium"
                                title="Laboratorium"
                                count={laboratorium.length}
                                activeTab={tabActive}
                                onClick={() => setTabActive("laboratorium")}
                                color="purple"
                                icon={<FaFlask />}
                            />
                        )}

                        {(user.role === "superuser" || user.role === "customer_service") && (
                            <TriggerButton
                                id="customer_service"
                                title="Customer Service"
                                count={customer_service.length}
                                activeTab={tabActive}
                                onClick={() => setTabActive("customer_service")}
                                color="green"
                                icon={<FaHeadset />}
                            />
                        )}
                    </div>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="lg:col-span-2 bg-white rounded-sm border shadow-sm">
                    <div className="bg-slate-700 p-4 text-white flex items-center gap-2">
                        <FaClock />
                        <h2 className="font-semibold">DAFTAR ANTRIAN</h2>
                    </div>

                    {/* FILTER */}
                    <div className="flex gap-2 p-4 flex-wrap">
                        <FilterButton
                            label="Semua"
                            active={statusFilter === "all"}
                            onClick={() => setStatusFilter("all")}
                            total={stat.total}
                        />
                        <FilterButton
                            label="Menunggu"
                            active={statusFilter === "menunggu"}
                            onClick={() => setStatusFilter("menunggu")}
                            total={stat.menunggu}
                        />
                        <FilterButton
                            label="Diproses"
                            active={statusFilter === "diproses"}
                            onClick={() => setStatusFilter("diproses")}
                            total={stat.diproses}
                        />
                    </div>

                    {/* LIST */}
                    <div className="p-4 space-y-3 max-h-125 overflow-y-auto">
                        {filterByStatus(activeData).map(item => (
                            <ItemQueue
                                key={item.token}
                                queue={item.queueNo}
                                name={item.userName}
                                phone={item.nomorHp}
                                service_type={item.type}
                                status={item.subStatus}
                                time=""
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const FilterButton = ({ label, active, onClick, total }: any) => (
    <button
        onClick={onClick}
        className={`px-4 py-1.5 rounded text-sm font-semibold border
        ${active
                ? "bg-slate-700 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"}`}
    >
        {label}
        <span className="ml-2 text-xs font-bold">({total})</span>
    </button>
)


const TriggerButton = ({
    id,
    title,
    icon,
    count,
    onClick,
    activeTab,
    color
}: {
    id: string,
    title: string,
    icon: React.ReactNode,
    count: number,
    onClick?: () => void,
    activeTab: string,
    color: 'blue' | 'purple' | 'green'
}) => {
    const isActive = activeTab === id;

    const colorClasses = {
        blue: {
            active: 'bg-blue-50 border-blue-300 shadow-sm',
            hover: 'hover:bg-blue-50 hover:border-blue-200',
            badge: 'bg-blue-500',
            icon: 'text-blue-600'
        },
        purple: {
            active: 'bg-purple-50 border-purple-300 shadow-sm',
            hover: 'hover:bg-purple-50 hover:border-purple-200',
            badge: 'bg-purple-500',
            icon: 'text-purple-600'
        },
        green: {
            active: 'bg-green-50 border-green-300 shadow-sm',
            hover: 'hover:bg-green-50 hover:border-green-200',
            badge: 'bg-green-500',
            icon: 'text-green-600'
        }
    };

    const colors = colorClasses[color];

    return (
        <button
            id={id}
            type="button"
            onClick={onClick}
            className={`w-full p-4 flex justify-between items-center border rounded-sm transition-all duration-200 ${isActive
                ? colors.active
                : `border-slate-200 bg-white ${colors.hover}`
                }`}
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-sm ${isActive ? colors.icon : 'text-slate-400'} ${isActive ? 'bg-white' : 'bg-slate-100'}`}>
                    {icon}
                </div>
                <h3 className={`font-semibold text-sm ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                    {title}
                </h3>
            </div>
            <div className={`px-3 py-1.5 rounded-sm ${colors.badge} text-white font-bold text-sm min-w-10 text-center`}>
                {count}
            </div>
        </button>
    )
}

const ItemQueue = ({
    queue,
    name,
    phone,
    service_type,
    status,
    time
}: {
    queue: number
    name: string
    phone: string
    service_type: string
    status: string
    time: string
}) => {
    const getServiceStyle = (type: string) => {
        const lowerType = type.toLowerCase();
        if (lowerType.includes('smkhp') || lowerType.includes('hp') || lowerType.includes('mobile')) {
            return {
                icon: <FaMobileAlt className="w-3.5 h-3.5" />,
                bgColor: 'bg-blue-500',
                textColor: 'text-white',
                avatarBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
                avatarText: 'text-blue-700'
            };
        } else if (lowerType.includes('lab') || lowerType.includes('laboratorium')) {
            return {
                icon: <FaFlask className="w-3.5 h-3.5" />,
                bgColor: 'bg-purple-500',
                textColor: 'text-white',
                avatarBg: 'bg-gradient-to-br from-purple-100 to-purple-200',
                avatarText: 'text-purple-700'
            };
        } else if (lowerType.includes('cs') || lowerType.includes('customer') || lowerType.includes('support')) {
            return {
                icon: <FaHeadset className="w-3.5 h-3.5" />,
                bgColor: 'bg-green-500',
                textColor: 'text-white',
                avatarBg: 'bg-gradient-to-br from-green-100 to-green-200',
                avatarText: 'text-green-700'
            };
        }
        return {
            icon: null,
            bgColor: 'bg-slate-900',
            textColor: 'text-white',
            avatarBg: 'bg-gradient-to-br from-slate-100 to-slate-200',
            avatarText: 'text-slate-700'
        };
    };

    const serviceStyle = getServiceStyle(service_type);

    const getStatusStyle = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('aktif') || lowerStatus.includes('active')) {
            return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
        } else if (lowerStatus.includes('pending') || lowerStatus.includes('menunggu')) {
            return 'bg-amber-100 text-amber-700 border border-amber-200';
        } else if (lowerStatus.includes('done') || lowerStatus.includes('selesai')) {
            return 'bg-green-100 text-green-700 border border-green-200';
        }
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    };

    const formatQueueNumber = (queue: number, type: string) => {
        let prefix = "A";

        const lower = type.toLowerCase();

        if (lower.includes("laboratorium") || lower.includes("lab")) { prefix = "B"; }
        else if (lower.includes("customer") || lower.includes("cs")) { prefix = "C"; }

        const padded = queue.toString().padStart(3, "0");

        return `#${prefix}${padded}`;
    };

    return (
        <div className="group relative bg-white border-2 border-slate-200 rounded-sm hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-blue-500 to-blue-600" />
            <div className="flex justify-between items-center gap-4 p-4 pl-5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-sm shrink-0 flex justify-center items-center font-bold text-lg ${serviceStyle.avatarBg} ${serviceStyle.avatarText} shadow-sm`}>
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 bg-slate-700 text-white rounded text-xs font-bold">
                                {formatQueueNumber(queue, service_type)}
                            </span>
                            <span className="text-sm font-bold text-slate-800 truncate">{name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="truncate">{phone}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                                <FaClock className="w-3 h-3" />
                                {time}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold flex items-center gap-1.5 ${serviceStyle.bgColor} ${serviceStyle.textColor} shadow-sm`}>
                                {serviceStyle.icon}
                                {service_type}
                            </span>
                            <span className={`px-2.5 py-1 rounded-sm text-xs font-semibold ${getStatusStyle(status)}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        className="w-10 h-10 rounded-sm flex justify-center items-center bg-slate-100 text-slate-600 hover:bg-slate-200 hover:scale-105 transition-all duration-200 shadow-sm"
                        title="Lihat Detail"
                    >
                        <FaEye className="w-4 h-4" />
                    </button>
                    <button
                        className="w-10 h-10 rounded-sm flex justify-center items-center bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-sm"
                        title="Selesaikan"
                    >
                        <FaCheck className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}