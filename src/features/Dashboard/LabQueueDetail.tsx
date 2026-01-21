// react
import { useEffect } from "react";
import z from "zod";

// stores
import { useAuthStore, useQueueStore, useModalStore } from "../../stores";

// components
import { FormControl, TextField, Button } from "../../components";

export default function LabQueueDetail({ token }: { token: string }) {
    // Ambil data user dari AuthStore
    const { user } = useAuthStore();
    const { close } = useModalStore();
    const {
        getLaboratoriumByToken,
        laboratorium_detail, // Gunakan detail laboratorium
        isLoading,
        petugas,  
        setField,
        setPetugas,
        updateLaboratoriumHandle // Gunakan handle laboratorium
    } = useQueueStore();

    // 1. SINKRONISASI: Masukkan data user (nama & nip) ke dalam QueueStore
    useEffect(() => {
        if (user?.full_name && user?.nip) {
            setPetugas(user.full_name, user.nip);
        }
    }, [user, setPetugas]);

    // 2. Fetch data detail antrian LAB berdasarkan token
    useEffect(() => {
        if (token) {
            getLaboratoriumByToken(token);
        }
    }, [token, getLaboratoriumByToken]);

    if (isLoading) {
        return <div className="p-4 text-center text-blue-600 font-medium italic">Mengambil data antrian lab...</div>;
    }

    // Perbaikan pengecekan data detail agar merujuk ke lab detail
    if (!laboratorium_detail) {
        return <div className="p-4 text-center text-red-500 font-medium">Data antrian Lab tidak ditemukan.</div>;
    }

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Gunakan handle khusus Laboratorium
            await updateLaboratoriumHandle(laboratorium_detail.token, petugas.catatan_petugas);

            // Reset catatan agar form bersih
            setField("petugas", { ...petugas, catatan_petugas: "" });

            // Tutup modal
            close();
        } catch (error) {
            console.error("Gagal menyelesaikan antrian Lab:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 p-2">
                {/* Bagian Atas: Info Antrian */}
                <div className="border-b border-blue-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Informasi Antrian Laboratorium</p>
                    <h1 className="text-2xl font-black text-blue-700">
                        {formatQueueNumber(laboratorium_detail.queueNo, "lab")}
                    </h1>
                </div>

                {/* Data Identitas User & NPWP */}
                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Nama Pengguna</p>
                        <p className="text-slate-700 font-bold">{laboratorium_detail.userName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">NPWP</p>
                        <p className="text-slate-700 font-mono text-sm">{laboratorium_detail.npwp}</p>
                    </div>
                </div>

                {/* Info Tambahan Lab (Jenis, UPI, WA) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                    <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Jenis Komoditas</p>
                        <p className="text-slate-700 font-bold text-sm">{laboratorium_detail.jenis}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">No. UPI</p>
                        <p className="text-slate-700 font-mono text-sm">{laboratorium_detail.upi}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">No. WhatsApp</p>
                        <p className="text-slate-700 text-sm">{laboratorium_detail.wa}</p>
                    </div>
                </div>

                {/* Input Form Petugas */}
                <FormControl onSubmit={handleComplete}>
                    <div className="space-y-4 mt-2">
                        <TextField
                            type="text"
                            label="Petugas Laboratorium"
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
                            label="Catatan Hasil Pengujian / Keterangan"
                            placeholder="Masukkan hasil ringkas pengujian atau catatan..."
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
                            Selesaikan & Simpan Hasil Lab
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