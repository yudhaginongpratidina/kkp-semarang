import { useEffect } from "react"
import { FaUsers, FaCheckCircle, FaClock, FaSpinner } from "react-icons/fa"
import { useQueueStore } from "../../stores"

// =====================
// TYPE ROLE
// =====================
type UserRole =
    | "superuser"
    | "operator"
    | "laboratorium"
    | "customer service"

// =====================
// COMPONENT
// =====================
export default function StatisticsDashboard() {
    const {
        smkhp,
        laboratorium,
        customer_service,
        isLoading,
        error,
        getSMKHP,
        getLaboratorium,
        getCustomerService
    } = useQueueStore()

    const role = "superuser" as UserRole

    useEffect(() => {
        if (role === "superuser" || role === "operator") {
            getSMKHP()
        }
        if (role === "superuser" || role === "laboratorium") {
            getLaboratorium()
        }
        if (role === "superuser" || role === "customer service") {
            getCustomerService()
        }
    }, [role, getSMKHP, getLaboratorium, getCustomerService])

    // =====================
    // HITUNG STATUS
    // =====================
    const countStatus = (data: any[]) => {
        const active = data.filter(d => d.status?.toLowerCase() === "active")
        return {
            total: active.length,
            menunggu: active.filter(
                d => d.subStatus?.toLowerCase() === "menunggu"
            ).length,
            diproses: active.filter(
                d => d.subStatus?.toLowerCase() === "diproses"
            ).length
        }
    }

    const smkhpStat = countStatus(smkhp)
    const labStat = countStatus(laboratorium)
    const csStat = countStatus(customer_service)

    // =====================
    // RENDER BY ROLE
    // =====================
    const renderCards = () => {
        if (role === "superuser") {
            return (
                <>
                    <StatCard 
                        title="SMKHP" 
                        data={smkhpStat} 
                        gradientFrom="from-blue-500" 
                        gradientTo="to-blue-700"
                    />
                    <StatCard 
                        title="Laboratorium" 
                        data={labStat} 
                        gradientFrom="from-green-500" 
                        gradientTo="to-green-700"
                    />
                    <StatCard 
                        title="Customer Service" 
                        data={csStat} 
                        gradientFrom="from-purple-500" 
                        gradientTo="to-purple-700"
                    />
                </>
            )
        }
        if (role === "operator") {
            return (
                <>
                    <SingleStat 
                        title="Total Antrian" 
                        subtitle="SMKHP"
                        value={smkhpStat.total} 
                        icon={<FaUsers className="text-3xl" />}
                        gradientFrom="from-blue-500" 
                        gradientTo="to-blue-600"
                    />
                    <SingleStat 
                        title="Menunggu" 
                        subtitle="SMKHP"
                        value={smkhpStat.menunggu} 
                        icon={<FaClock className="text-3xl" />}
                        gradientFrom="from-amber-500" 
                        gradientTo="to-orange-600"
                    />
                    <SingleStat 
                        title="Diproses" 
                        subtitle="SMKHP"
                        value={smkhpStat.diproses} 
                        icon={<FaSpinner className="text-3xl" />}
                        gradientFrom="from-emerald-500" 
                        gradientTo="to-teal-600"
                    />
                </>
            )
        }
        if (role === "laboratorium") {
            return (
                <>
                    <SingleStat 
                        title="Total Antrian" 
                        subtitle="Laboratorium"
                        value={labStat.total} 
                        icon={<FaUsers className="text-3xl" />}
                        gradientFrom="from-green-500" 
                        gradientTo="to-green-600"
                    />
                    <SingleStat 
                        title="Menunggu" 
                        subtitle="Laboratorium"
                        value={labStat.menunggu} 
                        icon={<FaClock className="text-3xl" />}
                        gradientFrom="from-amber-500" 
                        gradientTo="to-orange-600"
                    />
                    <SingleStat 
                        title="Diproses" 
                        subtitle="Laboratorium"
                        value={labStat.diproses} 
                        icon={<FaSpinner className="text-3xl" />}
                        gradientFrom="from-emerald-500" 
                        gradientTo="to-teal-600"
                    />
                </>
            )
        }
        if (role === "customer service") {
            return (
                <>
                    <SingleStat 
                        title="Total Antrian" 
                        subtitle="Customer Service"
                        value={csStat.total} 
                        icon={<FaUsers className="text-3xl" />}
                        gradientFrom="from-purple-500" 
                        gradientTo="to-purple-600"
                    />
                    <SingleStat 
                        title="Menunggu" 
                        subtitle="Customer Service"
                        value={csStat.menunggu} 
                        icon={<FaClock className="text-3xl" />}
                        gradientFrom="from-amber-500" 
                        gradientTo="to-orange-600"
                    />
                    <SingleStat 
                        title="Diproses" 
                        subtitle="Customer Service"
                        value={csStat.diproses} 
                        icon={<FaSpinner className="text-3xl" />}
                        gradientFrom="from-emerald-500" 
                        gradientTo="to-teal-600"
                    />
                </>
            )
        }
        return null
    }

    return (
        <div className="p-4 space-y-6 bg-gray-50">

            {isLoading && (
                <div className="flex items-center gap-2 text-gray-600">
                    <FaSpinner className="animate-spin" />
                    <p>Memuat data...</p>
                </div>
            )}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {renderCards()}
            </div>
        </div>
    )
}

// =====================
// COMPONENT CARD
// =====================
type StatCardProps = {
    title: string
    data: {
        total: number
        menunggu: number
        diproses: number
    }
    gradientFrom: string
    gradientTo: string
}

function StatCard({ title, data, gradientFrom, gradientTo }: StatCardProps) {
    return (
        <div className={`bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
            <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <div className="bg-black/20 p-3 rounded-sm">
                        <FaCheckCircle className="text-2xl" />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <StatRow 
                        icon={<FaUsers className="text-xl" />} 
                        label="Total Active" 
                        value={data.total} 
                    />
                    <div className="border-t border-white border-opacity-20"></div>
                    <StatRow 
                        icon={<FaClock className="text-xl" />} 
                        label="Menunggu" 
                        value={data.menunggu} 
                    />
                    <div className="border-t border-white border-opacity-20"></div>
                    <StatRow 
                        icon={<FaSpinner className="text-xl" />} 
                        label="Diproses" 
                        value={data.diproses} 
                    />
                </div>
            </div>
        </div>
    )
}

function SingleStat({
    title,
    subtitle,
    value,
    icon,
    gradientFrom,
    gradientTo
}: {
    title: string
    subtitle: string
    value: number
    icon: React.ReactNode
    gradientFrom: string
    gradientTo: string
}) {
    return (
        <div className={`bg-linear-to-br ${gradientFrom} ${gradientTo} rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium opacity-90">{subtitle}</p>
                        <h3 className="text-lg font-bold mt-1">{title}</h3>
                    </div>
                    <div className="bg-black/45 p-3 rounded-sm">
                        {icon}
                    </div>
                </div>
                
                <div className="mt-6">
                    <p className="text-5xl font-bold tracking-tight">{value}</p>
                    <p className="text-sm opacity-75 mt-2">antrian aktif</p>
                </div>
            </div>
        </div>
    )
}

function StatRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-sm">
                    {icon}
                </div>
                <span className="font-medium">{label}</span>
            </div>
            <span className="text-2xl font-bold">{value}</span>
        </div>
    )
}