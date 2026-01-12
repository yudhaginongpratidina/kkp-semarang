import { Link } from "react-router-dom";
import { FaWhatsapp, FaEye, FaBuilding, FaBriefcase, FaSearch } from "react-icons/fa";

export default function TableHistory() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full">
                <div className="relative mb-6">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Cari nama, posisi, atau perusahaan..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                    />
                </div>
                <div className="bg-white rounded-sm shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-linear-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                                    <th className="p-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Informasi Pengunjung</span>
                                        </div>
                                    </th>
                                    <th className="p-4 text-left">
                                        <div className="flex items-center gap-2">
                                            <FaWhatsapp className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">WhatsApp</span>
                                        </div>
                                    </th>
                                    <th className="p-4 text-center">
                                        <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <ItemData
                                    id="1"
                                    full_name="Ahmad Santoso"
                                    position="Software Engineer"
                                    company="PT. Gojek Indonesia"
                                    phone="08123456789"
                                />
                                <ItemData
                                    id="2"
                                    full_name="Siti Nurhaliza"
                                    position="Product Manager"
                                    company="PT. Tokopedia"
                                    phone="08234567890"
                                />
                                <ItemData
                                    id="3"
                                    full_name="Budi Prasetyo"
                                    position="UI/UX Designer"
                                    company="PT. Bukalapak"
                                    phone="08345678901"
                                />
                                <ItemData
                                    id="4"
                                    full_name="Dewi Lestari"
                                    position="Data Scientist"
                                    company="PT. Traveloka"
                                    phone="08456789012"
                                />
                                <ItemData
                                    id="5"
                                    full_name="Rudi Hermawan"
                                    position="Backend Developer"
                                    company="PT. Shopee Indonesia"
                                    phone="08567890123"
                                />
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <p className="text-sm text-slate-600">
                                Menampilkan <span className="font-semibold text-slate-800">1-5</span> dari <span className="font-semibold text-slate-800">50</span> data
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-sm font-medium hover:bg-slate-50 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="px-3 py-2 bg-blue-600 text-white rounded-sm font-medium hover:bg-blue-700 transition-all duration-200 text-sm">
                                    1
                                </button>
                                <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-sm font-medium hover:bg-slate-50 transition-all duration-200 text-sm">
                                    2
                                </button>
                                <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-sm font-medium hover:bg-slate-50 transition-all duration-200 text-sm">
                                    3
                                </button>
                                <button className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-sm font-medium hover:bg-slate-50 transition-all duration-200 text-sm">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ItemData = ({ id, full_name, position, company, phone }: {id:string, full_name: string, position: string, company: string, phone: string }) => {
    const initial = full_name.charAt(0).toUpperCase();
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
    const colorIndex = full_name.charCodeAt(0) % colors.length;

    return (
        <tr className="group border-b border-slate-100 hover:bg-slate-50 transition-all duration-200">
            <td className="p-4">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex justify-center items-center rounded-sm ${colors[colorIndex]} text-white font-bold text-lg shadow-sm shrink-0`}>
                        {initial}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="font-semibold text-slate-800 text-sm truncate">{full_name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <FaBriefcase className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{position}</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                <FaBuilding className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{company}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-sm hover:bg-green-100 transition-all duration-200 font-medium text-sm border border-green-200"
                >
                    <FaWhatsapp className="w-4 h-4" />
                    <span>{phone}</span>
                </a>
            </td>
            <td className="p-4">
                <div className="flex items-center justify-center gap-2">
                    <Link
                        to={`/history/${id}`}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-sm hover:bg-blue-100 transition-all duration-200 font-medium text-sm border border-blue-200 flex items-center gap-2 opacity-70 group-hover:opacity-100"
                        title="Lihat Detail"
                    >
                        <FaEye className="w-4 h-4" />
                        Detail
                    </Link>
                </div>
            </td>
        </tr>
    )
}