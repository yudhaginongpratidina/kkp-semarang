// libraries
import { useLocation } from "react-router-dom"

// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { StatisticsDashboard, TabDashboard, QueueDashboard, AnalyticsDashboard, ScanQRDashboard } from "../features/Dashboard"

export default function DashboardView() {
    const location = useLocation()

    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                <StatisticsDashboard />
                <TabDashboard />

                {location.pathname === "/dashboard" && <QueueDashboard />}
                {location.pathname === "/dashboard/analytics" && <AnalyticsDashboard />}
                {location.pathname === "/dashboard/scanner" && <ScanQRDashboard />}
            </KPPMain>
        </div>
    )
}