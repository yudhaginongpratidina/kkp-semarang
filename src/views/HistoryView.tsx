// libraries
import { useLocation, useParams } from "react-router-dom"

// features
import { KPPSidebar, KPPHeader, KPPMain, KPPModal } from "../features/Layout"
import { TableHistory, DetailsHistory } from "../features/History"

export default function HistoryView() {
    const location = useLocation()
    const { id } = useParams<{ id: string }>();

    return (
        <>
            <KPPModal />
            <div className="w-full flex">
                <KPPSidebar />
                <KPPMain>
                    <KPPHeader />
                    {location.pathname === "/history" && <TableHistory />}
                    {location.pathname === `/history/${id}` && <DetailsHistory />}
                </KPPMain>
            </div>
        </>
    )
}