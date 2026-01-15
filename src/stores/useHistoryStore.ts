// library
import { create } from 'zustand'
import { collection, getDocs } from 'firebase/firestore'

// configs
import { db } from '../configs/firebase'

type Data = {
    uid: string
    nama: string
    nomorHp: string
}

type HistoryState = {
    data: Data[]
    isLoading: boolean
    error: string | null
}

type HistoryActions = {
    get_data: () => Promise<void>
}

const initialState: HistoryState = {
    data: [],
    isLoading: false,
    error: null
}

const useHistoryStore = create<HistoryState & HistoryActions>((set) => ({
    ...initialState,

    get_data: async () => {
        try {
            set({ isLoading: true, error: null })

            const snapshot = await getDocs(collection(db, 'users'))

            const users: Data[] = snapshot.docs.map((doc) => ({
                uid: doc.id,
                ...(doc.data() as Omit<Data, 'uid'>)
            }))

            set({ data: users })
        } catch (err) {
            set({ error: 'Gagal mengambil data user' })
        } finally {
            set({ isLoading: false })
        }
    }
}))

export default useHistoryStore
