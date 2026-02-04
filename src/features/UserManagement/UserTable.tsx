import { useEffect, useState, useMemo } from "react";
import { FiEdit2, FiCheck, FiX, FiFilter } from "react-icons/fi";
import { FaTrash, FaUserGear, FaUserPlus } from "react-icons/fa6";
import UserForm from "./UserForm";
import { useUserManagementStore, useModalStore } from "../../stores";

const ROLE_OPTIONS = ["operator", "customer_service", "laboratorium", "superuser"];

const ROLE_THEMES: Record<string, string> = {
    operator: "border-blue-600 text-blue-600 bg-blue-50",
    customer_service: "border-green-600 text-green-600 bg-green-50",
    laboratorium: "border-purple-600 text-purple-600 bg-purple-50",
    superuser: "border-red-600 text-red-600 bg-red-50"
};

const formatRole = (role: string) => {
    if (!role) return "NULL_ROLE";
    return role.toUpperCase().replace('_', ' ');
};

export default function UserTable() {
    const { get_officers, officers, update_role_officer, delete_officer } = useUserManagementStore();
    const { open } = useModalStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [filterRole, setFilterRole] = useState<string>("all");

    useEffect(() => { get_officers(); }, []);

    const handleUpdate = async (officerId: string) => {
        if (!selectedRole) return;
        await update_role_officer(officerId, selectedRole);
        setEditingId(null);
    };

    const filteredOfficers = useMemo(() => {
        return filterRole === "all" ? officers : officers.filter(o => o.role === filterRole);
    }, [officers, filterRole]);

    return (
        <div className="min-h-screen bg-[#E2E8F0] p-4 md:p-8 font-mono text-slate-900 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className=" mx-auto z-10 relative">
                {/* HEADER SECTION */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-2 border-slate-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-600 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                                System_Auth // Access_Control
                            </span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter italic text-slate-800">
                            Manage_Users
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center bg-slate-800 px-3 py-2 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <FiFilter className="text-blue-400 mr-2" />
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="bg-slate-900 text-white text-[12px] font-black uppercase outline-none cursor-pointer"
                            >
                                <option value="all" className="bg-slate-800">ALL_ROLES</option>
                                {ROLE_OPTIONS.map(role => (
                                    <option key={role} value={role} className="bg-slate-800">{role.toUpperCase()}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => open({ title: "Create", content: <UserForm type="create" />, size: "lg" })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white border-2 border-slate-900 hover:bg-blue-700 font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-transform active:translate-x-0.5 active:translate-y-0.5"
                        >
                            <FaUserPlus /> Add_Officer
                        </button>
                    </div>
                </header>

                {/* TABLE CONTAINER */}
                <div className="bg-white border-2 border-slate-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="p-4 bg-slate-100 border-b-2 border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest">Database_Entries</span>
                        <span className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 uppercase">
                            {filteredOfficers.length} Users_Online
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b-2 border-slate-200">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Idx</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase">Officer_Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase">Identification_NIP</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase">Access_Level</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black uppercase">Operation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-slate-200">
                                {filteredOfficers.map((officer, index) => (
                                    <tr key={officer.id} className="hover:bg-blue-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-400">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-black uppercase tracking-tight text-slate-800">{officer.full_name}</div>
                                            <div className="text-[9px] text-slate-400">UUID: {officer.id.slice(0, 8)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-[12px] font-bold font-mono text-blue-600">
                                            {officer.nip}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === officer.id ? (
                                                <select
                                                    value={selectedRole}
                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                    className="bg-slate-900 text-white text-[10px] font-black uppercase p-1 border-2 border-blue-500 outline-none"
                                                >
                                                    {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`px-2 py-0.5 border-2 text-[9px] font-black uppercase ${ROLE_THEMES[officer.role] ?? 'border-slate-300 text-slate-400'}`}>
                                                    {formatRole(officer.role)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1 justify-center">
                                                {editingId === officer.id ? (
                                                    <>
                                                        <button onClick={() => handleUpdate(officer.id)} className="p-2 bg-green-600 text-white border border-black hover:bg-green-700"><FiCheck size={14} /></button>
                                                        <button onClick={() => setEditingId(null)} className="p-2 bg-slate-400 text-white border border-black hover:bg-slate-500"><FiX size={14} /></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(officer.id);
                                                                setSelectedRole(officer.role);
                                                            }}
                                                            title="Quick Role Edit"
                                                            className="p-2 border-2 border-transparent hover:border-slate-800 transition-all text-slate-600 hover:text-blue-600"
                                                        >
                                                            <FaUserGear size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => open({ title: "Update Profile", content: <UserForm type="update" id={officer.id} />, size: "lg" })}
                                                            className="p-2 border-2 border-transparent hover:border-slate-800 transition-all text-slate-600 hover:text-slate-900"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => { if (confirm('TERMINATE_USER?')) delete_officer(officer.id) }}
                                                            className="p-2 border-2 border-transparent hover:border-red-600 transition-all text-slate-300 hover:text-red-600"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}