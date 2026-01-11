import { useState } from "react";
import { FaEye, FaCheck, FaMobileAlt, FaFlask, FaHeadset, FaClock } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";

export default function QueueDashboard() {
    const [tab_active, setTabActive] = useState<string>("smkhp");
    const handleChangeTab = (tab: string) => setTabActive(tab);

    return (
        <div className="w-full p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-linear-to-r from-blue-600 to-blue-500 p-4">
                        <div className="flex items-center gap-2 text-white">
                            <HiUsers className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">ANTRIAN AKTIF</h2>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <TriggerButton
                            id={"smkhp"}
                            title="SMKHP"
                            icon={<FaMobileAlt className="w-4 h-4" />}
                            count={10}
                            onClick={() => handleChangeTab("smkhp")}
                            activeTab={tab_active}
                            color="blue"
                        />
                        <TriggerButton
                            id={"laboratorium"}
                            title="Laboratorium"
                            icon={<FaFlask className="w-4 h-4" />}
                            count={10}
                            onClick={() => handleChangeTab("laboratorium")}
                            activeTab={tab_active}
                            color="purple"
                        />
                        <TriggerButton
                            id={"customer-service"}
                            title="Customer Service"
                            icon={<FaHeadset className="w-4 h-4" />}
                            count={10}
                            onClick={() => handleChangeTab("customer-service")}
                            activeTab={tab_active}
                            color="green"
                        />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-linear-to-r from-slate-700 to-slate-600 p-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <FaClock className="w-5 h-5" />
                            DAFTAR ANTRIAN
                        </h2>
                    </div>
                    <div className="p-4 space-y-3 max-h-150 overflow-y-auto">
                        {tab_active === "smkhp" && (
                            <>
                                <ItemQueue
                                    queue={1}
                                    name="Ahmad Santoso"
                                    phone="082-123-456-789"
                                    service_type="SMKHP"
                                    status="Aktif"
                                    time="10:30"
                                />
                                <ItemQueue
                                    queue={2}
                                    name="Siti Nurhaliza"
                                    phone="082-987-654-321"
                                    service_type="SMKHP"
                                    status="Menunggu"
                                    time="10:45"
                                />
                                <ItemQueue
                                    queue={3}
                                    name="Budi Prasetyo"
                                    phone="082-555-888-999"
                                    service_type="SMKHP"
                                    status="Menunggu"
                                    time="11:00"
                                />
                            </>
                        )}
                        {tab_active === "laboratorium" && (
                            <>
                                <ItemQueue
                                    queue={1}
                                    name="Dewi Lestari"
                                    phone="082-111-222-333"
                                    service_type="Laboratorium"
                                    status="Aktif"
                                    time="10:15"
                                />
                                <ItemQueue
                                    queue={2}
                                    name="Rudi Hermawan"
                                    phone="082-444-555-666"
                                    service_type="Laboratorium"
                                    status="Menunggu"
                                    time="10:30"
                                />
                            </>
                        )}
                        {tab_active === "customer-service" && (
                            <>
                                <ItemQueue
                                    queue={1}
                                    name="Linda Wijaya"
                                    phone="082-777-888-999"
                                    service_type="Customer Service"
                                    status="Aktif"
                                    time="09:45"
                                />
                                <ItemQueue
                                    queue={2}
                                    name="Andi Firmansyah"
                                    phone="082-321-654-987"
                                    service_type="Customer Service"
                                    status="Menunggu"
                                    time="10:00"
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

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
                                #{queue}
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