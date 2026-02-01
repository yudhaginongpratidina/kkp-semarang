import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { useNoAjuStore, type NoAjuItem } from "../../stores/useNoAjuStore";
import { FormControl, TextField, Button } from "../../components";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

// Skema validasi untuk seluruh array
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

    // 1. Ambil data lama jika mode UPDATE
    useEffect(() => {
        if (uid && type === "update") {
            get_no_aju_by_uid(uid);
        }
        // Cleanup saat ganti halaman biar data gak bocor ke user lain
        return () => resetStore();
    }, [uid, type, get_no_aju_by_uid, resetStore]);

    const handleAddItem = () => {
        setNoAjuItems([...noAjuItems, { noAju: "", expiredAju: "" }]);
    };

    const handleRemoveItem = (index: number) => {
        const updatedItems = noAjuItems.filter((_, i) => i !== index);
        setNoAjuItems(updatedItems);
    };

    const handleChange = (index: number, field: keyof NoAjuItem, value: string) => {
        const updatedItems = [...noAjuItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setNoAjuItems(updatedItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = noAjuSchema.safeParse(noAjuItems);

        if (!result.success) {
            const errorMsg = result.error.issues[0].message;
            alert(`Validasi Gagal: ${errorMsg}`);
            return;
        }

        if (uid) {
            try {
                await upsert_no_aju(uid, noAjuItems);
                alert("Data AJU berhasil disimpan!");
            } catch (err: any) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading && type === "update" && noAjuItems[0].noAju === "") {
        return <div className="p-10 text-center">Memuat data...</div>;
    }

    return (
        <FormControl onSubmit={handleSubmit}>
            <div className="space-y-6">
                {noAjuItems.map((item: NoAjuItem, index: number) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-sm bg-slate-50 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextField
                                id={`noAju-${index}`}
                                type="text"
                                label={`Nomor AJU #${index + 1}`}
                                placeholder="Masukkan nomor AJU..."
                                required={true}
                                controller={{
                                    value: item.noAju,
                                    onChange: (e) => handleChange(index, "noAju", e.target.value)
                                }}
                                schema={z.string().min(1, "Batas waktu wajib diisi")}
                            />

                            <TextField
                                id={`expired-${index}`}
                                type="datetime-local"
                                label="Batas Waktu (Expired)"
                                required={true}
                                schema={z.string().min(1, "Batas waktu wajib diisi")}
                                controller={{
                                    value: item.expiredAju,
                                    onChange: (e) => handleChange(index, "expiredAju", e.target.value)
                                }}
                            />
                        </div>

                        {noAjuItems.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleRemoveItem(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600"
                            >
                                <FaTrashAlt size={12} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-4 border-t border-slate-200">
                <Button
                    type="button"
                    onClick={handleAddItem}
                    className="bg-teal-600 hover:bg-teal-700 text-white w-full md:w-auto flex items-center gap-2"
                >
                    <FaPlus size={14} /> Tambah Baris
                </Button>

                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-400 w-full md:w-auto"
                    disabled={loading}
                >
                    {loading ? "Memproses..." : type === "create" ? "Simpan Data" : "Update Data"}
                </Button>
            </div>
        </FormControl>
    );
}