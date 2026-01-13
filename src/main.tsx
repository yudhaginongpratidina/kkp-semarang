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
	AccountView
} from './views'

// routing
const router = createBrowserRouter([
	{ path: "/", element: <AuthenticationView /> },
	{ path: "/login", element: <AuthenticationView /> },
	{ path: "/create-account", element: <AuthenticationView /> },

	// dashboard hanya bisa diakses user login
	{ path: "/dashboard", element: <AuthGuard><DashboardView /></AuthGuard> },
	{ path: "/dashboard/analytics", element: <AuthGuard><DashboardView /></AuthGuard> },
	{
		path: "/dashboard/scanner",
		element: <AuthGuard allowedRoles={['operator']}><DashboardView /></AuthGuard>
	},

	// history, account juga harus login
	{ path: "/history", element: <AuthGuard><HistoryView /></AuthGuard> },
	{ path: "/history/:id", element: <AuthGuard><HistoryView /></AuthGuard> },
	{ path: "/account", element: <AuthGuard><AccountView /></AuthGuard> },
])

// render
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
)
