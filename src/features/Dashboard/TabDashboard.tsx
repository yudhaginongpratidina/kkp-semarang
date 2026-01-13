// libraries
import { Link, useLocation } from "react-router-dom"

// icons
import { FaHome } from "react-icons/fa";
import { IoMdAnalytics } from "react-icons/io";
import { BsQrCodeScan } from "react-icons/bs";

export default function TabDashboard() {
    return (
        <div className="w-full p-4 flex items-center gap-2">
            <Item href="/dashboard" icon={<FaHome className="w-6 h-6" />} title="Antrian" />
            <Item href="/dashboard/scanner" icon={<BsQrCodeScan className="w-6 h-6" />} title="Scan QR" />
            <Item href="/dashboard/analytics" icon={<IoMdAnalytics className="w-6 h-6" />} title="Analisis" />
        </div>
    )
}

type ItemProps = {
    href: string
    icon: React.ReactNode
    title: string
}

const Item = ({ href, icon, title }: ItemProps) => {
    const location = useLocation()
    const isActive = location.pathname === href
    return (
        <Link to={href} className={`h-10 px-6 flex items-center gap-4 rounded-sm transition 
            ${isActive ? "bg-blue-600 text-white shadow" : "bg-blue-400 text-white hover:bg-blue-500/80"}`}
        >
            {icon}
            <span className="text-sm font-semibold">{title}</span>
        </Link>
    )
}
