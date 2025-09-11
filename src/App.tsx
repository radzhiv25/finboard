import { BrowserRouter as Router, useLocation, Navigate, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Dashboard } from "@/components/Dashboard"
import { LandingPage } from "@/components/LandingPage"
import { AuthPage } from "@/pages/AuthPage"
import { Settings } from "@/components/Settings"
import { Reports } from "@/components/Reports"
import { About } from "@/components/About"
import { motion } from "framer-motion"
import { useEffect } from "react"

function AppContent() {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()



  // Handle redirects for authenticated users
  useEffect(() => {
    if (!loading && user) {
      if (location.pathname === '/login' || location.pathname === '/signup') {
        navigate('/dashboard', { replace: true })
      } else if (location.pathname === '/') {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [user, loading, location.pathname, navigate])

  // Show loading only while authentication is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>This should only take a moment</p>
            <button
              onClick={() => window.location.reload()}
              className="underline hover:text-foreground transition-colors"
            >
              If stuck, click here to reload
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Simple routing logic
  const currentPath = location.pathname


  // About page (accessible to all users)
  if (currentPath === '/about') {
    return <About />
  }

  // Handle authenticated users
  if (user) {
    // Show dashboard for authenticated users
    if (currentPath === '/dashboard') {
      return <Dashboard />
    }

    // Show settings for authenticated users
    if (currentPath === '/settings') {
      return <Settings />
    }

    // Show reports for authenticated users
    if (currentPath === '/reports') {
      return <Reports />
    }

    // For any other path, show loading while redirect happens
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          </div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  // Handle unauthenticated users
  if (!user) {
    // Show auth page for login/signup
    if (currentPath === '/login' || currentPath === '/signup') {
      return <AuthPage />
    }

    // Redirect unauthenticated users from protected routes to landing page
    if (currentPath === '/dashboard' || currentPath === '/settings' || currentPath === '/reports') {
      return <Navigate to="/" replace />
    }

    // Default to landing page for unauthenticated users
    return <LandingPage />
  }

  // Fallback to landing page
  return <LandingPage />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
