import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaEye, FaAddressCard, FaSearch } from "react-icons/fa";
import { useHistoryStore } from "../../stores";

export default function TableHistory() {
    const { data, get_data } = useHistoryStore();

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        get_data();
    }, []);

    // 🔍 Filter data
    const filteredData = useMemo(() => {
        return data.filter((item) =>
            item.nama.toLowerCase().includes(search.toLowerCase()) ||
            item.npwp?.toLowerCase().includes(search.toLowerCase()) ||
            item.nomorHp?.includes(search)
        );
    }, [data, search]);

    // 📄 Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4">
            <div className="w-full">

                {/* SEARCH */}
                <div className="relative mb-6">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        placeholder="Cari nama, NPWP, atau nomor HP..."
                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-sm"
                    />
                </div>

                {/* TABLE */}
                <div className="bg-white border border-slate-50 rounded-sm overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="p-4 text-left">Informasi</th>
                                <th className="p-4 text-left">WhatsApp</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((item) => (
                                    <ItemData
                                        key={item.uid}
                                        id={item.uid}
                                        full_name={item.nama}
                                        npwp={item.npwp}
                                        phone={item.nomorHp}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center p-6 text-slate-500">
                                        Data tidak ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className="flex justify-between items-center p-4 border-t border-slate-50">
                        <p className="text-sm text-slate-600">
                            Menampilkan {startIndex + 1}–
                            {Math.min(startIndex + itemsPerPage, filteredData.length)} dari{" "}
                            {filteredData.length} data
                        </p>

                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "border"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


const ItemData = ({ id, full_name, npwp, phone }: { id: string, full_name: string, npwp: string, phone: string }) => {
    const initial = full_name.charAt(0).toUpperCase();
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
    const colorIndex = full_name.charCodeAt(0) % colors.length;

    return (
        <tr className="group border-b border-slate-100 hover:bg-slate-50 transition-all duration-200">
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex justify-center items-center rounded-sm ${colors[colorIndex]} text-white font-bold text-lg shadow-sm shrink-0`}>
                        {initial}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{full_name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <FaAddressCard className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{npwp || 'Belum punya npwp'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-sm hover:bg-green-100 transition-all duration-200 font-medium text-sm border border-green-200"
                >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>{phone}</span>
                </a>
            </td>
            <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                    <Link
                        to={`/history/${id}`}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-sm hover:bg-blue-100 transition-all duration-200 font-medium text-sm border border-blue-200 flex items-center gap-2 opacity-70 group-hover:opacity-100"
                        title="Lihat Detail"
                    >
                        <FaEye className="w-4 h-4" />
                        Detail
                    </Link>
                </div>
            </td>
        </tr>
    )
}