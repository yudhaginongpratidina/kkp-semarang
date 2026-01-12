// libraries
import { useLocation,useParams } from "react-router-dom"

// features
import { KPPSidebar, KPPHeader, KPPMain } from "../features/Layout"
import { TableHistory, DetailsHistory } from "../features/History"

export default function HistoryView() {
    const location = useLocation()
    const { fullname } = useParams<{ fullname: string }>();
    
    return (
        <div className="w-full flex">
            <KPPSidebar />
            <KPPMain>
                <KPPHeader />
                {location.pathname === "/history" && <TableHistory />}
                {location.pathname === `/history/${fullname}` && <DetailsHistory />}
            </KPPMain>
        </div>
    )
}