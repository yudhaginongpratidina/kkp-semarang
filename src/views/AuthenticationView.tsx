// libraries
import { useLocation } from "react-router-dom"

// features
import { LoginForm, RegisterForm } from "../features/Authentication"

export default function AuthenticationView() {
    const location = useLocation()

    return (
        <main className="w-full min-h-screen p-4 flex flex-col justify-center items-center gap-2 bg-white">
            <div className="w-full max-w-xl flex items-center gap-4">
                <img src="./logo.png" alt="Logo Kementerian" className="w-28 h-28 object-contain" />
                <div className="flex-1 flex flex-col gap-2">
                    <h1 className="uppercase text-lg font-bold tracking-wide leading-tight">
                        Kementerian Kelautan dan Perikanan
                        <br />
                        Republik Indonesia
                    </h1>
                </div>
            </div>
            <div className="w-full max-w-xl p-4 border rounded-sm border-slate-300 bg-white">
                {(location.pathname === "/" || location.pathname === "/login") && <LoginForm />}
                {location.pathname === "/create-account" && <RegisterForm />}
            </div>
        </main>
    )
}