// libraries
import { Link, useLocation } from "react-router-dom"
import { FaHome, FaChartBar } from "react-icons/fa";

export default function TabDashboard() {
    return (
        <div className="w-full px-4 mb-2 flex items-center gap-1 border-b border-slate-300">
            <Item href="/dashboard" icon={<FaHome />} title="QUEUE_MONITOR" />
            <Item href="/dashboard/analytics" icon={<FaChartBar />} title="DATA_ANALYTICS" />
            
            {/* Decorative Element */}
            <div className="ml-auto flex gap-1 opacity-20">
                <div className="w-1 h-4 bg-slate-400"></div>
                <div className="w-1 h-4 bg-slate-400"></div>
            </div>
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
        <Link 
            to={href} 
            className={`
                relative h-12 px-6 flex items-center gap-3 transition-all duration-200 group
                ${isActive 
                    ? "text-slate-900" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}
            `}
        >
            <span className={`text-lg ${isActive ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}>
                {icon}
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {title}
            </span>

            {/* Active Indicator: Bottom Bar */}
            {isActive && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800 animate-in fade-in slide-in-from-bottom-1" />
            )}
            
            {/* Active Indicator: Top Notch */}
            {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-slate-800/30" />
            )}
        </Link>
    )
}