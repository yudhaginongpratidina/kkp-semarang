// library
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
    user: {
        id: string
        role: string
    }
}

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void
    reset: () => void
    login: (e?: React.FormEvent) => Promise<void>
    register: (e?: React.FormEvent) => Promise<void>
    get_account: () => Promise<void>
    logout: () => Promise<void>
}

const initialState: Omit<AuthState, 'is_loading' | 'is_error' | 'message'> = {
    full_name: '',
    email: '',
    nip: '',
    password: '',
    role: 'operator',
    user: {
        id: '',
        role: ''
    }
}

const useAuthStore = create<AuthState & AuthAction>()(
    persist(
        (set, get) => ({
            ...initialState,
            is_loading: false,
            is_error: false,
            message: '',

            // set field dynamic
            setField: (key, value) => set({ [key]: value } as Partial<AuthState>),

            // reset state
            reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),

            // logout
            logout: async () => {
                try {
                    await signOut(auth);
                    set({
                        user: { id: '', role: '' },
                        email: '',
                        nip: '',
                        role: 'operator',
                        full_name: '',
                        password: '',
                        is_loading: false,
                        is_error: false,
                        message: 'Logout successfully'
                    });
                    // redirect ke halaman login
                    setTimeout(() => window.location.href = '/login', 2000)
                    setTimeout(() => set({ is_error: false, message: '' }), 3000)
                } catch (error) {
                    console.error("Logout error:", error);
                    set({ is_error: true, message: 'Logout failed' })
                }
            },

            // register
            register: async (e?: React.FormEvent) => {
                e?.preventDefault()
                const { full_name, email, nip, password, role } = get()
                set({ is_loading: true, is_error: false, message: '' })

                try {
                    const user_role = role || 'operator'

                    // create user
                    const user_credential = await createUserWithEmailAndPassword(auth, email, password)
                    const uid = user_credential.user.uid

                    // save additional info to Firestore
                    await setDoc(doc(db, "officers", uid), {
                        full_name,
                        email,
                        nip,
                        role: user_role,
                        createdAt: new Date()
                    })

                    set({ is_error: false, message: 'Create account successfully' })
                    console.log("User registered & saved to Firestore:", { uid, full_name, email, nip, role: user_role })

                    // redirect ke login page
                    setTimeout(() => window.location.href = '/', 2000)
                    setTimeout(() => set({ is_error: false, message: '' }), 3000)
                } catch (error) {
                    console.error("Register error:", error)
                    if (error instanceof Error) {
                        const firebaseCode = (error as any).code || ''
                        const message = firebaseCode === 'auth/email-already-in-use' ? 'EMAIL_EXISTS' : error.message
                        set({ is_error: true, message })
                    }
                } finally {
                    set({ is_loading: false })
                }
            },

            // login
            login: async (e?: React.FormEvent) => {
                e?.preventDefault()
                const { email, password } = get()
                set({ is_loading: true, is_error: false, message: '' })

                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    const uid = userCredential.user.uid
                    // console.log("User logged in:", uid)

                    // fetch role & NIP from Firestore
                    const userDoc = await getDoc(doc(db, "officers", uid))
                    if (userDoc.exists()) {
                        const data = userDoc.data()
                        set({
                            user: { id: uid, role: data.role },
                            role: data.role,
                            nip: data.nip
                        })
                    }

                    set({ is_error: false, message: 'Login successfully' })
                    // redirect ke dashboard
                    setTimeout(() => window.location.href = '/dashboard', 2000)
                    setTimeout(() => set({ is_error: false, message: '' }), 3000)
                } catch (error) {
                    console.error("Login error:", error)
                    if (error instanceof Error) {
                        const firebaseCode = (error as any).code || ''
                        let message = ''
                        switch (firebaseCode) {
                            case 'auth/user-not-found':
                                message = 'USER_NOT_FOUND'
                                break
                            case 'auth/wrong-password':
                                message = 'INVALID_PASSWORD'
                                break
                            default:
                                message = error.message
                        }
                        set({ is_error: true, message })
                    }
                } finally {
                    set({ is_loading: false })
                }
            },

            // get account
            get_account: async () => {
                const { user, setField } = get()

                try {
                    if (!user.id) {
                        throw new Error("User not logged in")
                    }

                    const userDoc = await getDoc(doc(db, "officers", user.id))
                    if (userDoc.exists()) {
                        const data = userDoc.data()
                        setField("full_name", data.full_name || "")
                        setField("nip", data.nip || "")
                    } else {
                        throw new Error("User data not found in Firestore")
                    }
                } catch (error) {
                    console.error("Get account error:", error)
                    if (error instanceof Error) {
                        set({ is_error: true, message: error.message })
                        setTimeout(() => set({ is_error: false, message: '' }), 3000)
                    }
                }
            }


        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)

export default useAuthStore
