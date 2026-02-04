// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { AccountIfoForm, AccountPasswordForm } from "../features/Account"

export default function AccountView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <div className="w-full flex flex-col gap-4 p-4">
                    <AccountIfoForm />
                    <AccountPasswordForm />
                </div>
            </KPPMain>
        </div>
    )
}