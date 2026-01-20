import { useEffect, useState, useMemo } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { MdShowChart } from "react-icons/md"
import useAnalyticStore, { type Data } from "../../stores/useAnalyticStore"

/* ================== CONSTANT ================== */
const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

type FilterMode = "last_7_days" | "monthly" | "weekly_in_month"

type ChartItem = {
    label: string
    smkhp: number
    laboratorium: number
    customerService: number
}

/* ================== COMPONENT ================== */
export default function AnalyticsDashboard() {
    const {
        subscribeAnalytics,
        smkhp,
        laboratorium,
        customer_service,
        monthlyStats,
    } = useAnalyticStore()

    const [filter, setFilter] = useState<FilterMode>("monthly")
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth()
    )

    /* ================== EFFECT ================== */
    useEffect(() => {
        const unsub = subscribeAnalytics()
        return () => unsub()
    }, [subscribeAnalytics])

    /* ================== HELPERS ================== */
    const normalizeDate = (date: string) => date.replace(/-/g, "")

    const aggregateByDateRange = (
        data: Data[],
        month: number,
        start: number,
        end: number
    ) => {
        const year = new Date().getFullYear()

        return data
            .filter((item) => {
                const d = normalizeDate(item.date)
                const y = Number(d.slice(0, 4))
                const m = Number(d.slice(4, 6)) - 1
                const day = Number(d.slice(6, 8))

                return y === year && m === month && day >= start && day <= end
            })
            .reduce((a, b) => a + b.count, 0)
    }

    /* ================== DATASET ================== */
    const dataset: ChartItem[] = useMemo(() => {
        const now = new Date()

        if (filter === "last_7_days") {
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date()
                d.setDate(now.getDate() - (6 - i))

                const key = `${d.getFullYear()}${String(
                    d.getMonth() + 1
                ).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`

                return {
                    label: `${dayNames[d.getDay()]} (${d.getDate()})`,
                    smkhp: smkhp.filter(v => normalizeDate(v.date) === key).reduce((a, b) => a + b.count, 0),
                    laboratorium: laboratorium.filter(v => normalizeDate(v.date) === key).reduce((a, b) => a + b.count, 0),
                    customerService: customer_service.filter(v => normalizeDate(v.date) === key).reduce((a, b) => a + b.count, 0),
                }
            })
        }

        if (filter === "weekly_in_month") {
            const weeks = [
                { label: "Minggu 1", start: 1, end: 7 },
                { label: "Minggu 2", start: 8, end: 14 },
                { label: "Minggu 3", start: 15, end: 21 },
                { label: "Minggu 4", start: 22, end: 31 },
            ]

            return weeks.map(w => ({
                label: w.label,
                smkhp: aggregateByDateRange(smkhp, selectedMonth, w.start, w.end),
                laboratorium: aggregateByDateRange(laboratorium, selectedMonth, w.start, w.end),
                customerService: aggregateByDateRange(customer_service, selectedMonth, w.start, w.end),
            }))
        }

        return monthNames.map((m, i) => {
            const stat = monthlyStats[i] || { SMKHP: 0, LAB: 0, CustomerService: 0 }
            return {
                label: m.slice(0, 3),
                smkhp: stat.SMKHP,
                laboratorium: stat.LAB,
                customerService: stat.CustomerService,
            }
        })
    }, [filter, selectedMonth, smkhp, laboratorium, customer_service, monthlyStats])

    const total = useMemo(() => {
        return dataset.reduce(
            (a, b) => ({
                smkhp: a.smkhp + b.smkhp,
                laboratorium: a.laboratorium + b.laboratorium,
                customerService: a.customerService + b.customerService,
            }),
            { smkhp: 0, laboratorium: 0, customerService: 0 }
        )
    }, [dataset])

    /* ================== RENDER ================== */
    return (
        <div className="w-full p-4 space-y-4">
            {/* HEADER */}
            <div className="flex flex-wrap justify-between items-center bg-blue-50 p-5 rounded-sm">
                <div className="flex items-center gap-3">
                    <MdShowChart className="text-blue-600 text-2xl" />
                    <div>
                        <h2 className="text-lg font-bold">Analitik Antrean</h2>
                        <p className="text-sm text-gray-500">
                            {filter === "weekly_in_month"
                                ? `Detail ${monthNames[selectedMonth]}`
                                : "Statistik Layanan"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as FilterMode)}
                        className="border px-3 py-2 rounded-sm"
                    >
                        <option value="monthly">Tahunan</option>
                        <option value="last_7_days">7 Hari Terakhir</option>
                        <option value="weekly_in_month">Mingguan</option>
                    </select>

                    {filter === "weekly_in_month" && (
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="border px-3 py-2 rounded-sm"
                        >
                            {monthNames.map((m, i) => (
                                <option key={i} value={i}>{m}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-5 rounded-sm shadow">
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
                    slotProps={{
                        legend: {
                            direction: 'row' as const,
                            position: {
                                vertical: 'top',
                                horizontal: 'center',
                            },
                            padding: 0,
                        } as any
                    }}
                />
            </div>
        </div>
    )
}
