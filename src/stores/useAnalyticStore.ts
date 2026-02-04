import { create } from "zustand"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../configs/firebase"
import { toast } from 'sonner';

export type Data = {
    count: number
    date: string
}

export type ServiceKey = "SMKHP" | "LAB" | "CustomerService"

// Struktur untuk menampung total per bulan (index 0-11)
export type MonthlyStats = Record<number, Record<ServiceKey, number>>

export type AnalyticState = {
    smkhp: Data[]
    laboratorium: Data[]
    customer_service: Data[]
    monthlyStats: MonthlyStats
    isLoading: boolean
    error: string | null
}

type AnalyticAction = {
    subscribeAnalytics: (year?: number) => (() => void)
}

const initialState: AnalyticState = {
    smkhp: [],
    laboratorium: [],
    customer_service: [],
    monthlyStats: {},
    isLoading: false,
    error: null
}

const useAnalyticStore = create<AnalyticState & AnalyticAction>((set) => ({
    ...initialState,

    subscribeAnalytics: (targetYear = new Date().getFullYear()) => {
        set({ isLoading: true, error: null })
        
        let isInitialLoad = true;

        const unsub = onSnapshot(
            collection(db, "counters"),
            (snap) => {
                const smkhp: Data[] = []
                const laboratorium: Data[] = []
                const customer_service: Data[] = []
                
                const stats: MonthlyStats = {}
                for (let i = 0; i < 12; i++) {
                    stats[i] = { SMKHP: 0, LAB: 0, CustomerService: 0 }
                }

                snap.docs.forEach((doc) => {
                    const d = doc.data() as Data
                    const [service, dateStr] = doc.id.split("_")
                    
                    if (!dateStr || dateStr.length < 8) return;

                    const y = parseInt(dateStr.slice(0, 4))
                    const m = parseInt(dateStr.slice(4, 6)) - 1
                    
                    if (y === targetYear) {
                        const dataItem = { count: d.count, date: d.date }
                        const key = service as ServiceKey

                        if (service === "SMKHP") smkhp.push(dataItem)
                        else if (service === "LAB") laboratorium.push(dataItem)
                        else if (service === "CustomerService") customer_service.push(dataItem)

                        if (stats[m] && stats[m][key] !== undefined) {
                            stats[m][key] += d.count
                        }
                    }
                })

                set({ 
                    smkhp, 
                    laboratorium, 
                    customer_service, 
                    monthlyStats: stats, 
                    isLoading: false 
                })

                // STRATEGI TOAST: Hanya munculkan saat data pertama kali berhasil ditarik
                if (isInitialLoad) {
                    toast.success(`Analytics Sync: ${targetYear} Data Loaded`, {
                        description: `Berhasil memproses ${snap.size} entri data.`,
                        icon: '📊'
                    });
                    isInitialLoad = false;
                }
            },
            (err) => {
                console.error("FIREBASE_ANALYTIC_ERROR:", err)
                set({ error: "Gagal load analytics", isLoading: false })
                
                toast.error("Connection Failed", {
                    description: "Gagal menyambungkan ke stream analitik. Cek koneksi Anda.",
                    action: {
                        label: "Retry",
                        onClick: () => window.location.reload(),
                    },
                });
            }
        )
        return unsub
    }
}))

export default useAnalyticStore