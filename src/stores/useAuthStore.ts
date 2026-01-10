import { create } from 'zustand'

type AuthState = {
    username: string
    password: string
    role: 'op-admin' | 'op-customer-service' | 'op-laboratory' | 'op-smkhp'
    is_loading: boolean
    error: string | null
}

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void
    reset: () => void
    login: () => Promise<void>
    register: () => Promise<void>
}

const initialState: Omit<AuthState, 'is_loading' | 'error'> = {
    username: '',
    password: '',
    role: 'op-admin',
}

const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    ...initialState,
    is_loading: false,
    error: null,
    setField: (key, value) => set({ [key]: value } as Partial<AuthState>),
    reset: () => set({ ...initialState, is_loading: false, error: null }),
    login: async (e?: React.FormEvent) => {
        e?.preventDefault()
        const { username, password } = get()
        set({ is_loading: true, error: null })

        try {
            if (username === 'admin' && password === 'admin') {
                console.log('Login successful as admin')
            } else if (username === 'customer-service' && password === 'customer-service') {
                console.log('Login successful as customer service')
            } else if (username === 'laboratory' && password === 'laboratory') {
                console.log('Login successful as laboratory')
            } else if (username === 'smkhp' && password === 'smkhp') {
                console.log('Login successful as smkhp')
            } else {
                throw new Error('Invalid username or password')
            }
        } catch (error) {
            if (error instanceof Error) {
                set({ error: error.message })
            }
            console.log(error)
        } finally {
            set({ is_loading: false })
        }
    },
    register: async (e?: React.FormEvent) => {
        e?.preventDefault()
        const { username, password } = get()
        set({ is_loading: true, error: null })
        try {
            if (username === 'admin' && password === 'admin') {
                console.log('Login successful as admin')
            } else if (username === 'customer-service' && password === 'customer-service') {
                console.log('Login successful as customer service')
            } else if (username === 'laboratory' && password === 'laboratory') {
                console.log('Login successful as laboratory')
            } else if (username === 'smkhp' && password === 'smkhp') {
                console.log('Login successful as smkhp')
            } else {
                throw new Error('Invalid username or password')
            }
        } catch (error) {
            if (error instanceof Error) {
                set({ error: error.message })
            }
            console.log(error)
        } finally {
            set({ is_loading: false })
        }
    },
}))

export default useAuthStore