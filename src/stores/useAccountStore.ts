import { create } from 'zustand'

type AccountState = {
    id: string
    username: string
    password: string
    role: 'op-admin' | 'op-customer-service' | 'op-laboratory' | 'op-smkhp'
    is_loading: boolean
    is_edit: boolean
    error: string | null
}

type AccountAction = {
    setField: <K extends keyof AccountState>(key: K, value: AccountState[K]) => void,
    update: () => Promise<void>,
}

const initialState: Omit<AccountState, 'is_loading' | 'error'> = {
    username: '',
    password: '',
    role: 'op-admin',
    id: '',
    is_edit: false
}

const useAccountStore = create<AccountState & AccountAction>((set, get) => ({
    ...initialState,
    is_loading: false,
    error: null,
    setField: (key, value) => set({ [key]: value } as Partial<AccountState>),
    update: async (e?: React.FormEvent) => {
        e?.preventDefault()
    }
}))

export default useAccountStore