// dependencies
import { z } from "zod";
import { useParams } from "react-router-dom"; // Untuk mengambil UID dari URL

// store
import { useNoAjuStore } from "../../stores/useNoAjuStore";

// components
import { FormControl, TextField, Button } from "../../components";

export default function NoAjuForm({ type }: { type: "create" | "update" }) {
    const { id: uid } = useParams();
    const { noAju, upsert_no_aju, setField, loading } = useNoAjuStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (uid && noAju) {
            await upsert_no_aju(uid, noAju);
            alert("Nomor AJU berhasil disimpan!");
        }
        window.location.reload();
    };

    return (
        <FormControl onSubmit={handleSubmit}>
            <TextField
                type="text"
                required={true}
                id="noAju"
                label="Nomor AJU"
                placeholder="Masukkan nomor AJU..."
                schema={z.string().min(5, "Minimal 5 karakter")}
                controller={{
                    value: noAju || "",
                    onChange: (e) => setField('noAju', e.target.value)
                }}
            />
            <div className="w-full flex flex-col md:flex-row justify-end items-center gap-4 mt-4">
                <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-400"
                    disabled={loading}
                >
                    {type === "create" ? "Simpan Nomor AJU" : "Update Nomor AJU"}
                </Button>
            </div>
        </FormControl>
    );
}