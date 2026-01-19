import { create } from "zustand"
import { collection, onSnapshot, query, updateDoc, where, doc } from "firebase/firestore"
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
    getSMKHP: () => () => void
    getLaboratorium: () => () => void
    getCustomerService: () => () => void

    updateSMKHPStatus: (token: string, status: string) => Promise<void>
    updateLaboratoriumStatus: (token: string, status: string) => Promise<void>
    updateCustomerServiceStatus: (token: string, status: string) => Promise<void>
}

const initialState: QueueState = {
    smkhp: [],
    laboratorium: [],
    customer_service: [],
    isLoading: false,
    error: null
}

// Helper untuk range timestamp hari ini
const getTodayTimestampRange = () => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setHours(23, 59, 59, 999)

    return {
        start: start.getTime(),
        end: end.getTime()
    }
}

const useQueueStore = create<QueueState & QueueAction>((set) => ({
    ...initialState,

    // ================= SMKHP =================
    getSMKHP: () => {
        const { start, end } = getTodayTimestampRange()
        const q = query(
            collection(db, "SMKHP"),
            where("status", "==", "active"),
            where("timestamp", ">=", start),
            where("timestamp", "<=", end)
        )

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => {
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
        }, (err) => {
            console.error(err)
            set({ error: "Gagal load SMKHP" })
        })
    },

    updateSMKHPStatus: async (token, status) => {
        await updateDoc(doc(db, "SMKHP", token), { subStatus: status })
    },

    // ================= LAB =================
    getLaboratorium: () => {
        const { start, end } = getTodayTimestampRange()
        const q = query(
            collection(db, "LAB"),
            where("status", "==", "active"),
            where("timestamp", ">=", start),
            where("timestamp", "<=", end)
        )

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => {
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
        }, (err) => {
            console.error(err)
            set({ error: "Gagal load Laboratorium" })
        })
    },

    updateLaboratoriumStatus: async (token, status) => {
        await updateDoc(doc(db, "LAB", token), { subStatus: status })
    },

    // ================= CUSTOMER SERVICE =================
    getCustomerService: () => {
        const { start, end } = getTodayTimestampRange()
        const q = query(
            collection(db, "CustomerService"),
            where("status", "==", "active"),
            where("timestamp", ">=", start),
            where("timestamp", "<=", end)
        )

        return onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => {
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
        }, (err) => {
            console.error(err)
            set({ error: "Gagal load Customer Service" })
        })
    },

    updateCustomerServiceStatus: async (token, status) => {
        await updateDoc(doc(db, "CustomerService", token), { subStatus: status })
    }

}))

export default useQueueStore
