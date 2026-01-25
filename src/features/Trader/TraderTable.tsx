import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { useTraderStore } from "../../stores";
import { type Trader } from "../../stores/useTraderStore";

export default function TraderTable() {
    const { traders, getTraders, deleteTrader, updateTrader, isLoading } = useTraderStore();
    
    // State untuk Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<keyof Pick<Trader, "nama_trader" | "kode_trader" | "npwp">>("nama_trader");
    
    // State untuk Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // State untuk Modal Edit
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);
    
    // 1. Inisialisasi Data Realtime
    useEffect(() => {
        const unsubscribe = getTraders();
        return () => unsubscribe();
    }, [getTraders]);
    
    // 2. Logika Filter (useMemo untuk performa)
    const filteredData = useMemo(() => {
        return traders.filter((item) => {
            const value = item[filterType]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        });
    }, [traders, searchTerm, filterType]);
    
    // 3. Logika Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = useMemo(() => {
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredData.slice(firstIndex, lastIndex);
    }, [filteredData, currentPage, itemsPerPage]);
    
    // 4. Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
            await deleteTrader(id);
        }
    };
    
    const handleEditOpen = (trader: Trader) => {
        setSelectedTrader({ ...trader });
        setIsEditModalOpen(true);
    };
    
    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTrader) {
            await updateTrader(selectedTrader.id, selectedTrader);
            setIsEditModalOpen(false);
        }
    };
    
    return (
        <div className="w-full p-4">
            <div className=" bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                {/* Filter Section */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={`Cari ${filterType.replace("_", " ")}...`}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm outline-none transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <select
                        className="px-4 py-2.5 border border-gray-300 rounded-sm bg-white text-sm outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="nama_trader">Nama Trader</option>
                        <option value="kode_trader">Kode Trader</option>
                        <option value="npwp">NPWP</option>
                    </select>
                    <button className="p-4 py-2.5 border border-gray-300 rounded-sm">
                        Tambah
                    </button>
                </div>
                
                {/* Table Section */}
                <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-linear-to-r from-gray-50 to-gray-100 text-gray-700 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="p-4 font-semibold border-b border-gray-200">Kode</th>
                                <th className="p-4 font-semibold border-b border-gray-200">Nama Trader</th>
                                <th className="p-4 font-semibold border-b border-gray-200">NPWP</th>
                                <th className="p-4 font-semibold border-b border-gray-200">Alamat</th>
                                <th className="p-4 font-semibold text-center border-b border-gray-200">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            {isLoading && traders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((trader) => (
                                    <tr key={trader.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4 font-mono text-blue-600 font-semibold">{trader.kode_trader}</td>
                                        <td className="p-4 font-semibold text-gray-800 uppercase">{trader.nama_trader}</td>
                                        <td className="p-4 text-gray-600">{trader.npwp}</td>
                                        <td className="p-4 text-gray-500 max-w-xs truncate" title={trader.alamat_trader}>
                                            {trader.alamat_trader}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditOpen(trader)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-sm text-xs font-medium hover:bg-amber-200 transition-colors"
                                                >
                                                    <FiEdit2 size={14} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(trader.id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-sm text-xs font-medium hover:bg-red-200 transition-colors"
                                                >
                                                    <FiTrash2 size={14} />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                                        Data tidak ditemukan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Section */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-600">
                        Halaman <span className="font-bold text-gray-800">{currentPage}</span> dari{" "}
                        <span className="font-bold text-gray-800">{totalPages || 1}</span>
                    </p>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <FiChevronLeft size={16} />
                            Prev
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-sm text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Next
                            <FiChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* MODAL EDIT */}
            {isEditModalOpen && selectedTrader && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-sm shadow-2xl w-full max-w-lg overflow-hidden">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800">Perbarui Data Trader</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FiX size={22} />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                                        Kode Trader
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                        value={selectedTrader.kode_trader}
                                        onChange={(e) => setSelectedTrader({ ...selectedTrader, kode_trader: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                                        NPWP
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={selectedTrader.npwp}
                                        onChange={(e) => setSelectedTrader({ ...selectedTrader, npwp: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                                    Nama Trader
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={selectedTrader.nama_trader}
                                    onChange={(e) => setSelectedTrader({ ...selectedTrader, nama_trader: e.target.value })}
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">
                                    Alamat Lengkap
                                </label>
                                <textarea
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    value={selectedTrader.alamat_trader}
                                    onChange={(e) => setSelectedTrader({ ...selectedTrader, alamat_trader: e.target.value })}
                                />
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-sm transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-sm hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}