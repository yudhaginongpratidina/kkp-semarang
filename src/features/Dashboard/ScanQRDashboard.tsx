// ScanQRDashboard.tsx
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";

export default function ScanQRDashboard() {
    const [data, setData] = useState("Belum ada data");
    const [scanning, setScanning] = useState(true);
    const [loadingCamera, setLoadingCamera] = useState(true);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        if (!scanning) return;

        const qrCodeRegionId = "qr-reader";
        const container = document.getElementById(qrCodeRegionId);
        if (container) container.innerHTML = ""; // bersihkan div sebelum scanner baru

        const html5QrCode = new Html5Qrcode(qrCodeRegionId);
        scannerRef.current = html5QrCode;
        setLoadingCamera(true);
        setCameraError(null);

        // coba kamera belakang dulu, fallback kamera depan jika gagal
        const config = { facingMode: { exact: "environment" } };

        html5QrCode.start(
            config,
            { fps: 10, qrbox: 250, disableFlip: false },
            (decodedText) => {
                setData(decodedText);
                setScanning(false);
                setLoadingCamera(false);
            },
            (errorMessage) => {
                console.warn("QR scan error:", errorMessage);
            }
        )
        .then(() => setLoadingCamera(false))
        .catch((err) => {
            console.warn("Gagal akses kamera belakang, coba depan:", err);
            // fallback kamera depan
            html5QrCode.start(
                { facingMode: "user" },
                { fps: 10, qrbox: 250, disableFlip: false },
                (decodedText) => {
                    setData(decodedText);
                    setScanning(false);
                    setLoadingCamera(false);
                },
                (errorMessage) => {
                    console.error("QR scan error kamera depan:", errorMessage);
                    setCameraError("Tidak bisa mengakses kamera");
                    setLoadingCamera(false);
                }
            ).catch(e => {
                console.error("Gagal start scanner:", e);
                setCameraError("Tidak bisa mengakses kamera");
                setLoadingCamera(false);
            });
        });

        // cleanup scanner
        return () => {
            if (scannerRef.current) {
                try {
                    if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
                        scannerRef.current.stop()
                            .then(() => scannerRef.current?.clear())
                            .catch(err => console.warn("Failed to stop scanner:", err));
                    }
                } catch (err) {
                    console.warn("Error checking scanner state:", err);
                }
            }
        };
    }, [scanning]);

    return (
        <div className="w-full min-h-screen p-4 bg-gray-100 flex justify-center items-start">
            <div className="w-full flex flex-col md:flex-row gap-6">

                {/* Scanner */}
                <div className="flex-1 bg-white shadow-lg rounded-sm p-4 flex justify-center items-center">
                    {loadingCamera && <p className="text-gray-500 text-center">Memulai kamera...</p>}
                    {cameraError && <p className="text-red-500">{cameraError}</p>}
                    {scanning && !cameraError && (
                        <div id="qr-reader" className="w-full max-w-md aspect-square" />
                    )}
                    {!scanning && <p className="text-gray-500 text-center">Scan selesai</p>}
                </div>

                {/* Hasil Scan */}
                <div className="flex-1 bg-white shadow-sm rounded-sm p-6 flex flex-col justify-center items-center">
                    <h2 className="text-xl font-semibold mb-4">Hasil Scan</h2>
                    <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                        {data}
                    </div>
                    {!scanning && (
                        <button
                            onClick={() => {
                                setData("Belum ada data");
                                setScanning(true);
                            }}
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
