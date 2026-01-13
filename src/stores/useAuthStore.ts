// library
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { create } from 'zustand'

// configs
import { auth, db } from "../configs/firebase";


type AuthState = {
    full_name: string
    nip: string
    email: string
    password: string
    role: string
    is_loading: boolean
    is_error: boolean
    message: string
}

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void
    reset: () => void
    login: () => Promise<void>
    register: () => Promise<void>
}

const initialState: Omit<AuthState, 'is_loading' | 'is_error' | 'message'> = {
    full_name: '',
    email: '',
    nip: '',
    password: '',
    role: 'operator',
}

const useAuthStore = create<AuthState & AuthAction>((set, get) => ({
    ...initialState,
    is_loading: false,
    is_error: false,
    message: '',
    setField: (key, value) => set({ [key]: value } as Partial<AuthState>),
    reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),
    login: async (e?: React.FormEvent) => {
        e?.preventDefault()
        const { nip, password } = get()
        set({ is_loading: true, is_error: false, message: '' })

        try {
            if (nip === '0' && password === 'admin') {
                console.log('Login successful as admin')
            } else if (nip === '2' && password === 'customer-service') {
                console.log('Login successful as customer service')
            } else if (nip === '3' && password === 'laboratory') {
                console.log('Login successful as laboratory')
            } else if (nip === '4' && password === 'smkhp') {
                console.log('Login successful as smkhp')
            } else {
                throw new Error('Invalid NIP or password')
            }
        } catch (error) {
            if (error instanceof Error) {
                set({ is_error: true, message: error.message })
            }
            console.log(error)
        } finally {
            set({ is_loading: false })
        }
    },
    register: async (e?: React.FormEvent) => {
        e?.preventDefault()
        const { full_name, email, nip, password, role } = get()
        set({ is_loading: true, is_error: false, message: '' })

        try {
            // default role
            const user_role = role || 'operator';

            // register
            const user_credential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = user_credential.user.uid;
            // console.log("User registered:", uid);

            // add to firestore
            await setDoc(doc(db, "officer", uid), {
                full_name,
                email,
                nip,
                role: user_role,
                createdAt: new Date()
            });

            // set message
            set({ is_error: false, message: 'Create account successfully' });

            // redirect to login
            setTimeout(() => window.location.href = '/', 2000);
        } catch (error) {
            // console.error("Register error:", error);

            if (error instanceof Error) {
                let firebaseCode = (error as any).code || '';
                let message = firebaseCode === 'auth/email-already-in-use' ? 'EMAIL_EXISTS' : error.message;

                set({ is_error: true, message });
                // console.log("Error message shown to user:", message);
            }
        } finally {
            set({ is_loading: false });
        }
    },
}))

export default useAuthStore
