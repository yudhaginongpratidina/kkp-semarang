// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"

export default function AccountView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
            </KPPMain>
        </div>
    )
}