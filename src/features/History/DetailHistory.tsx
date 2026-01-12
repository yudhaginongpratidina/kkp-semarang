import { useState } from "react";
import { MdDateRange, MdPerson, MdLocationOn, MdFingerprint } from "react-icons/md";
import { FaEye, FaArrowLeft } from "react-icons/fa";

export default function DetailHistory() {
    const [selectedHistory, setSelectedHistory] = useState<any>(null);

    const historyData = [
        {
            id: 1,
            date: "10 Oktober 2023",
            service: "SMKHP",
            status: "SELESAI",
            statusColor: "bg-green-500",
            notes: "Pemeriksaan kesehatan lengkap telah selesai dilakukan",
            doctor: "Supriyanto"
        },
        {
            id: 2,
            date: "15 September 2023",
            service: "Laboratorium",
            status: "SELESAI",
            statusColor: "bg-green-500",
            notes: "Hasil lab menunjukkan kondisi normal",
            testType: "Tes Hiu"
        },
        {
            id: 3,
            date: "20 Agustus 2023",
            service: "Customer Service",
            status: "SELESAI",
            statusColor: "bg-green-500",
            notes: "Konsultasi terkait jadwal pemeriksaan",
            officer: "Rina Permata"
        },
        {
            id: 4,
            date: "05 Agustus 2023",
            service: "Laboratorium",
            status: "DIBATALKAN",
            statusColor: "bg-red-500",
            notes: "Orang tidak hadir pada jadwal yang ditentukan",
            testType: "Tes Daging"
        }
    ];

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            {!selectedHistory ? (
                <div className="w-full mx-auto flex flex-col gap-4">
                    {/* Card Info Pengguna */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Informasi Pengguna
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <MdFingerprint className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-[120px]">NIK</span>
                                    <span className="text-sm text-gray-800">: 0000000000</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdPerson className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-[120px]">Nama Lengkap</span>
                                    <span className="text-sm text-gray-800">: Silent Hil</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdLocationOn className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-[120px]">Alamat</span>
                                    <span className="text-sm text-gray-800">: Jln Kenangan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Riwayat Table */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Riwayat Layanan
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">No</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Jenis Layanan</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((history, index) => (
                                        <tr key={history.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                                            <td className="py-3 px-4 text-gray-700">
                                                <div className="flex items-center gap-2">
                                                    <MdDateRange className="w-4 h-4 text-gray-500" />
                                                    <span>{history.date}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-800 font-medium">{history.service}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-sm ${history.statusColor} text-white text-xs font-medium`}>
                                                    {history.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => setSelectedHistory(history)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-xs font-medium transition-colors duration-200"
                                                >
                                                    <FaEye className="w-3 h-3" />
                                                    <span>Detail</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full mx-auto flex flex-col gap-4">
                    {/* Tombol Kembali */}
                    <button
                        onClick={() => setSelectedHistory(null)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Riwayat</span>
                    </button>

                    {/* Card Info Pengguna */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Informasi Pengguna
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <MdFingerprint className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-30">NIK</span>
                                    <span className="text-sm text-gray-800">: 0000000000</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdPerson className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-30">Nama Lengkap</span>
                                    <span className="text-sm text-gray-800">: Silent Hil</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <MdLocationOn className="w-5 h-5 text-blue-600" />
                                <div className="flex gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-30">Alamat</span>
                                    <span className="text-sm text-gray-800">: Jln Kenangan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card Detail Layanan */}
                    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                            Detail Layanan
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-medium text-gray-600 min-w-35">Tanggal</span>
                                <span className="text-sm text-gray-800">: {selectedHistory.date}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-medium text-gray-600 min-w-35">Jenis Layanan</span>
                                <span className="text-sm text-gray-800">: {selectedHistory.service}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-medium text-gray-600 min-w-35">Status</span>
                                <span className={`px-3 py-1 rounded-sm ${selectedHistory.statusColor} text-white text-xs font-medium`}>
                                    {selectedHistory.status}
                                </span>
                            </div>
                            {selectedHistory.doctor && (
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-35">Dokter</span>
                                    <span className="text-sm text-gray-800">: {selectedHistory.doctor}</span>
                                </div>
                            )}
                            {selectedHistory.testType && (
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-35">Jenis Tes</span>
                                    <span className="text-sm text-gray-800">: {selectedHistory.testType}</span>
                                </div>
                            )}
                            {selectedHistory.officer && (
                                <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-gray-600 min-w-35">Petugas</span>
                                    <span className="text-sm text-gray-800">: {selectedHistory.officer}</span>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <span className="text-sm font-medium text-gray-600 min-w-35">Catatan</span>
                                <span className="text-sm text-gray-800">: {selectedHistory.notes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}