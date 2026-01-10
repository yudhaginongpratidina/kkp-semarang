// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { StatisticsDashboard, QueueDashboard } from "../features/Dashboard"

export default function DashboardView() {
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <StatisticsDashboard />
                <QueueDashboard />
            </KPPMain>
        </div>
    )
}