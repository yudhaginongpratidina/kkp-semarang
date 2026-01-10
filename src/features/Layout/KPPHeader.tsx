// libraries
import { useLocation } from "react-router-dom"

export default function KPPHeader() {
    const location = useLocation()

    return (
        <header className="w-full h-14 px-4 flex items-center border-b sticky top-0 border-slate-300 bg-blue-500">
            {location.pathname === "/dashboard" && <h1 className="text-white text-lg font-bold uppercase">dashboard</h1>}
            {location.pathname === "/history" && <h1 className="text-white text-lg font-bold uppercase">history</h1>}
            {location.pathname === "/account" && <h1 className="text-white text-lg font-bold uppercase">account</h1>}
        </header>
    )
}