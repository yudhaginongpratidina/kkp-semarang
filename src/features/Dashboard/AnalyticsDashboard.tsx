import { useEffect, useState, useMemo } from "react"
import { BarChart } from "@mui/x-charts/BarChart"
import { MdShowChart, MdFilterList, MdDownload } from "react-icons/md"
import useAnalyticStore, { type Data } from "../../stores/useAnalyticStore"

/* ================== CONSTANTS ================== */
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

type FilterMode = "last_7_days" | "monthly" | "weekly_in_month"

/* ================== MAIN COMPONENT ================== */
export default function AnalyticsDashboard() {
    const { subscribeAnalytics, smkhp, laboratorium, customer_service, monthlyStats } = useAnalyticStore()
    const [filter, setFilter] = useState<FilterMode>("monthly")
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())

    useEffect(() => {
        const unsub = subscribeAnalytics()
        return () => unsub()
    }, [subscribeAnalytics])

    /* ================== LOGIC: DATA AGGREGATION ================== */
    const normalizeDate = (date: string) => date.replace(/-/g, "")

    const aggregateByDateRange = (data: Data[], month: number, start: number, end: number) => {
        const year = new Date().getFullYear()
        return data
            .filter((item) => {
                const d = normalizeDate(item.date)
                const y = Number(d.slice(0, 4)), m = Number(d.slice(4, 6)) - 1, day = Number(d.slice(6, 8))
                return y === year && m === month && day >= start && day <= end
            })
            .reduce((a, b) => a + b.count, 0)
    }

    const dataset = useMemo(() => {
        const now = new Date()
        if (filter === "last_7_days") {
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(now.getDate() - (6 - i))
                const key = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`
                const findCount = (arr: Data[]) => arr.filter(v => normalizeDate(v.date) === key).reduce((a, b) => a + b.count, 0)
                return {
                    label: `${dayNames[d.getDay()].slice(0, 3)} ${d.getDate()}`,
                    smkhp: findCount(smkhp),
                    lab: findCount(laboratorium),
                    cs: findCount(customer_service),
                }
            })
        }

        if (filter === "weekly_in_month") {
            const weeks = [
                { label: "W1", start: 1, end: 7 }, { label: "W2", start: 8, end: 14 },
                { label: "W3", start: 15, end: 21 }, { label: "W4", start: 22, end: 31 }
            ]
            return weeks.map(w => ({
                label: w.label,
                smkhp: aggregateByDateRange(smkhp, selectedMonth, w.start, w.end),
                lab: aggregateByDateRange(laboratorium, selectedMonth, w.start, w.end),
                cs: aggregateByDateRange(customer_service, selectedMonth, w.start, w.end),
            }))
        }

        return monthNames.map((m, i) => {
            const stat = monthlyStats[i] || { SMKHP: 0, LAB: 0, CustomerService: 0 }
            return { label: m.slice(0, 3).toUpperCase(), smkhp: stat.SMKHP, lab: stat.LAB, cs: stat.CustomerService }
        })
    }, [filter, selectedMonth, smkhp, laboratorium, customer_service, monthlyStats])

    const total = useMemo(() => dataset.reduce((a, b) => ({
        smkhp: a.smkhp + b.smkhp, lab: a.lab + b.lab, cs: a.cs + b.cs
    }), { smkhp: 0, lab: 0, cs: 0 }), [dataset])

    return (
        <div className="w-full p-6 space-y-8 font-mono bg-slate-50 min-h-screen animate-in fade-in duration-700">

            {/* 1. TACTICAL HEADER */}
            <div className="flex flex-wrap justify-between items-end border-b-2 border-slate-900 pb-6 gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-900 text-white rounded-xs shadow-lg shadow-slate-200">
                        <MdShowChart className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-1">Data_Intelligence_v1.0</h2>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Queue_Analytics_Core</h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 text-[12px] font-black hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest">
                        <MdDownload /> Export_CSV
                    </button>
                    <div className="flex items-center gap-2 bg-slate-900 text-white p-0.5 rounded-sm">
                        <div className="pl-2 text-slate-500"><MdFilterList /></div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterMode)}
                            className="text-[12px] font-black uppercase px-3 py-2 focus:outline-none appearance-none cursor-pointer bg-slate-900"
                        >
                            <option value="monthly">Range: Annual</option>
                            <option value="last_7_days">Range: 7_Days</option>
                            <option value="weekly_in_month">Range: Monthly</option>
                        </select>
                        {filter === "weekly_in_month" && (
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="bg-slate-800 text-[12px] font-black uppercase px-3 py-2 focus:outline-none rounded-xs cursor-pointer"
                            >
                                {monthNames.map((m, i) => <option key={i} value={i}>{m.toUpperCase()}</option>)}
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. PERFORMANCE TILES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryTile label="SMKHP_REGISTRY" value={total.smkhp} color="bg-blue-600" />
                <SummaryTile label="LAB_DIAGNOSTICS" value={total.lab} color="bg-emerald-600" />
                <SummaryTile label="CS_ENGAGEMENT" value={total.cs} color="bg-amber-600" />
            </div>

            {/* 3. VISUALIZATION ENGINE */}
            <div className="bg-white border-2 border-slate-900 p-8 relative shadow-[8px_8px_0px_0px_rgba(15,23,42,0.05)]">
                <div className="absolute top-4 left-4 flex gap-1">
                    <div className="w-1 h-1 bg-slate-300"></div>
                    <div className="w-1 h-1 bg-slate-300"></div>
                </div>

                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Live_Distribution_Matrix</span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 border-l-2 border-slate-200 pl-4 uppercase">
                        Unit: Count / Time_Series
                    </div>
                </div>

                <div className="w-full h-100">
                    <BarChart
                        dataset={dataset}
                        xAxis={[{
                            scaleType: "band",
                            dataKey: "label",
                            tickLabelStyle: { fontSize: 9, fontWeight: 900, fill: '#64748b' }
                        }]}
                        series={[
                            { dataKey: "smkhp", label: "SMKHP", color: "#2563eb" },
                            { dataKey: "lab", label: "LAB", color: "#059669" },
                            { dataKey: "cs", label: "CS", color: "#d97706" },
                        ]}
                        slotProps={{
                            legend: {
                                direction: 'row' as const,
                                position: { vertical: 'top', horizontal: 'center' },
                                padding: 0,
                            } as any
                        }}
                        borderRadius={0}
                        margin={{ top: 20, right: 10, bottom: 40, left: 40 }}
                    />
                </div>
            </div>
        </div>
    )
}

/* ================= COMPONENT: SUMMARY TILE ================= */
function SummaryTile({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="bg-slate-900 p-6 border-b-4 border-slate-700 hover:border-white transition-all group">
            <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{label}</p>
                <div className={`w-3 h-3 ${color} rounded-full`}></div>
            </div>
            <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-white tracking-tighter">{value.toLocaleString()}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase italic">Units</p>
            </div>
        </div>
    )
}