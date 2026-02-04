export default function KPPMain({ children }: { children: React.ReactNode }) {
    return (
        <main className="w-full min-h-screen bg-slate-100">
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            ></div>
            {children}
        </main>
    )
}
