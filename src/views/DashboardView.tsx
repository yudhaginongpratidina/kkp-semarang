// libraries
import { useLocation } from "react-router-dom"

// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"
import { StatisticsDashboard, TabDashboard, QueueDashboard, AnalyticsDashboard } from "../features/Dashboard"

export default function DashboardView() {
    const location = useLocation()

    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                    <StatisticsDashboard />
                    <TabDashboard />

                    {location.pathname === "/dashboard" && <QueueDashboard />}
                    {location.pathname === "/dashboard/analytics" && <AnalyticsDashboard />}
                </KPPMain>
            </div>
        </>
    )
}