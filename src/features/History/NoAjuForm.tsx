import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useNoAjuStore, type NoAjuItem } from "../../stores/useNoAjuStore";
import { FormControl, TextField, Button } from "../../components"; // Kembali menggunakan komponen internal
import { FaPlus, FaTerminal } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const noAjuSchema = z.array(
    z.object({
        noAju: z.string().min(5, "Nomor AJU minimal 5 karakter"),
        expiredAju: z.string().min(1, "Batas waktu wajib diisi")
    })
).min(1, "Minimal harus ada satu data");

export default function NoAjuForm({ type }: { type: "create" | "update" }) {
    const { id: uid } = useParams();
    const {
        noAjuItems,
        upsert_no_aju,
        get_no_aju_by_uid,
        setNoAjuItems,
        resetStore,
        loading
    } = useNoAjuStore();

    // TRIGGER FETCH: Hanya jalan saat UID berubah
    useEffect(() => {
        if (uid && type === "update") {
            get_no_aju_by_uid(uid);
        } else if (type === "create") {
            // Jika mode create, langsung kasih 1 baris kosong
            setNoAjuItems([{ noAju: "", expiredAju: "" }]);
        }

        // CLEANUP: Hanya saat pindah halaman/komponen mati
        return () => resetStore();
    }, [uid, type]); // Jangan masukkan fungsi store ke sini biar gak looping

    const handleAddItem = () => setNoAjuItems([...noAjuItems, { noAju: "", expiredAju: "" }]);
    const handleRemoveItem = (index: number) => setNoAjuItems(noAjuItems.filter((_, i) => i !== index));

    const handleChange = (index: number, field: keyof NoAjuItem, value: string) => {
        const updatedItems = [...noAjuItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNoAjuItems(updatedItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = noAjuSchema.safeParse(noAjuItems);
        if (!result.success) return alert(result.error.issues[0].message);

        if (uid) {
            try {
                await upsert_no_aju(uid, noAjuItems);
                alert("Data berhasil di-sync ke database.");
            } catch (err: any) {
                console.error(err.message);
            }
        }
    };

    // LOADING STATE: Sangat penting agar input tidak kedap-kedip
    if (loading && noAjuItems.length === 0) {
        return (
            <div className="p-20 flex flex-col items-center justify-center border-2 border-slate-900 bg-slate-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-10 h-10 border-4 border-slate-900 border-t-blue-600 animate-spin mb-4"></div>
                <p className="font-black text-xs uppercase tracking-[0.3em] animate-pulse">Retrieving_Data...</p>
            </div>
        );
    }

    return (
        <FormControl onSubmit={handleSubmit} className="bg-white p-0 overflow-hidden border-2 border-slate-900 shadow-[12px_12px_0px_0px_rgba(0,0,0,0.1)]">
            {/* Header, Body, dan Footer UI kamu yang sudah bagus tadi di sini */}
            {/* ... masukkan sisa UI sebelumnya di sini ... */}
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b-2 border-slate-900">
                <div className="flex items-center gap-3">
                    <FaTerminal className="text-blue-400 animate-pulse" size={14} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Data_Entry_Module // {type}</span>
                </div>
            </div>

            <div className="p-4 space-y-10 max-h-[65vh] overflow-y-auto bg-[#F8FAFC]">
    {noAjuItems.map((item, index) => (
        <div key={index} className="relative group animate-in zoom-in-95 duration-200">
            {/* Badge Indikator Baris */}
            <div className="absolute -top-3 left-4 z-10 bg-blue-600 text-white px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border border-slate-900">
                Record_Index_0{index + 1}
            </div>

            <div className="bg-white border-2 border-slate-900 p-6 pt-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(37,99,235,1)] transition-all">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* FIELD 1: NOMOR AJU */}
                    <TextField
                        id={`noAju-${index}`}
                        type="text"
                        label={`Nomor AJU #${index + 1}`}
                        placeholder="Masukkan Nomor AJU..."
                        required={true}
                        controller={{
                            value: item.noAju || "", 
                            onChange: (e) => handleChange(index, "noAju", e.target.value)
                        }}
                        schema={z.string().min(5, "Minimal 5 karakter")}
                    />

                    {/* FIELD 2: EXPIRED DATE */}
                    <TextField
                        id={`expired-${index}`}
                        type="datetime-local"
                        label="Batas Waktu System"
                        required={true}
                        controller={{
                            // INI KUNCINYA: Harus ambil dari item hasil map
                            value: item.expiredAju || "", 
                            onChange: (e) => handleChange(index, "expiredAju", e.target.value)
                        }}
                        schema={z.string().min(1, "Wajib diisi")}
                    />

                </div>

                {/* Tombol Hapus Baris */}
                {noAjuItems.length > 1 && (
                    <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="absolute -top-3 -right-3 bg-white border-2 border-slate-900 p-1.5 hover:bg-red-600 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px"
                    >
                        <MdClose size={18} />
                    </button>
                )}
            </div>
        </div>
    ))}
</div>

            <div className="p-6 bg-slate-100 border-t-2 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full md:w-auto flex items-center justify-center gap-2 border-2 border-slate-900 px-6 py-3 font-black text-[11px] uppercase bg-white hover:bg-slate-900 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <FaPlus size={10} /> Append_New_Registry
                </button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto rounded-none! bg-blue-600! border-2! border-slate-900! px-10! py-3! font-black! text-[11px]! uppercase! text-white! shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]!"
                >
                    {loading ? "EXECUTING..." : `EXECUTE_${type.toUpperCase()}_CMD`}
                </Button>
            </div>
        </FormControl>
    );
}