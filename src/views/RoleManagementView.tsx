// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { RoleTable } from "../features/RoleManagement"

export default function RoleManagementView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <RoleTable/>
            </KPPMain>
        </div>
    )
}