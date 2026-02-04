// libraries
import { Link, useLocation } from "react-router-dom"
import { useAuthStore } from "../../stores";
import { FaHome, FaHistory, FaUser, FaUserCog, FaUserSecret } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

export default function KPPSidebar() {
    const { logout, user } = useAuthStore()

    return (
        <aside className="sticky top-0 left-0 w-20 md:w-64 min-h-screen h-fit bg-[#F8FAFC] border-r border-slate-300 flex flex-col font-mono">
            <div className="w-full h-16 px-4 flex items-center gap-3 bg-slate-800 text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rotate-45 translate-x-8 -translate-y-8"></div>
                <img src="./logo.png" alt="Logo" className="w-8 h-8 object-contain brightness-200 grayscale" />
                <div className="hidden md:block">
                    <h1 className="text-xs font-black tracking-tighter leading-none uppercase">
                        KPP RI <span className="text-slate-400">SMG</span>
                    </h1>
                    <p className="text-[8px] text-slate-400 mt-1 uppercase tracking-[0.2em]">Terminal Interface</p>
                </div>
            </div>

            {/* User Profile Snippet */}
            <div className="hidden md:flex p-4 bg-slate-100 border-b border-slate-200 items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold border border-slate-600">
                    {user.full_name?.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-slate-800 truncate uppercase">{user.full_name}</p>
                    <p className="text-[9px] text-slate-500 truncate uppercase tracking-tighter">{user.role}</p>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 flex flex-col py-4 px-2 gap-1">
                <p className="hidden md:block text-[9px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-widest">Main Module</p>
                
                <Item href="/dashboard" icon={<FaHome />} title="Dashboard" />
                <Item href="/history" icon={<FaHistory />} title="Access History" />

                <div className="my-2 border-t border-slate-200"></div>
                <p className="hidden md:block text-[9px] font-bold text-slate-400 px-3 mb-2 uppercase tracking-widest">Management</p>

                {user.role === "superuser" && (
                    <Item href="/user-management" icon={<FaUserCog />} title="Staff Control" />
                )}
                
                {(user.role === "customer_service" || user.role === "superuser") && (
                    <Item href="/traders-management" icon={<FaUserSecret />} title="Traders Registry" />
                )}

                <div className="mt-auto flex flex-col gap-1">
                    <Item href="/account" icon={<FaUser />} title="Security Settings" />
                    
                    <button 
                        onClick={logout} 
                        className="group w-full h-11 flex justify-center md:justify-start items-center gap-3 px-3 rounded-sm transition-all duration-200 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-transparent hover:border-red-100"
                    >
                        <div className="w-5 h-5 flex justify-center items-center transition-transform group-hover:-translate-x-1">
                            <IoLogOut className="w-5 h-5" />
                        </div>
                        <span className="hidden md:block capitalize text-[11px] font-bold tracking-wider">End Session</span>
                    </button>
                </div>
            </nav>

            {/* Footer Status */}
            <div className="hidden md:block p-3 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">System Link: Stable</span>
                </div>
            </div>
        </aside>
    )
}

const Item = ({ href, icon, title }: { href: string, icon: React.ReactNode, title: string }) => {
    const location = useLocation()
    const isActive = location.pathname === href

    return (
        <Link 
            to={href} 
            className={`
                group w-full h-11 flex justify-center md:justify-start items-center gap-3 px-3 rounded-sm transition-all duration-150 border
                ${isActive 
                    ? "bg-slate-800 text-white border-slate-900 shadow-md" 
                    : "text-slate-600 hover:bg-slate-200 border-transparent hover:border-slate-300"
                }
            `}
        >
            <div className={`w-5 h-5 flex justify-center items-center ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`}>
                {icon}
            </div>
            <span className={`hidden md:block capitalize text-[11px] font-bold tracking-wider ${isActive ? "text-white" : "text-slate-600"}`}>
                {title}
            </span>
            {isActive && (
                <div className="ml-auto hidden md:block w-1 h-4 bg-white/30 rounded-full"></div>
            )}
        </Link>
    )
}