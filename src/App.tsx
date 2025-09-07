import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { Dashboard } from "@/components/Dashboard"
import { LandingPage } from "@/components/LandingPage"
import { AuthPage } from "@/pages/AuthPage"
import { Settings } from "@/components/Settings"
import { DebugAuth } from "@/components/DebugAuth"
import { motion } from "framer-motion"

function AppContent() {
  const { user, loading } = useAuth()

  console.log('AppContent render:', { user: !!user, loading, pathname: window.location.pathname })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <DebugAuth />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-muted-foreground underline"
          >
            If stuck, click here to reload
          </button>
        </motion.div>
      </div>
    )
  }

  // Check if user is on auth page (login/signup)
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/signup'
  const isSettingsPage = window.location.pathname === '/settings'
  console.log('Routing decision:', { isAuthPage, isSettingsPage, hasUser: !!user })

  if (isAuthPage) {
    return <AuthPage />
  }

  if (isSettingsPage && user) {
    return <Settings />
  }

  if (user) {
    return <Dashboard />
  }

  return <LandingPage />
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
