import { create } from "zustand"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../configs/firebase"

export type Data = {
    token: string
    type: string
    userName: string
    nomorHp: string
    status: string
    subStatus: string
    queueNo: number
}

type QueueState = {
    smkhp: Data[]
    laboratorium: Data[]
    customer_service: Data[]
    isLoading: boolean
    error: string | null
}

type QueueAction = {
    getSMKHP: () => Promise<void>
    getLaboratorium: () => Promise<void>
    getCustomerService: () => Promise<void>
}

const initialState: QueueState = {
    smkhp: [],
    laboratorium: [],
    customer_service: [],
    isLoading: false,
    error: null
}

const useQueueStore = create<QueueState & QueueAction>((set) => ({
    ...initialState,

    // ================= SMKHP =================
    getSMKHP: async () => {
        try {
            set({ isLoading: true, error: null })

            const q = query(
                collection(db, "SMKHP"),
                where("status", "==", "active")
            )

            const snap = await getDocs(q)

            const data = snap.docs.map((doc) => {
                const d = doc.data()
                return {
                    token: doc.id,
                    type: "SMKHP",
                    userName: d.userNama,
                    nomorHp: d.nomorHp,
                    status: d.status,
                    subStatus: d.subStatus,
                    queueNo: d.queueNo
                }
            })

            set({ smkhp: data })
        } catch (err) {
            console.error(err)
            set({ error: "Gagal mengambil data SMKHP" })
        } finally {
            set({ isLoading: false })
        }
    },

    // ================= LAB =================
    getLaboratorium: async () => {
        try {
            set({ isLoading: true, error: null })

            const q = query(
                collection(db, "LAB"),
                where("status", "==", "active")
            )

            const snap = await getDocs(q)

            const data = snap.docs.map((doc) => {
                const d = doc.data()
                return {
                    token: doc.id,
                    type: "Laboratorium",
                    userName: d.userNama,
                    nomorHp: d.nomorHp,
                    status: d.status,
                    subStatus: d.subStatus,
                    queueNo: d.queueNo
                }
            })

            set({ laboratorium: data })
        } catch (err) {
            console.error(err)
            set({ error: "Gagal mengambil data Laboratorium" })
        } finally {
            set({ isLoading: false })
        }
    },

    // ================= CUSTOMER SERVICE =================
    getCustomerService: async () => {
        try {
            set({ isLoading: true, error: null })

            const q = query(
                collection(db, "CustomerService"),
                where("status", "==", "active")
            )

            const snap = await getDocs(q)

            const data = snap.docs.map((doc) => {
                const d = doc.data()
                return {
                    token: doc.id,
                    type: "Customer Service",
                    userName: d.userNama,
                    nomorHp: d.nomorHp,
                    status: d.status,
                    subStatus: d.subStatus,
                    queueNo: d.queueNo
                }
            })

            set({ customer_service: data })
        } catch (err) {
            console.error(err)
            set({ error: "Gagal mengambil data Customer Service" })
        } finally {
            set({ isLoading: false })
        }
    }
}))

export default useQueueStore