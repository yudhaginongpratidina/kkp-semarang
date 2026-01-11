import { FaTicketAlt } from "react-icons/fa";
import { MdOutlineMonitorHeart, MdSupportAgent } from "react-icons/md";
import { IoMdDocument } from "react-icons/io";
import { ImLab } from "react-icons/im";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

export default function StatisticsDashboard() {
    return (
        <div className="bg-linear-to-br from-slate-50 to-slate-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                <TotalQueue role="super" />
                <WaitingQueue role="super" />
                <ActiveQueue role="super" />
                <ComplateQueue role="super" />
            </div>
        </div>
    )
}

const TotalQueue = ({ role }: { role: string }) => {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:opacity-20 transition-opacity" />
            {role !== 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-sm">
                                <FaTicketAlt className="w-6 h-6 text-blue-600" />
                            </div>
                            <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Antrian</h1>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-blue-500 to-blue-300 rounded-sm mb-4" />
                    <div className="flex items-end justify-between">
                        <h1 className="text-5xl font-bold text-slate-800">10</h1>
                        <span className="text-sm text-green-600 font-medium">+12%</span>
                    </div>
                </div>
            )}
            {role === 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-sm">
                            <FaTicketAlt className="w-5 h-5 text-blue-600" />
                        </div>
                        <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total Antrian</h1>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-blue-500 to-blue-300 rounded-sm mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <IoMdDocument className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">SMKHP</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <ImLab className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-700">LAB</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <MdSupportAgent className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-slate-700">CS</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const WaitingQueue = ({ role }: { role: string }) => {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:opacity-20 transition-opacity" />
            {role !== 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-100 rounded-sm">
                                <AiOutlineLoading3Quarters className="w-6 h-6 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                            <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Menunggu</h1>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-amber-500 to-amber-300 rounded-sm mb-4" />
                    <div className="flex items-end justify-between">
                        <h1 className="text-5xl font-bold text-slate-800">10</h1>
                        <span className="text-sm text-amber-600 font-medium">Pending</span>
                    </div>
                </div>
            )}
            {role === 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 rounded-sm">
                            <AiOutlineLoading3Quarters className="w-5 h-5 text-amber-600" />
                        </div>
                        <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Menunggu</h1>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-amber-500 to-amber-300 rounded-sm mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <IoMdDocument className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">SMKHP</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <ImLab className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-700">LAB</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <MdSupportAgent className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-slate-700">CS</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const ActiveQueue = ({ role }: { role: string }) => {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:opacity-20 transition-opacity" />
            {role !== 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 rounded-sm">
                                <MdOutlineMonitorHeart className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Aktif</h1>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-emerald-500 to-emerald-300 rounded-sm mb-4" />
                    <div className="flex items-end justify-between">
                        <h1 className="text-5xl font-bold text-slate-800">10</h1>
                        <span className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Active
                        </span>
                    </div>
                </div>
            )}
            {role === 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-sm">
                            <MdOutlineMonitorHeart className="w-5 h-5 text-emerald-600" />
                        </div>
                        <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Aktif</h1>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-emerald-500 to-emerald-300 rounded-sm mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <IoMdDocument className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">SMKHP</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <ImLab className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-700">LAB</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <MdSupportAgent className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-slate-700">CS</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const ComplateQueue = ({ role }: { role: string }) => {
    return (
        <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:opacity-20 transition-opacity" />
            {role !== 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 rounded-sm">
                                <IoCheckmarkDoneCircleSharp className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Selesai</h1>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-indigo-500 to-indigo-300 rounded-sm mb-4" />
                    <div className="flex items-end justify-between">
                        <h1 className="text-5xl font-bold text-slate-800">10</h1>
                        <span className="text-sm text-indigo-600 font-medium">Completed</span>
                    </div>
                </div>
            )}
            {role === 'op-admin' && (
                <div className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-100 rounded-sm">
                            <IoCheckmarkDoneCircleSharp className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h1 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Antrian Selesai</h1>
                    </div>
                    <div className="w-full h-1 bg-linear-to-r from-indigo-500 to-indigo-300 rounded-sm mb-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <IoMdDocument className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">SMKHP</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <ImLab className="w-5 h-5 text-purple-500" />
                                <span className="text-sm font-medium text-slate-700">LAB</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-2">
                                <MdSupportAgent className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-slate-700">CS</span>
                            </div>
                            <span className="text-lg font-bold text-slate-800">10</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}