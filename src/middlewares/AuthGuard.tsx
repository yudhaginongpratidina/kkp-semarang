import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import useAuthStore from '../features/Authentication/useAuthStore'
import { useAuthStore } from '../stores'
import { auth } from '../configs/firebase'
import { onAuthStateChanged } from "firebase/auth"

type Props = {
    children: React.ReactNode
    allowedRoles?: string[]
}

const AuthGuard = ({ children, allowedRoles }: Props) => {
    const navigate = useNavigate()
    const user = useAuthStore(state => state.user)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (!firebaseUser || !user.id) {
                // tidak login → redirect ke login
                navigate('/login', { replace: true })
                setIsAuthorized(false)
            } else {
                // login → cek role jika ada allowedRoles
                if (allowedRoles && !allowedRoles.includes(user.role)) {
                    // role tidak diizinkan → redirect ke dashboard
                    navigate('/dashboard', { replace: true })
                    setIsAuthorized(false)
                } else {
                    setIsAuthorized(true)
                }
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user, navigate, allowedRoles])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAuthorized) return null

    return <>{children}</>
}

export default AuthGuard
