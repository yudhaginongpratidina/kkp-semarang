import { useEffect, useState, useMemo } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
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

    return (
        <div className="w-full p-4 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white rounded-lg shadow-sm gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Analitik Antrean</h2>
                    <p className="text-sm text-gray-500">
                        {filter === "weekly_in_month" ? `Detail: ${monthNames[selectedMonth]}` : "Statistik Layanan"}
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-2 rounded-lg border">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value as FilterMode)}
                        className="bg-white border rounded px-3 py-1.5 text-sm font-medium outline-none cursor-pointer"
                    >
                        <option value="monthly">Tahunan (Bulanan)</option>
                        <option value="last_7_days">7 Hari Terakhir</option>
                        <option value="weekly_in_month">Mingguan (Per Bulan)</option>
                    </select>

                    {filter === "weekly_in_month" && (
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="bg-white border rounded px-3 py-1.5 text-sm font-medium outline-none cursor-pointer"
                        >
                            {monthNames.map((name, i) => (
                                <option key={i} value={i}>{name}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="w-full p-6 rounded-lg bg-white shadow-md border border-gray-100 overflow-x-auto">
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
                            direction: 'row' as const, // DIPERBAIKI dengan as const
                            position: { 
                                vertical: 'top' as const, // DIPERBAIKI dengan as const
                                horizontal: 'center' as const // DIPERBAIKI: sebelumnya 'middle'
                            },
                            padding: 0,
                        },
                    }}
                />
            </div>
        </div>
    )
}