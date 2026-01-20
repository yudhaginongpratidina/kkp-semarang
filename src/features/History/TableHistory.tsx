import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaSearch, FaUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useHistoryStore } from "../../stores";

export default function TableHistory() {
    const { users, getAllUsers, loadingUser } = useHistoryStore();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    // Filter berdasarkan Nama atau Nomor HP
    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.nama?.toLowerCase().includes(search.toLowerCase()) ||
            u.nomorHp?.includes(search) ||
            u.npwp?.includes(search)
        );
    }, [users, search]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Reset ke halaman 1 saat search berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers untuk ditampilkan
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="p-4 mx-auto bg-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <p className="text-slate-500 text-sm">Total {filteredUsers.length} pengguna terdaftar</p>
                <div className="relative w-full md:w-80">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama, NPWP, atau HP..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">Pengguna</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider">NPWP</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm uppercase tracking-wider text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loadingUser ? (
                                <tr>
                                    <td colSpan={3} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-slate-400 font-medium">Memuat data pengguna...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map(user => (
                                    <tr key={user.uid} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <FaUserCircle className="text-2xl" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800">{user.nama}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{user.nomorHp}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-1 rounded-sm">
                                                {user.npwp || "Tidak ada NPWP"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link
                                                to={`/history/${user.uid}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm text-sm"
                                            >
                                                <FaEye /> Detail Riwayat
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-20 text-center text-slate-400 italic">
                                        {search ? `Tidak ada pengguna ditemukan dengan kata kunci "${search}"` : "Tidak ada data pengguna"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loadingUser && filteredUsers.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 bg-slate-50">
                        <div className="text-sm text-slate-600">
                            Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredUsers.length)}</span> dari <span className="font-semibold">{filteredUsers.length}</span> pengguna
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaChevronLeft />
                            </button>

                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((page, index) => (
                                    page === '...' ? (
                                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-400">...</span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-2 rounded-sm text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-sm border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}