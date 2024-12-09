import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const hasShownToast = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session && !hasShownToast.current) {
          hasShownToast.current = true
          toast.error('Unauthorized access', {
            description: 'Please login to continue'
          })
          navigate('/login')
          return
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/login', { replace: true })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
} 