import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import RetailAuditProV2 from './pages/AuditApp'

function AppInner() {
  const { user, loading } = useAuth()
  const [demoMode, setDemoMode] = useState(false)

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-3 animate-pulse">🏬</div>
        <div className="text-sm text-slate-400">جارٍ التحميل...</div>
      </div>
    </div>
  )

  // Show app if logged in OR in demo mode
  if (user || demoMode) {
    return <RetailAuditProV2 />
  }

  return <Login onDemoLogin={() => setDemoMode(true)} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
