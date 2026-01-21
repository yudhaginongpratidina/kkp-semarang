// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"

export default function TraderManagementView() {
    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                </KPPMain>
            </div>
        </>
    )
}