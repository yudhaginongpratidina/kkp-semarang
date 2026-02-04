import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiPlus, FiDatabase } from "react-icons/fi";
import TraderForm from "./TraderForm";
import { useTraderStore, useModalStore } from "../../stores";
import { type Trader } from "../../stores/useTraderStore";

export default function TraderTable() {
    const { traders, getTraders, deleteTrader, isLoading } = useTraderStore();
    const { open } = useModalStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<keyof Pick<Trader, "nama_trader" | "kode_trader" | "npwp">>("nama_trader");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const unsubscribe = getTraders();
        return () => unsubscribe();
    }, [getTraders]);

    const filteredData = useMemo(() => {
        return traders.filter((item) => {
            const value = item[filterType]?.toLowerCase() || "";
            return value.includes(searchTerm.toLowerCase());
        });
    }, [traders, searchTerm, filterType]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = useMemo(() => {
        const lastIndex = currentPage * itemsPerPage;
        const firstIndex = lastIndex - itemsPerPage;
        return filteredData.slice(firstIndex, lastIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    return (
        <div className="w-full p-6 font-mono bg-[#E2E8F0] min-h-screen">
            <div className=" mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-4 border-slate-900 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                            <FiDatabase className="animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase">Storage_Unit // Traders</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">
                            Trader_Registry
                        </h1>
                    </div>

                    <button
                        onClick={() => open({ title: "ADD_TRADER", content: <TraderForm type="create" />, size: "lg" })}
                        className="bg-blue-600 text-white px-6 py-3 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 font-black text-xs uppercase"
                    >
                        <FiPlus strokeWidth={3} /> Register_New_Entity
                    </button>
                </div>

                {/* 2. SEARCH & FILTER BAR (Command Center) */}
                <div className="bg-slate-800 p-2 border-2 border-slate-900 flex flex-col md:flex-row gap-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                    <div className="bg-slate-900 border border-slate-700 flex items-center px-3 gap-3 flex-1">
                        <FiSearch className="text-slate-500" />
                        <input
                            type="text"
                            placeholder={`SEARCH_BY_${filterType.toUpperCase()}...`}
                            className="bg-transparent w-full py-3 text-xs text-blue-400 outline-none placeholder:text-slate-600 font-bold uppercase"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        className="bg-slate-900 text-slate-300 border border-slate-700 px-4 py-3 text-[10px] font-black uppercase outline-none focus:text-blue-400 cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                    >
                        <option value="nama_trader">Filter: Name</option>
                        <option value="kode_trader">Filter: Code</option>
                        <option value="npwp">Filter: NPWP</option>
                    </select>
                </div>

                {/* 3. THE DATA TABLE */}
                <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-left border-r border-slate-700">Ref_Code</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-left border-r border-slate-700">Entity_Name</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-left border-r border-slate-700">NPWP_ID</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-left border-r border-slate-700">Address_Loc</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-center">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-slate-100">
                            {isLoading && traders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <span className="text-xs font-black uppercase animate-pulse text-slate-400">Synchronizing_Data...</span>
                                    </td>
                                </tr>
                            ) : currentItems.map((trader) => (
                                <tr key={trader.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="p-4 font-black text-xs text-blue-600 border-r border-slate-100">{trader.kode_trader}</td>
                                    <td className="p-4 font-black text-xs uppercase text-slate-800 border-r border-slate-100">{trader.nama_trader}</td>
                                    <td className="p-4 text-xs font-bold text-slate-500 border-r border-slate-100 tracking-tighter">{trader.npwp}</td>
                                    <td className="p-4 text-xs text-slate-800 max-w-xs truncate border-r border-slate-100 italic">
                                        {trader.alamat_trader}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                onClick={() => open({ title: "EDIT_ENTITY", content: <TraderForm id={trader.id} type="update" />, size: "lg" })}
                                                className="text-slate-400 hover:text-blue-600 transition-colors"
                                                title="EDIT_DATA"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteTrader(trader.id)}
                                                className="text-slate-300 hover:text-red-600 transition-colors"
                                                title="TERMINATE_RECORD"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. PAGINATION CONTROL */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-4 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <div className="text-[10px] font-black text-slate-500 uppercase">
                        Page <span className="text-blue-500">{currentPage}</span> // Total <span className="text-white">{totalPages || 1}</span>
                    </div>

                    <div className="flex gap-0.5 mt-4 md:mt-0">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="bg-slate-800 text-white p-3 border border-slate-700 disabled:opacity-20 hover:bg-blue-600 transition-all"
                        >
                            <FiChevronLeft strokeWidth={3} />
                        </button>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="bg-slate-800 text-white p-3 border border-slate-700 disabled:opacity-20 hover:bg-blue-600 transition-all"
                        >
                            <FiChevronRight strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}