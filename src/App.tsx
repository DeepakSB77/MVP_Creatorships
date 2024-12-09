'use client'

import { 
  createBrowserRouter, 
  RouterProvider, 
  Navigate,
} from 'react-router-dom'
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard/index'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import ForgotPassword from '@/pages/forgot-password'
import ResetPassword from '@/pages/reset-password'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Registration from '@/pages/Registration'
import { RouteGuard } from '@/components/guards/RouteGuard'
import Subscription from '@/pages/Subscription'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isAuthenticated === null) {
    return null
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />,
    },
    {
      path: "/dashboard/*",
      element: (
        <RouteGuard>
          <DashboardPage />
        </RouteGuard>
      ),
    },
    {
      path: "/login",
      element: !isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />,
    },
    {
      path: "/register",
      element: !isAuthenticated ? <Registration /> : <Navigate to="/dashboard" />,
    },
    {
      path: "/subscription",
      element: (
        <RouteGuard>
          <Subscription />
        </RouteGuard>
      ),
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
  ])

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  )
}

export default App