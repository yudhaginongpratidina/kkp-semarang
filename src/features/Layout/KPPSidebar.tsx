// libraries
import { Link, useLocation } from "react-router-dom"

// icons
import { FaHome, FaHistory, FaUser } from "react-icons/fa";

export default function KPPSidebar() {
    return (
        <aside className="w-20 md:w-full md:max-w-xs min-h-screen bg-white">
            <div className="w-full h-14 px-4 flex items-center gap-2 bg-slate-100">
                <img src="./logo.png" alt="Logo Kementerian" className="w-12 h-12 object-contain" />
                <h1 className="hidden md:block text-md font-semibold tracking-wide leading-tight">
                    KPP RI | SEMARANG
                </h1>
            </div>
            <div className="w-full md:px-4 md:py-2 flex flex-col">
                <Item
                    href="/dashboard"
                    icon={<FaHome className="w-5 h-5" />}
                    title="dashboard"
                />
                <Item
                    href="/history"
                    icon={<FaHistory className="w-5 h-5" />}
                    title="history"
                />
                <Item
                    href="/account"
                    icon={<FaUser className="w-5 h-5" />}
                    title="account"
                />
            </div>
        </aside>
    )
}

const Item = ({ href, icon, title }: { href: string, icon: React.ReactNode, title: string }) => {
    const location = useLocation()

    return (
        <Link to={href} className="w-full h-14 md:p-0.5 flex justify-center md:justify-start items-center hover:rounded-sm hover:bg-slate-100">
            <div className={`w-12 h-12 flex justify-center items-center ${location.pathname === href ? "text-blue-500" : "text-slate-700"}`}>{icon}</div>
            <h1 className={`hidden md:block capitalize font-semibold ${location.pathname === href ? "text-blue-500" : "text-slate-700"}`}>{title}</h1>
        </Link>
    )
}