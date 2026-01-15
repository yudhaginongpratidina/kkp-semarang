// libraries
import { useEffect, useState } from "react"
import { FiEdit2, FiCheck, FiX, FiFilter, FiUsers } from "react-icons/fi"

// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"

// stores
import { useUserRoleManagementStore } from "../stores"

const ROLE_OPTIONS = ["operator", "customer_service", "laboratorium", "super_admin"]

const ROLE_BADGES: Record<string, string> = {
    operator: "bg-blue-100 text-blue-800",
    customer_service: "bg-green-100 text-green-800",
    laboratorium: "bg-purple-100 text-purple-800",
    super_admin: "bg-red-100 text-red-800"
}

export default function RoleManagementView() {
    const { get_officers, officers, update_officer } = useUserRoleManagementStore()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<string>("")
    const [filterRole, setFilterRole] = useState<string>("all")

    useEffect(() => {
        get_officers()
    }, [])

    const handleEdit = (officerId: string, currentRole: string) => {
        setEditingId(officerId)
        setSelectedRole(currentRole)
    }

    const handleCancel = () => {
        setEditingId(null)
        setSelectedRole("")
    }

    const handleUpdate = async (officerId: string) => {
        if (!selectedRole) return
        await update_officer(officerId, selectedRole)
        setEditingId(null)
        setSelectedRole("")
    }

    // filter officers berdasarkan role
    const filteredOfficers = filterRole === "all"
        ? officers
        : officers.filter(officer => officer.role === filterRole)

    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <div className="w-full p-6">
                    {/* Filter Section */}
                    <div className="mb-4 flex items-center gap-3 bg-white p-4 rounded-sm shadow-sm border border-gray-200">
                        <FiFilter className="text-gray-500" />
                        <label className="font-medium text-gray-700">Filter by Role:</label>
                        <select
                            className="border border-gray-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="all">All Roles</option>
                            {ROLE_OPTIONS.map(role => (
                                <option key={role} value={role}>
                                    {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </option>
                            ))}
                        </select>
                        <span className="ml-auto text-sm text-gray-500">
                            {filteredOfficers.length} officer{filteredOfficers.length !== 1 ? 's' : ''} found
                        </span>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Full Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            NIP
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOfficers.map((officer, index) => (
                                        <tr key={officer.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {officer.full_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700 font-mono">
                                                    {officer.nip}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {editingId === officer.id ? (
                                                    <select
                                                        className="border border-blue-300 px-3 py-2 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                    >
                                                        {ROLE_OPTIONS.map((role) => (
                                                            <option key={role} value={role}>
                                                                {role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium ${ROLE_BADGES[officer.role] || 'bg-gray-100 text-gray-800'}`}>
                                                        {officer.role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                {editingId === officer.id ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            className="inline-flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition-colors text-sm font-medium shadow-sm"
                                                            onClick={() => handleUpdate(officer.id)}
                                                        >
                                                            <FiCheck className="text-base" />
                                                            Update
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center gap-1 bg-gray-500 text-white px-4 py-2 rounded-sm hover:bg-gray-600 transition-colors text-sm font-medium shadow-sm"
                                                            onClick={handleCancel}
                                                        >
                                                            <FiX className="text-base" />
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="inline-flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition-colors text-sm font-medium shadow-sm"
                                                        onClick={() => handleEdit(officer.id, officer.role)}
                                                    >
                                                        <FiEdit2 className="text-base" />
                                                        Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredOfficers.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FiUsers className="text-gray-300 text-4xl" />
                                                    <p className="text-gray-500 font-medium">No officers found</p>
                                                    <p className="text-gray-400 text-sm">Try adjusting your filter</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </KPPMain>
        </div>
    )
}