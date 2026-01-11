// library
import { useState } from "react";

// icons
import { FaEye, FaCheck, FaMobileAlt, FaFlask, FaHeadset } from "react-icons/fa";

export default function QueueDashboard() {
    const [tab_active, setTabActive] = useState<string>("smkhp");
    const handleChangeTab = (tab: string) => setTabActive(tab);

    return (
        <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="w-full p-4 rounded-sm flex flex-col gap-4 bg-white">
                <h1 className="text-xl font-semibold">ANTRIAN AKTIF</h1>
                <TriggerButton
                    id={"smkhp"}
                    title="SMKHP"
                    count={10} onClick={() => handleChangeTab("smkhp")}
                    activeTab={tab_active}
                />
                <TriggerButton
                    id={"laboratorium"}
                    title="Laboratorium"
                    count={10}
                    onClick={() => handleChangeTab("laboratorium")}
                    activeTab={tab_active}
                />
                <TriggerButton
                    id={"customer-service"}
                    title="Customer Service"
                    count={10}
                    onClick={() => handleChangeTab("customer-service")}
                    activeTab={tab_active}
                />
            </div>
            <div className="w-full col-span-2 p-4 rounded-sm flex flex-col gap-4 bg-white">
                <h1 className="text-xl font-semibold">ANTRIAN AKTIF</h1>
                {tab_active === "smkhp" && (
                    <ItemQueue
                        queue={1}
                        name="Silent"
                        phone="082-xxx-xxx-xxx"
                        service_type="SMKHP"
                        status="Menunggu"
                    />
                )}

                {tab_active === "laboratorium" && (
                    <ItemQueue
                        queue={1}
                        name="Silent"
                        phone="082-xxx-xxx-xxx"
                        service_type="Laboratorium"
                        status="Menunggu"
                    />
                )}

                {tab_active === "customer-service" && (
                    <ItemQueue
                        queue={1}
                        name="Silent"
                        phone="082-xxx-xxx-xxx"
                        service_type="Customer Service"
                        status="Menunggu"
                    />
                )}
            </div>
        </div>
    )
}

const TriggerButton = ({ id, title, count, onClick, activeTab }: { id: string, title: string, count: number, onClick?: () => void, activeTab: string }) => {
    const isActive = activeTab === id

    return (
        <button id={id} type="button" onClick={onClick} className={`w-full h-14 px-2 flex justify-between items-center border rounded-sm hover:cursor-pointer border-slate-200 hover:bg-blue-50 ${isActive ? "bg-blue-100" : ""}`}>
            <h1 className="font-semibold text-md">{title}</h1>
            <h1 className="p-2.5 rounded-sm bg-blue-500 text-white">{count}</h1>
        </button>
    )
}

const ItemQueue = ({ queue, name, phone, service_type, status }: {
    queue: number
    name: string
    phone: string
    service_type: string
    status: string
}) => {
    const getServiceStyle = (type: string) => {
        const lowerType = type.toLowerCase()

        if (lowerType.includes('smkhp') || lowerType.includes('hp') || lowerType.includes('mobile')) {
            return {
                icon: <FaMobileAlt className="w-3.5 h-3.5" />,
                bgColor: 'bg-blue-500',
                textColor: 'text-white'
            }
        } else if (lowerType.includes('lab') || lowerType.includes('laboratorium')) {
            return {
                icon: <FaFlask className="w-3.5 h-3.5" />,
                bgColor: 'bg-purple-500',
                textColor: 'text-white'
            }
        } else if (lowerType.includes('cs') || lowerType.includes('customer') || lowerType.includes('support')) {
            return {
                icon: <FaHeadset className="w-3.5 h-3.5" />,
                bgColor: 'bg-green-500',
                textColor: 'text-white'
            }
        }

        return {
            icon: null,
            bgColor: 'bg-slate-900',
            textColor: 'text-white'
        }
    }

    const serviceStyle = getServiceStyle(service_type)

    return (
        <div className="group w-full h-20 flex justify-between items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-sm shrink-0 flex justify-center items-center font-bold text-lg bg-linear-to-br from-blue-100 to-blue-200 text-blue-600">
                    {name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">#{queue}</span>
                        <span className="text-sm font-semibold text-slate-700 truncate">{name}</span>
                    </div>
                    <span className="text-xs text-slate-400 truncate">{phone}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${serviceStyle.bgColor} ${serviceStyle.textColor}`}>
                            {serviceStyle.icon}
                            {service_type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium 
                            ${status === "pending" ? "bg-amber-100 text-amber-700" :
                                status === "done" ? "bg-green-100 text-green-700" :
                                    "bg-slate-100 text-slate-700"}`}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-9 h-9 rounded-sm flex justify-center items-center hover:cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                    <FaEye className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 rounded-sm flex justify-center items-center hover:cursor-pointer bg-green-100 text-green-600 hover:bg-green-200 transition">
                    <FaCheck className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}