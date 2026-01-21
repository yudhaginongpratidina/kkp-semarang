// library
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// configs
import { auth, db } from "../configs/firebase";

type AuthState = {
    full_name: string
    nip: string
    email: string
    password: string
    current_password: string
    role: string
    is_loading: boolean
    is_error: boolean
    message: string
    user: {
        id: string
        email: string
        full_name: string
        nip: string
        role: string
    }
}

type AuthAction = {
    setField: <K extends keyof AuthState>(key: K, value: AuthState[K]) => void
    reset: () => void
    login: (e?: React.FormEvent) => Promise<void>
    register: (e?: React.FormEvent) => Promise<void>
    get_account: () => Promise<void>
    update_account: () => Promise<void>
    update_password: () => Promise<void>
    logout: () => Promise<void>
}

const initialState: Omit<AuthState, 'is_loading' | 'is_error' | 'message'> = {
    full_name: '',
    email: '',
    nip: '',
    password: '',
    current_password: '',
    role: 'operator',
    user: {
        id: '',
        email: '',
        full_name: '',
        nip: '',
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

            // Set field dinamis
            setField: (key, value) => set({ [key]: value } as Partial<AuthState>),

            // Reset seluruh state
            reset: () => set({ ...initialState, is_loading: false, is_error: false, message: '' }),

            // Logout
            logout: async () => {
                try {
                    await signOut(auth);
                    set({
                        user: { id: '', email: '', full_name: '', role: '', nip: '' },
                        full_name: '',
                        email: '',
                        nip: '',
                        password: '',
                        current_password: '',
                        role: 'operator',
                        is_loading: false,
                        is_error: false,
                        message: 'Logout successfully'
                    });
                    // Redirect ke halaman login
                    setTimeout(() => window.location.href = '/login', 2000);
                } catch (error) {
                    console.error("Logout error:", error);
                    set({ is_error: true, message: 'Logout failed' });
                    setTimeout(() => set({ is_error: false, message: '' }), 3000);
                }
            },

            // Register
            register: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { full_name, email, nip, password, role } = get();
                set({ is_loading: true, is_error: false, message: '' });

                try {
                    const user_role = role || 'operator';
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    const uid = userCredential.user.uid;

                    await setDoc(doc(db, "officers", uid), {
                        full_name,
                        email,
                        nip,
                        role: user_role,
                        createdAt: new Date()
                    });

                    set({ is_error: false, message: 'Account created successfully' });
                    setTimeout(() => window.location.href = '/', 2000);
                } catch (error) {
                    console.error("Register error:", error);
                    if (error instanceof Error) {
                        const firebaseCode = (error as any).code || '';
                        const message = firebaseCode === 'auth/email-already-in-use' ? 'EMAIL_EXISTS' : error.message;
                        set({ is_error: true, message });
                        setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    }
                } finally {
                    set({ is_loading: false });
                }
            },

            // Login
            login: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { email, password } = get();
                set({ is_loading: true, is_error: false, message: '' });

                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    const uid = userCredential.user.uid;

                    const userDoc = await getDoc(doc(db, "officers", uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        set({
                            user: { id: uid, email: data.email, full_name: data.full_name, role: data.role, nip: data.nip },
                            role: data.role,
                            nip: data.nip
                        });
                    }

                    set({ is_error: false, message: 'Login successfully', password: '' });
                    setTimeout(() => window.location.href = '/dashboard', 2000);
                } catch (error) {
                    console.error("Login error:", error);
                    if (error instanceof Error) {
                        const firebaseCode = (error as any).code || '';
                        let message = '';
                        switch (firebaseCode) {
                            case 'auth/user-not-found':
                                message = 'USER_NOT_FOUND';
                                break;
                            case 'auth/wrong-password':
                                message = 'INVALID_PASSWORD';
                                break;
                            default:
                                message = error.message;
                        }
                        set({ is_error: true, message });
                        setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    }
                } finally {
                    set({ is_loading: false });
                }
            },

            // Get account
            get_account: async () => {
                const { user, setField } = get();
                try {
                    if (!user.id) throw new Error("User not logged in");

                    const userDoc = await getDoc(doc(db, "officers", user.id));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setField("full_name", data.full_name || '');
                        setField("role", data.role || 'operator');
                        setField("nip", data.nip || '');
                    } else {
                        throw new Error("User data not found in Firestore");
                    }
                } catch (error) {
                    console.error("Get account error:", error);
                    if (error instanceof Error) {
                        set({ is_error: true, message: error.message });
                        setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    }
                }
            },

            // Update account (full_name)
            update_account: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { user, full_name, setField } = get();

                try {
                    if (!user.id) throw new Error("User not logged in");

                    const docRef = doc(db, "officers", user.id);
                    await updateDoc(docRef, {
                        full_name,
                        updatedAt: new Date()
                    });

                    setField("full_name", full_name);
                    set({ is_error: false, message: "Account updated successfully" });
                    setTimeout(() => set({ is_error: false, message: '' }), 3000);
                } catch (error) {
                    console.error("Update account error:", error);
                    if (error instanceof Error) {
                        set({ is_error: true, message: error.message });
                        setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    }
                }
            },

            // Update password
            update_password: async (e?: React.FormEvent) => {
                e?.preventDefault();
                const { user, current_password, password } = get();
                set({ is_loading: true, is_error: false, message: '' });

                try {
                    if (!auth.currentUser) throw new Error("User not logged in");

                    const credential = EmailAuthProvider.credential(user.email, current_password);
                    await reauthenticateWithCredential(auth.currentUser, credential);

                    await updatePassword(auth.currentUser, password);

                    set({ is_error: false, message: "Password updated successfully", password: '', current_password: '' });
                    setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    console.log("Password updated successfully");
                } catch (error) {
                    console.error("Update password error:", error);
                    if (error instanceof Error) {
                        const firebaseCode = (error as any).code || '';
                        let message = '';
                        switch (firebaseCode) {
                            case 'auth/wrong-password':
                                message = 'CURRENT_PASSWORD_INVALID';
                                break;
                            case 'auth/weak-password':
                                message = 'PASSWORD_TOO_WEAK';
                                break;
                            default:
                                message = error.message;
                        }
                        set({ is_error: true, message });
                        setTimeout(() => set({ is_error: false, message: '' }), 3000);
                    }
                } finally {
                    set({ is_loading: false });
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
