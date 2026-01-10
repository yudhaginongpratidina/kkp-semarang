// icons
import { FaEye, FaCheck } from "react-icons/fa";

export default function QueueDashboard() {
    return (
        <div className="w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="w-full p-4 rounded-sm flex flex-col gap-4 bg-white">
                <h1 className="text-xl font-semibold">ANTRIAN AKTIF</h1>
                <TriggerButton title="SMKHP" count={10} />
                <TriggerButton title="Laboratorium" count={10} />
                <TriggerButton title="Customer Service" count={10} />
            </div>
            <div className="w-full col-span-2 p-4 rounded-sm flex flex-col gap-4 bg-white">
                <h1 className="text-xl font-semibold">ANTRIAN AKTIF</h1>
                <ItemQueue 
                    queue={1} 
                    name="Silent" 
                    phone="082-xxx-xxx-xxx" 
                    service_type="SMKHP" 
                    status="Menunggu"
                />
                <ItemQueue 
                    queue={2} 
                    name="Silent" 
                    phone="082-xxx-xxx-xxx" 
                    service_type="SMKHP" 
                    status="Menunggu"
                />
                <ItemQueue 
                    queue={3} 
                    name="Silent" 
                    phone="082-xxx-xxx-xxx" 
                    service_type="SMKHP" 
                    status="Menunggu"
                />
            </div>
        </div>
    )
}

const TriggerButton = ({ title, count }: { title: string, count: number }) => {
    return (
        <button className="w-full h-14 px-2 flex justify-between items-center border rounded-sm hover:cursor-pointer border-slate-200 hover:bg-blue-50">
            <h1 className="font-semibold text-md">{title}</h1>
            <h1 className="p-2.5 rounded-sm bg-blue-500 text-white">{count}</h1>
        </button>
    )
}

const ItemQueue = ({queue, name, phone, service_type, status}: {queue: number, name: string, phone: string, service_type: string, status: string}) => {
    return (
        <div className="w-full h-28 flex justify-between items-center gap-2 border p-2 pr-4 rounded-sm border-slate-200">
            {/* left - user info */}
            <div className="flex items-center gap-2">
                <div className="w-24 h-24 rounded-sm flex justify-center items-center font-semibold text-lg bg-blue-100 text-blue-500">
                    OV
                </div>
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-bold">#{queue}</h1>
                    <h1 className="text-md font-semibold">{name} | {phone}</h1>
                    <h1 className="flex items-center gap-1.5 text-sm">
                        <span className="py-0.5 px-4 rounded-sm bg-black text-white">{service_type}</span>
                        <span className="py-0.5 px-4 rounded-sm bg-amber-500 text-white">{status}</span>
                    </h1>
                </div>
            </div>
            {/* right - action */}
            <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-sm flex justify-center items-center bg-slate-200 text-slate-500">
                    <FaEye className="w-6 h-6" />
                </button>
                <button className="w-12 h-12 rounded-sm flex justify-center items-center bg-green-200 text-green-500">
                    <FaCheck className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}