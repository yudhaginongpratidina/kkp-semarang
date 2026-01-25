import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    MdPerson,
    MdLocationOn,
    MdFingerprint,
    MdArrowBack,
    MdFilterList,
    MdAssignment,
    MdScience,
    MdSupportAgent,
    MdPhone,
    MdCalendarToday,
    MdAccessTime,
    MdDescription,
    MdBadge,
    MdNotes
} from "react-icons/md";
import {
    FaEye,
    FaChevronLeft,
    FaChevronRight,
    FaStar,
    FaAddressCard,
    FaRegStar
} from "react-icons/fa";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { BiMessageSquareDetail } from "react-icons/bi";
import { AiOutlineFileText } from "react-icons/ai";
import { BsCheckCircleFill, BsClockHistory } from "react-icons/bs";
import useHistoryStore, { formatTanggalLengkap } from "../../stores/useHistoryStore";
import { useModalStore } from "../../stores";
import NoAjuForm from "./NoAjuForm";

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

    const totalPages = Math.ceil(filteredHistories.length / itemsPerPage);
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
        <div className="bg-linear-to-br from-slate-50 to-slate-100">
            <div className="w-full p-6">
                {/* BACK BUTTON */}
                <Link
                    to="/history"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold transition-all hover:gap-3 group"
                >
                    <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                    <span>Kembali ke Daftar User</span>
                </Link>

                {!selectedHistory ? (
                    <>
                        {/* SECTION 1: PROFIL USER - Enhanced Card */}
                        <div className="bg-white rounded-sm shadow-lg border border-slate-200 mb-8 overflow-hidden">
                            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                                            <div className="bg-white/20 p-2 rounded-sm">
                                                <MdPerson className="text-white text-2xl" />
                                            </div>
                                            Informasi Pengguna
                                        </h2>
                                        <p className="text-blue-100 text-sm">Data lengkap pengguna terdaftar</p>
                                    </div>
                                    {(!user?.noAju || user?.noAju === "-") ? (
                                        <button
                                            type="button"
                                            onClick={() => open({
                                                title: "Create",
                                                content: <NoAjuForm type="create" />,
                                                size: "lg",
                                            })}
                                            className="px-5 py-2.5 rounded-sm flex items-center gap-2 bg-white text-blue-600 text-sm font-bold hover:shadow-lg transition-all transform hover:scale-105"
                                        >
                                            <FaAddressCard /> TAMBAH NO AJU
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => open({
                                                title: "Update",
                                                content: <NoAjuForm type="update" />,
                                                size: "lg",
                                            })}
                                            className="px-5 py-2.5 rounded-sm flex items-center gap-2 bg-white text-blue-600 text-sm font-bold hover:shadow-lg transition-all transform hover:scale-105"
                                        >
                                            <FaAddressCard /> UPDATE NO AJU
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <InfoCard
                                        icon={<MdPerson className="text-blue-600 text-2xl" />}
                                        label="Nama Lengkap"
                                        value={user?.nama}
                                        bgColor="bg-blue-50"
                                    />
                                    <InfoCard
                                        icon={<MdFingerprint className="text-red-600 text-2xl" />}
                                        label="NPWP"
                                        value={user?.npwp}
                                        bgColor="bg-red-50"
                                    />
                                </div>

                                <div className="border-t border-slate-200 pt-6">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <HiBuildingOffice2 className="text-green-600" />
                                        Informasi Trader
                                    </h3>
                                    {(!user?.namaTrader || user?.namaTrader === "-") ? (
                                        <div className="flex items-center gap-3 text-sm bg-amber-50 border-l-4 border-amber-400 rounded-sm p-4">
                                            <BiMessageSquareDetail className="text-amber-500 text-xl shrink-0" />
                                            <span className="text-amber-800">Pengguna belum terdaftar sebagai trader</span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoCard
                                                icon={<HiBuildingOffice2 className="text-green-600 text-2xl" />}
                                                label="Nama Trader"
                                                value={user?.namaTrader}
                                                bgColor="bg-green-50"
                                            />
                                            <InfoCard
                                                icon={<MdLocationOn className="text-green-600 text-2xl" />}
                                                label="Alamat Trader"
                                                value={user?.alamatTrader}
                                                bgColor="bg-green-50"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: FILTER - Enhanced */}
                        <div className="bg-white rounded-sm shadow-lg border border-slate-200 mb-8 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 p-2 rounded-sm">
                                    <MdFilterList className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Filter Riwayat</h3>
                                    <p className="text-xs text-slate-500">Saring data berdasarkan kategori</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FilterSelect label="Tipe Layanan" value={filterType} onChange={setFilterType} options={uniqueTypes} />
                                <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={uniqueStatuses} />
                            </div>
                        </div>

                        {/* SECTION 3: TABEL RIWAYAT - Enhanced */}
                        <div className="bg-white rounded-sm shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-linear-to-r from-slate-700 to-slate-800 p-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-white text-xl flex items-center gap-3">
                                            <BsClockHistory className="text-blue-400" />
                                            Riwayat Layanan
                                        </h3>
                                        <p className="text-slate-300 text-sm mt-1">
                                            Total <span className="font-bold text-blue-400">{filteredHistories.length}</span> transaksi ditemukan
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b-2 border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <MdCalendarToday />
                                                    Waktu Daftar
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <AiOutlineFileText />
                                                    Layanan
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <BsCheckCircleFill />
                                                    Status
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {currentHistories.length > 0 ? currentHistories.map((h) => (
                                            <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-sm text-slate-700">
                                                        <MdAccessTime className="text-slate-400" />
                                                        {formatTanggalLengkap(h.timestamp)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                                            {h.type === "Customer Service" && <MdSupportAgent className="text-blue-500" />}
                                                            {h.type === "Laboratorium" && <MdScience className="text-green-500" />}
                                                            {h.type === "SMKHP" && <MdAssignment className="text-amber-500" />}
                                                            {h.type}
                                                        </p>
                                                        <p className="text-xs font-mono text-slate-400 mt-1">Token: {h.token}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${h.subStatus === "Selesai"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}>
                                                        {h.subStatus === "Selesai" && <BsCheckCircleFill />}
                                                        {h.subStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setSelectedHistory(h)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-sm hover:bg-blue-100 transition-all font-semibold text-sm"
                                                    >
                                                        <FaEye />
                                                        Detail
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <BiMessageSquareDetail className="text-slate-300 text-5xl" />
                                                        <p className="text-slate-400 font-medium">Data tidak ditemukan</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-slate-50 border-t px-6 py-4 flex justify-center items-center gap-4">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="p-2.5 border-2 border-slate-300 bg-white rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 hover:border-blue-500 transition-all"
                                    >
                                        <FaChevronLeft className="text-slate-600" />
                                    </button>
                                    <span className="text-sm font-semibold text-slate-700 px-4">
                                        Halaman {currentPage} dari {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="p-2.5 border-2 border-slate-300 bg-white rounded-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 hover:border-blue-500 transition-all"
                                    >
                                        <FaChevronRight className="text-slate-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white rounded-sm shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-linear-to-r from-slate-800 to-slate-900 p-8">
                                <button
                                    onClick={() => setSelectedHistory(null)}
                                    className="flex items-center gap-2 text-slate-300 hover:text-white text-sm mb-6 transition-all font-semibold group"
                                >
                                    <MdArrowBack className="group-hover:-translate-x-1 transition-transform" />
                                    Kembali ke Riwayat
                                </button>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-4 rounded-sm ${selectedHistory.type === "Customer Service" ? "bg-blue-500" :
                                                selectedHistory.type === "Laboratorium" ? "bg-green-500" : "bg-amber-500"
                                            }`}>
                                            {selectedHistory.type === "Customer Service" && <MdSupportAgent className="text-white text-3xl" />}
                                            {selectedHistory.type === "Laboratorium" && <MdScience className="text-white text-3xl" />}
                                            {selectedHistory.type === "SMKHP" && <MdAssignment className="text-white text-3xl" />}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-1">
                                                DETAIL {selectedHistory.type.toUpperCase()}
                                            </h2>
                                            <p className="text-slate-300">Informasi lengkap layanan</p>
                                        </div>
                                    </div>
                                    <div className="text-right bg-white/10 px-6 py-4 rounded-sm backdrop-blur-sm">
                                        <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">Token Antrian</p>
                                        <p className="font-mono font-bold text-3xl text-blue-400">{selectedHistory.token}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Status & Waktu */}
                                    <div className="bg-slate-50 rounded-sm p-6 border border-slate-200">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2 pb-3 border-b-2 border-slate-300">
                                            <BsClockHistory className="text-blue-600" />
                                            Informasi Umum
                                        </h4>
                                        <div className="space-y-5">
                                            <DetailItem
                                                icon={<BsCheckCircleFill className="text-green-600" />}
                                                label="Status Saat Ini"
                                                value={selectedHistory.subStatus}
                                                isStatus
                                            />
                                            <DetailItem
                                                icon={<MdCalendarToday className="text-blue-600" />}
                                                label="Waktu Pendaftaran"
                                                value={formatTanggalLengkap(selectedHistory.timestamp)}
                                            />
                                            <DetailItem
                                                icon={<MdDescription className="text-slate-600" />}
                                                label="Nomor Antrian"
                                                value={selectedHistory.queueNo}
                                            />
                                        </div>
                                    </div>

                                    {/* Data Spesifik */}
                                    <div className="bg-blue-50 rounded-sm p-6 border border-blue-200">
                                        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-6 flex items-center gap-2 pb-3 border-b-2 border-blue-300">
                                            <AiOutlineFileText className="text-lg" />
                                            Detail Layanan
                                        </h4>
                                        <div className="space-y-5">
                                            {selectedHistory.type === "Customer Service" && (
                                                <>
                                                    <DetailItem
                                                        icon={<BiMessageSquareDetail className="text-blue-600" />}
                                                        label="Keluhan Utama"
                                                        value={selectedHistory.details?.keluhan}
                                                    />
                                                    <DetailItem
                                                        icon={<MdAccessTime className="text-blue-600" />}
                                                        label="Estimasi Jam"
                                                        value={selectedHistory.details?.jam}
                                                    />
                                                </>
                                            )}
                                            {selectedHistory.type === "Laboratorium" && (
                                                <>
                                                    <DetailItem
                                                        icon={<MdScience className="text-green-600" />}
                                                        label="Komoditas"
                                                        value={selectedHistory.details?.jenis}
                                                    />
                                                    <DetailItem
                                                        icon={<MdDescription className="text-green-600" />}
                                                        label="No. UPI"
                                                        value={selectedHistory.details?.upi}
                                                    />
                                                    <DetailItem
                                                        icon={<MdPhone className="text-green-600" />}
                                                        label="WhatsApp Aktif"
                                                        value={selectedHistory.details?.wa}
                                                    />
                                                </>
                                            )}
                                            {selectedHistory.type === "SMKHP" && (
                                                <>
                                                    <DetailItem
                                                        icon={<MdDescription className="text-amber-600" />}
                                                        label="Nomor AJU"
                                                        value={selectedHistory.details?.noAju}
                                                    />
                                                    <DetailItem
                                                        icon={<MdAccessTime className="text-amber-600" />}
                                                        label="Jam Janji"
                                                        value={selectedHistory.details?.jam}
                                                    />
                                                    <DetailItem
                                                        icon={<MdCalendarToday className="text-amber-600" />}
                                                        label="Target Selesai"
                                                        value={selectedHistory.details?.tanggal}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Feedback */}
                                    <div className="bg-amber-50 rounded-sm p-6 border border-amber-200">
                                        <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-6 flex items-center gap-2 pb-3 border-b-2 border-amber-300">
                                            <FaStar className="text-lg" />
                                            Kepuasan Pelanggan
                                        </h4>
                                        <div className="space-y-5">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rating Layanan</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            i < (selectedHistory.rating || 0) ? (
                                                                <FaStar key={i} className="text-amber-400 text-xl" />
                                                            ) : (
                                                                <FaRegStar key={i} className="text-slate-300 text-xl" />
                                                            )
                                                        ))}
                                                    </div>
                                                    <span className="ml-2 font-bold text-2xl text-slate-800">{selectedHistory.rating || 0}<span className="text-slate-400 text-lg">/5</span></span>
                                                </div>
                                            </div>
                                            <DetailItem
                                                icon={<BiMessageSquareDetail className="text-amber-600" />}
                                                label="Komentar / Feedback"
                                                value={selectedHistory.comment || "Tidak ada komentar"}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Catatan Petugas - Full Width */}
                                <div className="mt-8 bg-linear-to-r from-slate-50 to-slate-100 rounded-sm p-8 border-2 border-slate-200">
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-3">
                                        <div className="bg-slate-700 p-2 rounded-sm">
                                            <MdPerson className="text-white text-xl" />
                                        </div>
                                        Catatan Petugas
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <DetailItem
                                            icon={<MdBadge className="text-slate-600" />}
                                            label="Nama Petugas"
                                            value={selectedHistory.officer?.nama_petugas}
                                        />
                                        <DetailItem
                                            icon={<MdFingerprint className="text-slate-600" />}
                                            label="NIP"
                                            value={selectedHistory.officer?.nip_petugas}
                                        />
                                    </div>
                                    <div className="bg-white rounded-sm p-6 border-l-4 border-blue-600">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <MdNotes className="text-blue-600" />
                                            Catatan Internal / Solusi
                                        </p>
                                        <p className="text-base text-slate-700 leading-relaxed italic">
                                            "{selectedHistory.officer?.catatan || "Belum ada catatan dari petugas"}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Helper Components
function InfoCard({ icon, label, value, bgColor }: any) {
    return (
        <div className={`${bgColor} rounded-sm p-5 border-l-4 ${bgColor.includes('blue') ? 'border-blue-600' :
                bgColor.includes('red') ? 'border-red-600' : 'border-green-600'
            }`}>
            <div className="flex items-center gap-4">
                <div className="shrink-0">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-lg font-bold text-slate-800 truncate">{value || "-"}</p>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value, isStatus }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="shrink-0 mt-1">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
                <p className={`text-sm font-semibold leading-relaxed ${isStatus ? 'text-blue-600' : 'text-slate-800'
                    }`}>
                    {value || "-"}
                </p>
            </div>
        </div>
    );
}

function FilterSelect({ label, value, onChange, options }: any) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <MdFilterList className="text-blue-600" />
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-sm text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white hover:border-slate-300"
            >
                <option value="all">Semua {label}</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
}