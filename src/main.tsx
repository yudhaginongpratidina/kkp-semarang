import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom"
import { createBrowserRouter } from "react-router-dom"

// middlewares
import AuthGuard from './middlewares/AuthGuard'

// style
import './index.css'

// views
import {
	AuthenticationView,
	DashboardView,
	HistoryView,
	AccountView,
	RoleManagementView
} from './views'

// routing
const router = createBrowserRouter([
	// halaman guest → publicOnly
	{ path: "/", element: <AuthGuard publicOnly><AuthenticationView /></AuthGuard> },
	{ path: "/login", element: <AuthGuard publicOnly><AuthenticationView /></AuthGuard> },
	{ path: "/create-account", element: <AuthGuard publicOnly><AuthenticationView /></AuthGuard> },

	// dashboard → hanya user login
	{ path: "/dashboard", element: <AuthGuard><DashboardView /></AuthGuard> },
	{ path: "/dashboard/analytics", element: <AuthGuard><DashboardView /></AuthGuard> },

	// history & account → hanya user login
	{ path: "/history", element: <AuthGuard><HistoryView /></AuthGuard> },
	{ path: "/history/:id", element: <AuthGuard><HistoryView /></AuthGuard> },
	{ path: "/account", element: <AuthGuard><AccountView /></AuthGuard> },

	// role management → hanya admin
	{ path: "/role-management", element: <AuthGuard><RoleManagementView /></AuthGuard> },
])

// render
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
