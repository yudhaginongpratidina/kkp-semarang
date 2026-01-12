// libraries
import { useLocation } from "react-router-dom"

// features
import { LoginForm, RegisterForm } from "../features/Authentication"

export default function AuthenticationView() {
    const location = useLocation()

    return (
        <main className="w-full min-h-screen p-4 flex flex-col justify-center items-center gap-2 bg-white">
            <div className="w-full max-w-xl flex items-center">
                <img src="./logo.png" alt="Logo Kementerian" className="w-20 h-20 sm:w-28 sm:h-20 object-contain" />
                <div className="">
                    <h1 className="uppercase text-base sm:text-lg font-bold">
                        Kementerian Kelautan dan Perikanan
                    </h1>
                    <h2 className="uppercase text-sm sm:text-base font-semibold text-gray-700">
                        Republik Indonesia | Kota Semarang
                    </h2>
                </div>
            </div>

            <div className="w-full max-w-xl p-4 border rounded-sm border-slate-300 bg-white">
                {(location.pathname === "/" || location.pathname === "/login") && <LoginForm />}
                {location.pathname === "/create-account" && <RegisterForm />}
            </div>
        </main>
    )
}