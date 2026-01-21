// react
import { useEffect } from "react";
import z from "zod";

// stores
import { useAuthStore, useQueueStore, useModalStore } from "../../stores";

// components
import { FormControl, TextField, Button } from "../../components";

export default function CustomerServiceQueueDetail({ token }: { token: string }) {
    // Ambil data user dari AuthStore
    const { user } = useAuthStore();
    const { close } = useModalStore();
    const {
        getCustomerServiceByToken,
        customer_service_detail, // Gunakan detail yang benar
        isLoading,
        petugas,
        setField,
        setPetugas,
        updateCustomerServiceHandle // Gunakan handle CS
    } = useQueueStore();

    // 1. SINKRONISASI: Masukkan data user (nama & nip) ke dalam QueueStore
    useEffect(() => {
        if (user?.full_name && user?.nip) {
            setPetugas(user.full_name, user.nip);
        }
    }, [user, setPetugas]);

    // 2. Fetch data detail antrian berdasarkan token
    useEffect(() => {
        if (token) {
            getCustomerServiceByToken(token);
        }
    }, [token, getCustomerServiceByToken]);

    if (isLoading) {
        return <div className="p-4 text-center text-blue-600 font-medium italic">Mengambil data antrian...</div>;
    }

    // Perbaikan pengecekan data detail
    if (!customer_service_detail) {
        return <div className="p-4 text-center text-red-500 font-medium">Data antrian tidak ditemukan.</div>;
    }

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Gunakan handle khusus Customer Service
            await updateCustomerServiceHandle(customer_service_detail.token, petugas.catatan_petugas);

            // Reset catatan agar form bersih
            setField("petugas", { ...petugas, catatan_petugas: "" });

            // Tutup modal
            close();
        } catch (error) {
            console.error("Gagal menyelesaikan antrian CS:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 p-2">
                {/* Bagian Atas: Info Antrian */}
                <div className="border-b border-blue-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Informasi Antrian CS</p>
                    <h1 className="text-2xl font-black text-blue-700">
                        {formatQueueNumber(customer_service_detail.queueNo, "cs")}
                    </h1>
                </div>

                {/* Data Identitas User */}
                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Nama Pengguna</p>
                        <p className="text-slate-700 font-bold">{customer_service_detail.userName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">NPWP</p>
                        <p className="text-slate-700 font-mono text-sm">{customer_service_detail.npwp}</p>
                    </div>
                </div>

                {/* Tampilan Keluhan (Data Baru) */}
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-amber-600 font-bold uppercase">Keluhan / Aspirasi</p>
                    <p className="text-slate-700 text-sm mt-1 italic">
                        "{customer_service_detail.keluhan || "Tidak ada keluhan tertulis."}"
                    </p>
                </div>

                {/* Input Form Petugas */}
                <FormControl onSubmit={handleComplete}>
                    <div className="space-y-4 mt-2">
                        <TextField
                            type="text"
                            label="Petugas Penanggung Jawab"
                            disabled={true}
                            controller={{
                                value: petugas.nama || "",
                                onChange: () => { }
                            }}
                            id={"petugas"} required={false} schema={z.string()} 
                        />

                        <TextField
                            type="text"
                            label="NIP Petugas"
                            disabled={true}
                            controller={{
                                value: petugas.nip || "",
                                onChange: () => { }
                            }}
                            id={"nip_petugas"} required={false} schema={z.string()}
                        />

                        <TextField
                            type="text"
                            required={false}
                            id="catatan_petugas"
                            label="Catatan & Solusi Petugas"
                            placeholder="Masukkan solusi atau tindakan yang diambil..."
                            schema={z.string()}
                            controller={{
                                value: petugas.catatan_petugas || "",
                                onChange: (e) => setField("petugas", {
                                    ...petugas,
                                    catatan_petugas: e.target.value
                                })
                            }}
                        />
                    </div>

                    <div className="w-full flex justify-end mt-8">
                        <Button
                            type="submit"
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            Selesaikan & Simpan ke History
                        </Button>
                    </div>
                </FormControl>
            </div>
        </div>
    );
}

const formatQueueNumber = (queue: number, type: string) => {
    let prefix = "A";
    const lower = type.toLowerCase();
    if (lower.includes("laboratorium") || lower.includes("lab")) prefix = "B";
    else if (lower.includes("customer") || lower.includes("cs")) prefix = "C";
    return `#${prefix}${queue.toString().padStart(3, "0")}`;
};