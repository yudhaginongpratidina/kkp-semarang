// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { AccountIfoForm, AccountForm } from "../features/Account"

export default function AccountView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <div className="w-full flex flex-col gap-4">
                    <AccountIfoForm/>
                    <AccountForm />
                </div>
            </KPPMain>
        </div>
    )
}