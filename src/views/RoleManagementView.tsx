// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"
import { RoleTable } from "../features/RoleManagement"

export default function RoleManagementView() {
    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                    <RoleTable />
                </KPPMain>
            </div>
        </>
    )
}