// icons
import { FaTicketSimple } from "react-icons/fa6";
import { MdOutlineMonitorHeart, MdSupportAgent } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { ImLab } from "react-icons/im";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function StatisticsDashboard() {
    return (
        <div className="w-full p-4 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <TotalQueue />
            <WaitingQueue />
            <ActiveQueue />
            <ComplateQueue />
        </div>
    )
}

const TotalQueue = () => {
    return (
        <div className="w-full p-4 flex flex-col gap-2 border rounded-sm border-slate-200 bg-white">
            <div className="flex items-center gap-4">
                <FaTicketSimple className="w-6 h-6" />
                <h1 className="text-lg uppercase font-semibold">total antrian</h1>
            </div>
            <div className="w-full h-0.5 bg-blue-500" />
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <IoMdDocument className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">SMKHP</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ImLab className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">LAB</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MdSupportAgent className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">CS</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
            </div>
        </div>
    )
}

const WaitingQueue = () => {
    return (
        <div className="w-full p-4 flex flex-col gap-2 border rounded-sm border-slate-200 bg-white">
            <div className="flex items-center gap-4">
                <AiOutlineLoading3Quarters className="w-6 h-6" />
                <h1 className="text-lg uppercase font-semibold">antrian menunggu</h1>
            </div>
            <div className="w-full h-0.5 bg-blue-500" />
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <IoMdDocument className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">SMKHP</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ImLab className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">LAB</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MdSupportAgent className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">CS</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
            </div>
        </div>
    )
}

const ActiveQueue = () => {
    return (
        <div className="w-full p-4 flex flex-col gap-2 border rounded-sm border-slate-200 bg-white">
            <div className="flex items-center gap-4">
                <MdOutlineMonitorHeart className="w-6 h-6" />
                <h1 className="text-lg uppercase font-semibold">antrian aktif</h1>
            </div>
            <div className="w-full h-0.5 bg-blue-500" />
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <IoMdDocument className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">SMKHP</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ImLab className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">LAB</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MdSupportAgent className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">CS</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
            </div>
        </div>
    )
}

const ComplateQueue = () => {
    return (
        <div className="w-full p-4 flex flex-col gap-2 border rounded-sm border-slate-200 bg-white">
            <div className="flex items-center gap-4">
                <IoCheckmarkDoneCircleSharp className="w-6 h-6" />
                <h1 className="text-lg uppercase font-semibold">antrian selesai</h1>
            </div>
            <div className="w-full h-0.5 bg-blue-500" />
            <div className="w-full flex flex-col gap-4">
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <IoMdDocument className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">SMKHP</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ImLab className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">LAB</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
                <div className="w-full flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MdSupportAgent className="w-6 h-6 text-slate-400" />
                        <h1 className="text-md font-semibold">CS</h1>
                    </div>
                    <h1 className="text-md font-semibold">10</h1>
                </div>
            </div>
        </div>
    )
}