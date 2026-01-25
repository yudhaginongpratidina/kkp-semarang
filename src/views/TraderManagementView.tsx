// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"
import { TraderTable } from "../features/Trader"

export default function TraderManagementView() {
    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                    <TraderTable />
                </KPPMain>
            </div>
        </>
    )
}