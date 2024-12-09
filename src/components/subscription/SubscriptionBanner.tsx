import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export function SubscriptionBanner() {
  const { pagesViewed, isSubscribed } = useSubscription()
  const navigate = useNavigate()

  if (isSubscribed) return null

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Free Trial
          </Badge>
          <p className="text-sm font-medium text-gray-700">
            <span className="text-blue-700 font-semibold">{5 - pagesViewed} pages remaining</span>
            {" "}in your trial. Unlock unlimited access today.
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => navigate('/subscription')}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          Upgrade Now
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
} 