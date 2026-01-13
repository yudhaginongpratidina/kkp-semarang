import { useState } from "react";
import BarcodeScanner from "react-qr-barcode-scanner";

export default function ScanQRDashboard() {
    const [data, setData] = useState("Belum ada data");
    const [scanning, setScanning] = useState(true);

    const handleUpdate = (_: any, result: any) => {
        if (result) {
            setData(result.getText());
            setScanning(false); // hentikan scanner setelah dapat data
        }
    };

    return (
        <div className="w-full min-h-screen p-4 bg-gray-100 flex justify-center items-start">
            <div className="w-full flex flex-col md:flex-row gap-6">

                {/* Scanner Card */}
                <div className="flex-1 bg-white shadow-lg rounded-sm p-4 flex justify-center items-center">
                    {scanning ? (
                        <BarcodeScanner
                            width={400}
                            height={400}
                            onUpdate={handleUpdate}
                        />
                    ) : (
                        <p className="text-gray-500 text-center">Scan selesai</p>
                    )}
                </div>

                {/* Data Hasil Scan */}
                <div className="flex-1 bg-white shadow-sm rounded-sm p-6 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-semibold mb-4">Hasil Scan</h2>
                    <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        {data}
                    </div>
                    {!scanning && (
                        <button
                            onClick={() => { setScanning(true); setData("Belum ada data"); }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Scan Lagi
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
