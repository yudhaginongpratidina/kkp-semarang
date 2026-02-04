import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaSearch, FaUserCircle, FaChevronLeft, FaChevronRight, FaDatabase } from "react-icons/fa";
import { useHistoryStore } from "../../stores";

export default function TableHistory() {
    const { users, getAllUsers, loadingUser } = useHistoryStore();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.nama?.toLowerCase().includes(search.toLowerCase()) ||
            u.nomorHp?.includes(search) ||
            u.npwp?.includes(search)
        );
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [search]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full p-6 space-y-6 font-mono animate-in fade-in duration-500">
            
            {/* 1. FILTER COMMAND BAR */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-slate-900 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-900 text-emerald-400">
                        <FaDatabase className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Master_Database</h2>
                        <h1 className="text-xl font-black text-slate-900 uppercase">User_Registry_Archive</h1>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="SEARCH_BY_NAME_NPWP_OR_PHONE..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border-b-2 border-slate-300 focus:border-slate-900 outline-none text-[11px] font-bold uppercase tracking-wider transition-all"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
            </div>

            {/* 2. DATA GRID CONTAINER */}
            <div className="bg-white border-2 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">User_Profile</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em]">Identification_No</th>
                                <th className="p-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">System_Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loadingUser ? (
                                <LoadingState />
                            ) : currentUsers.length > 0 ? (
                                currentUsers.map(user => (
                                    <tr key={user.uid} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:border-slate-900 group-hover:bg-white transition-all">
                                                    <FaUserCircle className="text-xl group-hover:text-slate-900" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-slate-900 uppercase leading-none mb-1">{user.nama}</div>
                                                    <div className="text-[10px] text-slate-500 font-bold tracking-tighter italic">{user.nomorHp}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="inline-block px-2 py-1 bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-600">
                                                {user.npwp || "NO_IDENTIFICATION_FOUND"}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <Link
                                                to={`/history/${user.uid}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                                            >
                                                <FaEye /> View_Logs
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <EmptyState search={search} />
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3. TACTICAL PAGINATION */}
                {!loadingUser && filteredUsers.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t-2 border-slate-900 bg-slate-50">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Showing <span className="text-slate-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> / Total_{filteredUsers.length}_Nodes
                        </div>

                        <div className="flex items-center gap-1">
                            <PaginationButton 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                icon={<FaChevronLeft />}
                            />
                            
                            <div className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black">
                                PAGE_{currentPage}_OF_{totalPages}
                            </div>

                            <PaginationButton 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                icon={<FaChevronRight />}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ================= HELPER COMPONENTS ================= */

function LoadingState() {
    return (
        <tr>
            <td colSpan={3} className="p-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-1 border-2 border-slate-200 relative overflow-hidden bg-slate-100">
                        <div className="absolute inset-y-0 left-0 bg-slate-900 w-1/2 animate-[loading_1s_infinite_linear]"></div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing_Database...</span>
                </div>
            </td>
        </tr>
    );
}

function EmptyState({ search }: { search: string }) {
    return (
        <tr>
            <td colSpan={3} className="p-20 text-center">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {search ? `Null_Result_For: "${search}"` : "No_Data_Packets_Found"}
                </div>
            </td>
        </tr>
    );
}

function PaginationButton({ onClick, disabled, icon }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="p-2.5 bg-white border border-slate-900 text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:grayscale transition-all active:bg-slate-200"
        >
            {icon}
        </button>
    );
}