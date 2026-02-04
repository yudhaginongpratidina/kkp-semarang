import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    MdPerson,
    MdArrowBack,
    MdFilterList,
} from "react-icons/md";
import { FaEye, FaStar } from "react-icons/fa";
import useHistoryStore, { formatTanggalLengkap } from "../../stores/useHistoryStore";
import { useModalStore } from "../../stores";
import NoAjuForm from "./NoAjuForm";

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

const getRatingValue = (history: any): number => {
    // Cek field 'rating' sesuai struktur Firestore kamu
    if (history.rating && typeof history.rating === 'object') {
        return history.rating.stars || 0;
    }
    // Fallback jika menggunakan field 'comment'
    if (history.comment && typeof history.comment === 'object') {
        return history.comment.stars || 0;
    }
    return 0;
};

const getCommentText = (history: any): string => {
    const r = history.rating;
    if (r && typeof r === 'object' && r.feedback) return r.feedback;

    const c = history.comment;
    if (c && typeof c === 'object' && c.feedback) return c.feedback;

    return "NO_FEEDBACK_GIVEN";
};

// ===================================================================
// MAIN COMPONENT
// ===================================================================

export default function DetailHistory() {
    const { id } = useParams();
    const {
        user, histories, getUserById, getHistoryByUid,
        loadingUser, loadingHistory
    } = useHistoryStore();
    const { open } = useModalStore();
    const [selectedHistory, setSelectedHistory] = useState<any>(null);
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (id) {
            getUserById(id);
            getHistoryByUid(id);
        }
    }, [id, getUserById, getHistoryByUid]);

    const filteredHistories = useMemo(() => {
        return histories.filter(h => {
            const matchType = filterType === "all" || h.type === filterType;
            const matchStatus = filterStatus === "all" || h.subStatus === filterStatus;
            return matchType && matchStatus;
        });
    }, [histories, filterType, filterStatus]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentHistories = filteredHistories.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [filterType, filterStatus]);

    const uniqueTypes = useMemo(() => Array.from(new Set(histories.map(h => h.type))), [histories]);
    const uniqueStatuses = useMemo(() => Array.from(new Set(histories.map(h => h.subStatus))), [histories]);

    if (loadingUser || loadingHistory) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    </div>
                    <p className="text-slate-700 font-semibold text-lg">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E2E8F0] p-4 md:p-8 font-mono text-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className=" mx-auto z-10 relative">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b-2 border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-blue-600 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                Terminal // {selectedHistory ? `Entry_${selectedHistory.token}` : 'History_Log'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-800">
                            {selectedHistory ? "Detail_Layanan" : "Riwayat_Layanan"}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {selectedHistory ? (
                            <button onClick={() => setSelectedHistory(null)} className="flex items-center gap-2 px-4 py-2 border-2 border-slate-800 bg-white hover:bg-slate-100 font-black text-xs uppercase">
                                <MdArrowBack /> Exit_Detail
                            </button>
                        ) : (
                            <>
                                <Link to="/history" className="flex items-center gap-2 px-4 py-2 border-2 border-slate-800 bg-white hover:bg-slate-100 font-black text-xs uppercase">
                                    <MdArrowBack /> Back
                                </Link>
                                {(!user?.noAjuList || user?.noAjuList === "-") ? (
                                    <button
                                        onClick={() => open({ title: "Create", content: <NoAjuForm type="create" />, size: "lg" })}
                                        className="px-4 py-2 bg-slate-800 text-white border-2 border-slate-800 hover:bg-slate-700 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                    >
                                        [+] Add_Entry
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => open({ title: "Update", content: <NoAjuForm type="update" />, size: "lg" })}
                                        className="px-4 py-2 bg-slate-800 text-white border-2 border-slate-800 hover:bg-slate-700 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                    >
                                        [+] Update
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </header>

                {!selectedHistory ? (
                    /* VIEW: TABLE LIST */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
                        <aside className="lg:col-span-4 space-y-6">
                            <div className="bg-[#F1F5F9] border-2 border-slate-800 p-6 relative">
                                <div className="absolute top-0 right-0 p-2 text-[10px] font-black text-slate-400">
                                    USR_REF: {id?.slice(0, 8)}
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 bg-slate-800 flex items-center justify-center text-white border-2 border-slate-900">
                                        <MdPerson size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase leading-none">{user?.nama || "Unknown"}</h2>
                                        <p className="text-[10px] font-black text-blue-600 mt-1">NPWP: {user?.npwp}</p>
                                    </div>
                                </div>
                                <div className="border-t-2 border-slate-200 pt-4">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                                        Trader_Organization
                                    </label>
                                    <p className="text-xs font-black uppercase">{user?.namaTrader || "NO_TRADER_DATA"}</p>
                                </div>
                            </div>

                            <div className="bg-slate-800 p-6 text-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(30,41,59,0.2)]">
                                <h3 className="text-[10px] font-black mb-6 flex items-center gap-2 uppercase tracking-[0.2em] text-blue-400">
                                    <MdFilterList /> Filter_Parameters
                                </h3>
                                <div className="space-y-6">
                                    <FilterSelect label="Process_Type" value={filterType} onChange={setFilterType} options={uniqueTypes} />
                                    <FilterSelect label="Stream_Status" value={filterStatus} onChange={setFilterStatus} options={uniqueStatuses} />
                                </div>
                            </div>
                        </aside>

                        <section className="lg:col-span-8">
                            <div className="bg-white border-2 border-slate-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                                <div className="p-4 bg-slate-100 border-b-2 border-slate-800 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live_Data_Stream</span>
                                    <span className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase">
                                        {filteredHistories.length} Entries_Found
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50 border-b-2 border-slate-200">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase">Timestamp</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase">Process_Node</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase">Status</th>
                                                <th className="px-6 py-4 text-center text-[10px] font-black uppercase">Execute</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y border-slate-200">
                                            {currentHistories.map((h) => (
                                                <tr key={h.id} className="hover:bg-blue-50/50 transition-colors group">
                                                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                                                        {formatTanggalLengkap(h.timestamp)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-black uppercase text-xs">{h.type}</div>
                                                        <div className="text-[9px] text-blue-600 font-bold"># {h.token}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 border-2 text-[9px] font-black uppercase ${h.subStatus === "Selesai"
                                                            ? "border-green-600 text-green-600 bg-green-50"
                                                            : "border-blue-600 text-blue-600 bg-blue-50"
                                                            }`}>
                                                            {h.subStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => setSelectedHistory(h)}
                                                            className="p-2 border-2 border-transparent hover:border-slate-800 transition-all"
                                                        >
                                                            <FaEye size={14} className="text-slate-800" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    /* VIEW: INDUSTRIAL DETAIL */
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white border-2 border-slate-800 p-8 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                                    <div className="absolute top-0 right-0 bg-slate-800 text-white px-6 py-2 font-black text-xl">
                                        {selectedHistory.token}
                                    </div>
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-8">
                                        {selectedHistory.type}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
                                        <div className="bg-white p-6">
                                            <DetailItem label="Status_Report" value={selectedHistory.subStatus} isStatus />
                                        </div>
                                        <div className="bg-white p-6">
                                            <DetailItem label="Process_Time" value={formatTanggalLengkap(selectedHistory.timestamp)} />
                                        </div>
                                        <div className="bg-white p-6">
                                            <DetailItem label="Assigned_Officer" value={selectedHistory.officer?.nama_petugas} />
                                        </div>
                                        <div className="bg-white p-6">
                                            <DetailItem label="Protocol_Type" value={selectedHistory.type} />
                                        </div>
                                    </div>
                                    <div className="mt-8 p-6 bg-slate-50 border-l-4 border-slate-800">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                                            Officer_Notes:
                                        </label>
                                        <p className="text-sm font-bold italic text-slate-700 leading-relaxed">
                                            "{selectedHistory.officer?.catatan || "NO_RECORDS_FOUND"}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-amber-400 border-2 border-slate-800 p-8 text-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 border-b border-slate-900/20 pb-2">
                                        User_Feedback_Metric
                                    </h4>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="text-6xl font-black italic">
                                                {getRatingValue(selectedHistory)}
                                            </span>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar
                                                        key={i}
                                                        className={i < getRatingValue(selectedHistory) ? "text-slate-900" : "text-slate-900/20"}
                                                        size={16}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold uppercase leading-tight bg-white/30 p-4 border border-slate-900/10">
                                        "{getCommentText(selectedHistory)}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ==========================================================================
   HELPER COMPONENTS
   ========================================================================== */

function DetailItem({ label, value, isStatus }: { label: string; value: any; isStatus?: boolean }) {
    const displayValue = useMemo(() => {
        if (value === null || value === undefined) return "-";
        if (typeof value === "object") {
            // Jika itu objek, coba ambil string yang masuk akal atau stringify
            return value.nama_petugas || value.feedback || "DATA_COMPLEX";
        }
        return String(value);
    }, [value]);

    return (
        <div className="flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {label}
            </p>
            <p className={`text-[13px] font-bold uppercase tracking-tight ${isStatus
                ? 'text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-200 inline-block rounded-xs'
                : 'text-slate-800'
                }`}>
                {displayValue}
            </p>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-1.5 group">
            <label className="text-[10px] font-black text-slate-100 uppercase tracking-[0.3em] flex items-center gap-2">
                <MdFilterList className="text-slate-100" />
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none border-2 border-slate-200 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white outline-none focus:border-slate-900 transition-all cursor-pointer"
                >
                    <option value="all">SELECT_ALL_{label.replace(' ', '_').toUpperCase()}</option>
                    {options.map((opt: string) => (
                        <option key={opt} value={opt} className="font-mono">
                            {opt.toUpperCase()}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-[5px] border-t-white"></div>
                </div>
            </div>
        </div>
    );
}