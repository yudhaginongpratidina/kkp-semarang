// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { AccountForm } from "../features/Account"

export default function AccountView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <AccountForm />
            </KPPMain>
        </div>
    )
}