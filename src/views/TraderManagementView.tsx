// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"

export default function TraderManagementView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
            </KPPMain>
        </div>
    )
}