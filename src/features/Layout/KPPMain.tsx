export default function KPPMain({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full min-h-screen bg-slate-100">
            {children}
        </main>
    )
}