import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores'
import { auth } from '../configs/firebase'
import { onAuthStateChanged } from "firebase/auth"

type Props = {
    children: React.ReactNode
    allowedRoles?: string[]
    publicOnly?: boolean // jika halaman hanya untuk guest (login/register)
}

const AuthGuard = ({ children, allowedRoles, publicOnly }: Props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const user = useAuthStore(state => state.user)
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            // jika user belum login
            if (!firebaseUser || !user.id) {
                if (publicOnly) {
                    // halaman guest → tetap bisa diakses
                    setIsAuthorized(true)
                } else {
                    // halaman private → redirect ke login
                    navigate('/login', { replace: true })
                    setIsAuthorized(false)
                }
            } else {
                // user sudah login
                if (publicOnly) {
                    // redirect user yang sudah login dari halaman login/register ke dashboard
                    navigate('/dashboard', { replace: true })
                    setIsAuthorized(false)
                } else if (allowedRoles && !allowedRoles.includes(user.role)) {
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
    }, [user, navigate, allowedRoles, publicOnly, location.pathname])

    if (loading) return <div>Loading...</div>
    if (!isAuthorized) return null

    return <>{children}</>
}

export default AuthGuard
