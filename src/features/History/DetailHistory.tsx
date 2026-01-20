import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    MdPerson, MdLocationOn, MdFingerprint, MdArrowBack, 
    MdFilterList, MdAssignment, MdScience, MdSupportAgent 
} from "react-icons/md";
import { 
    FaEye, FaChevronLeft, FaChevronRight, FaStar, FaAddressCard 
} from "react-icons/fa";
import { HiBuildingOffice } from "react-icons/hi2";
import { FiAlertCircle } from "react-icons/fi";
import useHistoryStore, { formatTanggalLengkap } from "../../stores/useHistoryStore";

export default function DetailHistory() {
    const { id } = useParams();
    const {
        user, histories, getUserById, getHistoryByUid,
        loadingUser, loadingHistory
    } = useHistoryStore();

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

    // Filter histories logic
    const filteredHistories = useMemo(() => {
        return histories.filter(h => {
            const matchType = filterType === "all" || h.type === filterType;
            const matchStatus = filterStatus === "all" || h.subStatus === filterStatus;
            return matchType && matchStatus;
        });
    }, [histories, filterType, filterStatus]);

    // Pagination logic
    const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentHistories = filteredHistories.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [filterType, filterStatus]);

    const uniqueTypes = useMemo(() => Array.from(new Set(histories.map(h => h.type))), [histories]);
    const uniqueStatuses = useMemo(() => Array.from(new Set(histories.map(h => h.subStatus))), [histories]);

    if (loadingUser || loadingHistory) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 p-4 min-h-screen">
            <div className="w-full">
                {/* BACK BUTTON */}
                <Link to="/history" className="inline-flex items-center gap-2 text-blue-600 mb-6 hover:underline font-medium">
                    <MdArrowBack /> Kembali ke Daftar User
                </Link>

                {!selectedHistory ? (
                    <>
                        {/* SECTION 1: PROFIL USER */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 mb-6">
                            <div className="w-full flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    <MdPerson className="text-slate-400" /> Informasi Pengguna
                                </h2>
                                <div>
                                    {(!user?.noAju || user?.noAju === "-") && (
                                        <button
                                            type="button"
                                            onClick={() => console.log("Tambah No Aju")}
                                            className="px-4 h-9 rounded-sm flex justify-center items-center gap-2 bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-all shadow-sm"
                                        >
                                            <FaAddressCard /> TAMBAH NO AJU
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoItem 
                                    icon={<MdPerson className="text-blue-500" />} 
                                    label="Nama Lengkap" 
                                    value={user?.nama} 
                                />
                                <InfoItem 
                                    icon={<MdFingerprint className="text-red-500" />} 
                                    label="NPWP" 
                                    value={user?.npwp} 
                                />

                                <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                                    {(!user?.namaTrader || user?.namaTrader === "-") ? (
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-dashed rounded-sm p-3">
                                            <FiAlertCircle className="text-yellow-500 text-base" />
                                            <span>Pengguna belum terdaftar sebagai trader</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoItem 
                                                icon={<HiBuildingOffice className="text-green-600" />} 
                                                label="Nama Trader" 
                                                value={user?.namaTrader} 
                                            />
                                            <InfoItem 
                                                icon={<MdLocationOn className="text-green-600" />} 
                                                label="Alamat Trader" 
                                                value={user?.alamatTrader} 
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: FILTER */}
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 mb-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MdFilterList className="text-slate-600 text-xl" />
                                <h3 className="font-semibold text-slate-700">Filter Riwayat</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FilterSelect label="Tipe Layanan" value={filterType} onChange={setFilterType} options={uniqueTypes} />
                                <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={uniqueStatuses} />
                            </div>
                        </div>

                        {/* SECTION 3: TABEL RIWAYAT */}
                        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-700 text-sm">RIWAYAT LAYANAN</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total {filteredHistories.length} transaksi ditemukan</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b">
                                        <tr>
                                            <th className="p-4">Waktu Daftar</th>
                                            <th className="p-4">Layanan</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentHistories.length > 0 ? currentHistories.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 text-sm text-slate-600">
                                                    {formatTanggalLengkap(h.timestamp)}
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-bold text-slate-700 text-sm">{h.type}</p>
                                                    <p className="text-[10px] font-mono text-slate-400">Token: {h.token}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${
                                                        h.subStatus === "Selesai" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                        {h.subStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => setSelectedHistory(h)} 
                                                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <FaEye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="p-10 text-center text-slate-400 text-sm italic">Data tidak ditemukan</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="p-4 bg-slate-50 border-t flex justify-center items-center gap-4">
                                    <button 
                                        disabled={currentPage === 1} 
                                        onClick={() => setCurrentPage(prev => prev - 1)} 
                                        className="p-2 border bg-white rounded-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
                                    >
                                        <FaChevronLeft size={12}/>
                                    </button>
                                    <span className="text-xs font-medium text-slate-600">Halaman {currentPage} / {totalPages}</span>
                                    <button 
                                        disabled={currentPage === totalPages} 
                                        onClick={() => setCurrentPage(prev => prev + 1)} 
                                        className="p-2 border bg-white rounded-sm disabled:opacity-30 hover:bg-slate-50 transition-all"
                                    >
                                        <FaChevronRight size={12}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* SECTION 4: DETAIL DINAMIS */
                    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden mb-10">
                        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                            <div>
                                <button 
                                    onClick={() => setSelectedHistory(null)} 
                                    className="flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-3 transition-colors uppercase font-bold tracking-widest"
                                >
                                    <MdArrowBack /> Kembali ke Riwayat
                                </button>
                                <h2 className="text-xl font-bold flex items-center gap-3">
                                    {selectedHistory.type === "Customer Service" && <MdSupportAgent className="text-blue-400" />}
                                    {selectedHistory.type === "Laboratorium" && <MdScience className="text-green-400" />}
                                    {selectedHistory.type === "SMKHP" && <MdAssignment className="text-yellow-400" />}
                                    DETAIL {selectedHistory.type.toUpperCase()}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-1">Token Antrian</p>
                                <p className="font-mono font-bold text-2xl text-blue-400">{selectedHistory.token}</p>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                            {/* Status & Waktu */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2 tracking-widest">General Info</h4>
                                <DetailRow label="Status Saat Ini" value={selectedHistory.subStatus} isStatus />
                                <DetailRow label="Waktu Pendaftaran" value={formatTanggalLengkap(selectedHistory.timestamp)} />
                                <DetailRow label="Nomor Antrian" value={selectedHistory.queueNo} />
                            </div>

                            {/* Data Spesifik */}
                            <div className="space-y-6 md:border-x md:px-10 border-slate-100">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase border-b pb-2 tracking-widest">Detail Layanan</h4>

                                {selectedHistory.type === "Customer Service" && (
                                    <>
                                        <DetailRow label="Keluhan Utama" value={selectedHistory.details?.keluhan} />
                                        <DetailRow label="Estimasi Jam" value={selectedHistory.details?.jam} />
                                    </>
                                )}

                                {selectedHistory.type === "Laboratorium" && (
                                    <>
                                        <DetailRow label="Komoditas" value={selectedHistory.details?.jenis} />
                                        <DetailRow label="No. UPI" value={selectedHistory.details?.upi} />
                                        <DetailRow label="WhatsApp Aktif" value={selectedHistory.details?.wa} />
                                    </>
                                )}

                                {selectedHistory.type === "SMKHP" && (
                                    <>
                                        <DetailRow label="Nomor AJU" value={selectedHistory.details?.noAju} />
                                        <DetailRow label="Jam Janji" value={selectedHistory.details?.jam} />
                                        <DetailRow label="Target Selesai" value={selectedHistory.details?.tanggal} />
                                    </>
                                )}
                            </div>

                            {/* Feedback */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase border-b pb-2 tracking-widest">Kepuasan Pelanggan</h4>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Rating</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={18} className={i < (selectedHistory.rating || 0) ? "text-yellow-400" : "text-slate-200"} />
                                        ))}
                                        <span className="ml-2 font-bold text-slate-700">{selectedHistory.rating || 0}/5</span>
                                    </div>
                                </div>
                                <DetailRow label="Komentar / Feedback" value={selectedHistory.comment || "Tidak ada komentar"} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Components
function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-start gap-4 p-1">
            <div className="text-xl mt-1 p-2 bg-slate-50 rounded-sm">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-slate-700 font-bold leading-tight">{value || "-"}</p>
            </div>
        </div>
    );
}

function DetailRow({ label, value, isStatus }: any) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</p>
            <p className={`text-sm ${isStatus ? 'text-blue-600 font-black' : 'text-slate-800 font-semibold'}`}>
                {value || "-"}
            </p>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50"
            >
                <option value="all">Semua {label}</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}