// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"
import { UserTable } from "../features/UserManagement"

export default function UserManagementView() {
    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                    <UserTable />
                </KPPMain>
            </div>
        </>
    )
}