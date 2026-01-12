// dependency
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";

// style
import './index.css'

// views
import {
	AuthenticationView,
	DashboardView,
	HistoryView,
	AccountView
} from './views'

// routing
const router = createBrowserRouter([
	{ path: "/", element: <AuthenticationView /> },
	{ path: "/login", element: <AuthenticationView /> },
	{ path: "/create-account", element: <AuthenticationView /> },
	
	{ path: "/dashboard", element: <DashboardView /> },
	{ path: "/dashboard/analytics", element: <DashboardView /> },
	{ path: "/history", element: <HistoryView /> },
	{ path: "/history/:fullname", element: <HistoryView /> },
	{ path: "/account", element: <AccountView /> },
]);

// render
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
