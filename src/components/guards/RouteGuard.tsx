import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscription } from '@/hooks/useSubscription'

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isSubscribed, pagesViewed, incrementPageView } = useSubscription()
  const navigate = useNavigate()

  useEffect(() => {
    const checkAccess = async () => {
      if (!isSubscribed && pagesViewed >= 5) {
        navigate('/subscription')
        return
      }
      await incrementPageView()
    }

    checkAccess()
  }, [])

  return <>{children}</>
} 