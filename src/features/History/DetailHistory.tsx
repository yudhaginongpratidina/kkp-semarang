import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    MdPerson, MdLocationOn, MdFingerprint, MdArrowBack, MdFilterList, MdAssignment, MdScience, MdSupportAgent
} from "react-icons/md";
import { FaEye, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
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

    // Filter histories
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
                <Link to="/history" className="inline-flex items-center gap-2 text-blue-600 mb-6 hover:underline font-medium">
                    <MdArrowBack /> Kembali ke Daftar User
                </Link>

                {!selectedHistory ? (
                    <>
                        {/* PROFIL USER */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-200 mb-6">
                            <h2 className="text-xl font-bold mb-4 text-slate-800">Informasi Pengguna</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem icon={<MdPerson className="text-blue-500" />} label="Nama" value={user?.nama} />
                                <InfoItem icon={<MdFingerprint className="text-red-500" />} label="NPWP" value={user?.npwp} />
                                <div className="md:col-span-2 border-t pt-3 mt-1">
                                    <InfoItem icon={<MdLocationOn className="text-green-500" />} label="Alamat Trader" value={user?.alamatTrader} />
                                </div>
                            </div>
                        </div>

                        {/* FILTER SECTION */}
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-slate-200 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <MdFilterList className="text-slate-600 text-xl" />
                                <h3 className="font-semibold text-slate-700">Filter Riwayat</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FilterSelect label="Tipe Layanan" value={filterType} onChange={setFilterType} options={uniqueTypes} />
                                <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={uniqueStatuses} />
                            </div>
                        </div>

                        {/* TABEL RIWAYAT */}
                        <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-slate-700">Riwayat Layanan</h3>
                                    <p className="text-xs text-slate-500">Total {filteredHistories.length} data ditemukan</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                                        <tr>
                                            <th className="p-4 font-semibold">Tanggal & Waktu</th>
                                            <th className="p-4 font-semibold">Layanan</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 text-center font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentHistories.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 text-sm text-slate-600">
                                                    {formatTanggalLengkap(h.timestamp)}
                                                </td>
                                                <td className="p-4 font-medium text-slate-700 text-sm">
                                                    {h.type}
                                                </td>
                                                <td className="p-4 text-xs font-bold">
                                                    <span className={h.subStatus === "Selesai" ? "text-green-600" : "text-blue-600"}>
                                                        {h.subStatus}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => setSelectedHistory(h)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                                        <FaEye size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* Pagination (Simplified) */}
                            {totalPages > 1 && (
                                <div className="p-4 bg-slate-50 border-t flex justify-center gap-2">
                                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 disabled:opacity-30"><FaChevronLeft/></button>
                                    <span className="text-sm self-center">Hal {currentPage} dari {totalPages}</span>
                                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 disabled:opacity-30"><FaChevronRight/></button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* TAMPILAN DETAIL DINAMIS */
                    <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden mb-10">
                        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
                            <div>
                                <button onClick={() => setSelectedHistory(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-2 transition-colors">
                                    <MdArrowBack /> Kembali ke Riwayat
                                </button>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    {selectedHistory.type === "Customer Service" && <MdSupportAgent />}
                                    {selectedHistory.type === "Laboratorium" && <MdScience />}
                                    {selectedHistory.type === "SMKHP" && <MdAssignment />}
                                    Detail {selectedHistory.type}
                                </h2>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 uppercase tracking-widest">Token</p>
                                <p className="font-mono font-bold text-lg">{selectedHistory.token}</p>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Kolom 1: Status & Waktu */}
                            <div className="space-y-6">
                                <DetailRow label="Status Layanan" value={selectedHistory.subStatus} isStatus />
                                <DetailRow label="Tanggal Transaksi" value={formatTanggalLengkap(selectedHistory.timestamp)} />
                                <DetailRow label="Nomor Antrian" value={selectedHistory.queueNo} />
                            </div>

                            {/* Kolom 2: Detail Spesifik Layanan (Berdasarkan data anda) */}
                            <div className="space-y-6 md:border-x md:px-8 border-slate-100">
                                <h3 className="text-xs font-black text-blue-600 uppercase tracking-tighter">Informasi Detail</h3>
                                
                                {selectedHistory.type === "Customer Service" && (
                                    <>
                                        <DetailRow label="Keluhan" value={selectedHistory.details?.keluhan} />
                                        <DetailRow label="Jam Janji" value={selectedHistory.details?.jam} />
                                    </>
                                )}

                                {selectedHistory.type === "Laboratorium" && (
                                    <>
                                        <DetailRow label="Jenis Komoditas" value={selectedHistory.details?.jenis} />
                                        <DetailRow label="Nomor UPI" value={selectedHistory.details?.upi} />
                                        <DetailRow label="WhatsApp" value={selectedHistory.details?.wa} />
                                    </>
                                )}

                                {selectedHistory.type === "SMKHP" && (
                                    <>
                                        <DetailRow label="Nomor Aju" value={selectedHistory.details?.noAju} />
                                        <DetailRow label="Jam Input" value={selectedHistory.details?.jam} />
                                        <DetailRow label="Tanggal Target" value={selectedHistory.details?.tanggal} />
                                    </>
                                )}
                            </div>

                            {/* Kolom 3: Feedback & Deadline */}
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Rating Pelanggan</p>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={i < (selectedHistory.rating || 0) ? "text-yellow-400" : "text-slate-200"} />
                                        ))}
                                        <span className="ml-2 font-bold text-slate-700">{selectedHistory.rating || 0}/5</span>
                                    </div>
                                </div>
                                <DetailRow label="Komentar" value={selectedHistory.comment || "Tidak ada komentar"} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-komponen pendukung
function InfoItem({ icon, label, value }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="text-xl mt-1">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-slate-700 font-semibold">{value || "-"}</p>
            </div>
        </div>
    );
}

function DetailRow({ label, value, isStatus }: any) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`font-medium ${isStatus ? 'text-blue-600 font-bold' : 'text-slate-800'}`}>
                {value || "-"}
            </p>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: any) {
    return (
        <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm outline-none focus:border-blue-500 transition-colors"
            >
                <option value="all">Semua {label}</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}