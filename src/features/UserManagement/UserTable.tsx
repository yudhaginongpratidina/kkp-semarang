import { useEffect, useState } from "react";
import { FiEdit2, FiCheck, FiX, FiFilter } from "react-icons/fi";
import { FaTrash, FaUserGear, FaUserPlus } from "react-icons/fa6";
import { Button } from "../../components";
import UserForm from "./UserForm";
import { useUserManagementStore, useModalStore } from "../../stores";

const ROLE_OPTIONS = ["operator", "customer_service", "laboratorium", "superuser"];

const ROLE_BADGES: Record<string, string> = {
    operator: "bg-blue-100 text-blue-800",
    customer_service: "bg-green-100 text-green-800",
    laboratorium: "bg-purple-100 text-purple-800",
    superuser: "bg-red-100 text-red-800"
};

// Helper format text (DRY Principle)
const formatRole = (role: string) => {
    if (!role) return "No Role";
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function UserTable() {
    const { get_officers, officers, update_role_officer, delete_officer } = useUserManagementStore();
    const { open } = useModalStore();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [filterRole, setFilterRole] = useState<string>("all");

    useEffect(() => { get_officers(); }, []);

    const handleEdit = (officerId: string, currentRole: string) => {
        setEditingId(officerId);
        setSelectedRole(currentRole || "");
    };

    const handleUpdate = async (officerId: string) => {
        if (!selectedRole) return;
        await update_role_officer(officerId, selectedRole);
        setEditingId(null);
    };

    const filteredOfficers = filterRole === "all"
        ? officers
        : officers.filter(o => o.role === filterRole);

    return (
        <div className="w-full p-6">
            <div className="mb-4 flex justify-between items-center bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                <div className="flex items-center gap-2">
                    <FiFilter />
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="border p-2 rounded-sm">
                        <option value="all">All Roles</option>
                        {ROLE_OPTIONS.map(role => (
                            <option key={role} value={role}>{formatRole(role)}</option>
                        ))}
                    </select>
                </div>
                <Button
                    type="button"
                    onClick={() => open({
                        title: "Create",
                        content: <UserForm type="create" />,
                        size: "lg",
                    })}
                    className="bg-black text-white"
                >
                    <FaUserPlus />
                    Create
                </Button>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">No</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Full Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">NIP</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Role</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOfficers.map((officer, index) => (
                            <tr key={officer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm">{index + 1}</td>
                                <td className="px-6 py-4 text-sm font-medium">{officer.full_name}</td>
                                <td className="px-6 py-4 text-sm font-mono">{officer.nip}</td>
                                <td className="px-6 py-4">
                                    {editingId === officer.id ? (
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="border border-blue-300 p-1 text-sm rounded-sm"
                                        >
                                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{formatRole(r)}</option>)}
                                        </select>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-sm text-xs font-medium ${ROLE_BADGES[officer.role] ?? 'bg-gray-100 text-gray-800'}`}>
                                            {formatRole(officer.role)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {editingId === officer.id ? (
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleUpdate(officer.id)} className="bg-green-500 text-white p-2 rounded-sm"><FiCheck /></button>
                                            <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white p-2 rounded-sm"><FiX /></button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => handleEdit(officer.id, officer.role)} className="bg-gray-500 text-white p-2 rounded-sm">
                                                <FaUserGear />
                                            </button>
                                            <button onClick={() => delete_officer(officer.id)} className="bg-gray-500 text-white p-2 rounded-sm">
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={() => open({
                                                    title: "Create",
                                                    content: <UserForm type="update" id={officer.id} />,
                                                    size: "lg",
                                                })}
                                                className="bg-gray-500 text-white p-2 rounded-sm">
                                                <FiEdit2 />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}