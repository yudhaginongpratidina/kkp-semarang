import { useEffect, useState, useMemo } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { MdCalendarToday, MdShowChart } from "react-icons/md"
import useAnalyticStore, { type Data } from "../../stores/useAnalyticStore"

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

type FilterMode = "last_7_days" | "monthly" | "weekly_in_month"

export default function AnalyticsDashboard() {
    const { subscribeAnalytics, smkhp, laboratorium, customer_service, monthlyStats } = useAnalyticStore()
    
    const [filter, setFilter] = useState<FilterMode>("monthly")
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())

    useEffect(() => {
        const unsub = subscribeAnalytics()
        return () => unsub()
    }, [subscribeAnalytics])

    const normalizeDate = (dateStr: string) => dateStr.replace(/-/g, "")

    const aggregateByDateRange = (dataArray: Data[], month: number, startDay: number, endDay: number) => {
        const year = new Date().getFullYear()
        return dataArray.filter((item) => {
            const d = item.date.replace(/-/g, "")
            const itemYear = parseInt(d.slice(0, 4))
            const itemMonth = parseInt(d.slice(4, 6)) - 1
            const itemDay = parseInt(d.slice(6, 8))
            
            return itemYear === year && itemMonth === month && itemDay >= startDay && itemDay <= endDay
        }).reduce((acc, curr) => acc + curr.count, 0)
    }

    const dataset = useMemo(() => {
        const now = new Date()
        if (filter === "last_7_days") {
            return [...Array(7)].map((_, i) => {
                const d = new Date()
                d.setDate(now.getDate() - (6 - i))
                const year = d.getFullYear()
                const month = String(d.getMonth() + 1).padStart(2, '0')
                const day = String(d.getDate()).padStart(2, '0')
                const targetDateClean = `${year}${month}${day}`
                
                return {
                    label: `${dayNames[d.getDay()]} (${d.getDate()})`,
                    smkhp: smkhp.filter(item => normalizeDate(item.date) === targetDateClean).reduce((a, b) => a + b.count, 0),
                    laboratorium: laboratorium.filter(item => normalizeDate(item.date) === targetDateClean).reduce((a, b) => a + b.count, 0),
                    customerService: customer_service.filter(item => normalizeDate(item.date) === targetDateClean).reduce((a, b) => a + b.count, 0),
                }
            })
        } 
        else if (filter === "weekly_in_month") {
            const weeks = [
                { label: "Minggu 1", start: 1, end: 7 },
                { label: "Minggu 2", start: 8, end: 14 },
                { label: "Minggu 3", start: 15, end: 21 },
                { label: "Minggu 4", start: 22, end: 31 },
            ]
            return weeks.map((w) => ({
                label: w.label,
                smkhp: aggregateByDateRange(smkhp, selectedMonth, w.start, w.end),
                laboratorium: aggregateByDateRange(laboratorium, selectedMonth, w.start, w.end),
                customerService: aggregateByDateRange(customer_service, selectedMonth, w.start, w.end),
            }))
        } 
        else {
            return monthNames.map((month, index) => {
                const stats = monthlyStats[index] || { SMKHP: 0, LAB: 0, CustomerService: 0 }
                return {
                    label: month.slice(0, 3),
                    smkhp: stats.SMKHP,
                    laboratorium: stats.LAB,
                    customerService: stats.CustomerService,
                }
            })
        }
    }, [filter, selectedMonth, smkhp, laboratorium, customer_service, monthlyStats])

    const totalData = useMemo(() => {
        return dataset.reduce((acc, curr) => ({
            smkhp: acc.smkhp + curr.smkhp,
            laboratorium: acc.laboratorium + curr.laboratorium,
            customerService: acc.customerService + curr.customerService,
        }), { smkhp: 0, laboratorium: 0, customerService: 0 })
    }, [dataset])

    return (
        <div className="w-full p-4 space-y-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-sm shadow gap-4 border border-blue-100">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500 rounded-sm">
                        <MdShowChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Analitik Antrean</h2>
                        <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                            <MdCalendarToday className="w-3.5 h-3.5" />
                            {filter === "weekly_in_month" ? `Detail: ${monthNames[selectedMonth]}` : "Statistik Layanan"}
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value as FilterMode)}
                        className="bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm font-medium outline-none cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    >
                        <option value="monthly">Tahunan (Bulanan)</option>
                        <option value="last_7_days">7 Hari Terakhir</option>
                        <option value="weekly_in_month">Mingguan (Per Bulan)</option>
                    </select>
                    {filter === "weekly_in_month" && (
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="bg-white border border-gray-300 rounded-sm px-4 py-2 text-sm font-medium outline-none cursor-pointer hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                            {monthNames.map((name, i) => (
                                <option key={i} value={i}>{name}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-sm shadow border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">SMKHP</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{totalData.smkhp}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-sm">
                            <div className="w-8 h-8 bg-blue-500 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white rounded-sm shadow border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Laboratorium</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{totalData.laboratorium}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-sm">
                            <div className="w-8 h-8 bg-green-500 rounded-sm"></div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white rounded-sm shadow border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Customer Service</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{totalData.customerService}</p>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-sm">
                            <div className="w-8 h-8 bg-amber-500 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="w-full p-6 rounded-sm bg-white shadow border border-gray-100 overflow-x-auto">
                <BarChart
                    dataset={dataset}
                    height={400}
                    xAxis={[{ scaleType: "band", dataKey: "label" }]}
                    yAxis={[{ label: "Total Antrean" }]}
                    series={[
                        { dataKey: "smkhp", label: "SMKHP", color: "#3b82f6" },
                        { dataKey: "laboratorium", label: "Lab", color: "#10b981" },
                        { dataKey: "customerService", label: "CS", color: "#f59e0b" },
                    ]}
                    margin={{ top: 80, right: 30, bottom: 50, left: 60 }}
                    slotProps={{
                        legend: {
                            direction: 'row' as const,
                            position: { 
                                vertical: 'top' as const,
                                horizontal: 'center' as const
                            },
                            padding: 0,
                        },
                    }}
                />
            </div>
        </div>
    )
}