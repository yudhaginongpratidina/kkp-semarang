// react
import { useEffect } from "react";
import z from "zod";

// stores
import { useAuthStore, useQueueStore, useModalStore } from "../../stores";

// components
import { FormControl, TextField, Button } from "../../components";

export default function SMKHPQueueDetail({ token }: { token: string }) {
    // Ambil data user dari AuthStore
    const { user } = useAuthStore();
    const { close } = useModalStore();
    const {
        smkhp_detail,
        getSMKHPByToken,
        isLoading,
        petugas,
        setField,
        setPetugas,
        updateSMKHPHandle
    } = useQueueStore();

    // 1. SINKRONISASI: Masukkan data user (nama & nip) ke dalam QueueStore
    // Ini memastikan saat updateSMKHPHandle dipanggil, data tidak undefined
    useEffect(() => {
        if (user?.full_name && user?.nip) {
            setPetugas(user.full_name, user.nip);
        }
    }, [user, setPetugas]);

    // 2. Fetch data detail antrian berdasarkan token
    useEffect(() => {
        if (token) {
            getSMKHPByToken(token);
        }
    }, [token, getSMKHPByToken]);

    if (isLoading) {
        return <div className="p-4 text-center text-blue-600 font-medium italic">Mengambil data antrian...</div>;
    }

    if (!smkhp_detail) {
        return <div className="p-4 text-center text-red-500 font-medium">Data antrian tidak ditemukan.</div>;
    }

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // updateSMKHPHandle akan secara internal mengambil petugas.nama dan petugas.nip dari state
            await updateSMKHPHandle(smkhp_detail.token, petugas.catatan_petugas);

            // Reset catatan saja agar form bersih untuk penggunaan berikutnya
            setField("petugas", { ...petugas, catatan_petugas: "" });

            // Tutup modal detail
            close();
        } catch (error) {
            console.error("Gagal menyelesaikan antrian:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 p-2">
                {/* Bagian Atas: Info Antrian */}
                <div className="border-b border-blue-100 pb-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Informasi Antrian</p>
                    <h1 className="text-2xl font-black text-blue-700">
                        {formatQueueNumber(smkhp_detail.queueNo, "smkhp")}
                    </h1>
                </div>

                {/* Data Identitas User */}
                <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">Nama Pengguna</p>
                        <p className="text-slate-700 font-bold">{smkhp_detail.userName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-blue-400 font-bold uppercase">NPWP</p>
                        <p className="text-slate-700 font-mono text-sm">{smkhp_detail.npwp}</p>
                    </div>
                </div>

                {/* Input Form Petugas */}
                <FormControl onSubmit={handleComplete}>
                    <div className="space-y-4 mt-2">
                        {/* Nama Petugas (Otomatis dari useAuthStore via useEffect) */}
                        <TextField
                            type="text"
                            label="Petugas Penanggung Jawab"
                            disabled={true}
                            controller={{
                                value: petugas.nama || "", // Diambil dari state petugas di QueueStore
                                onChange: () => { }
                            }}
                            id={"petugas"} required={false} schema={z.string()} />

                        {/* NIP Petugas (Otomatis dari useAuthStore via useEffect) */}
                        <TextField
                            type="text"
                            label="NIP Petugas"
                            disabled={true}
                            controller={{
                                value: petugas.nip || "", // Diambil dari state petugas di QueueStore
                                onChange: () => { }
                            }}
                            id={"nip_petugas"} required={false} schema={z.string()}
                        />

                        {/* Catatan Petugas (Manual Input) */}
                        <TextField
                            type="text"
                            required={false}
                            id="catatan_petugas"
                            label="Catatan Petugas"
                            placeholder="Masukkan catatan..."
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
                            Selesaikan & Simpan
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