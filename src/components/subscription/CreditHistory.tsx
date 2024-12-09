import { useEffect, useState } from 'react'
import { emailService } from '@/lib/emailService'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'

interface EmailView {
  id: string;
  email_viewed: string;
  viewed_at: string;
  creator?: {
    username: string;
    image: string;
  }
}

export function CreditHistory() {
  const [history, setHistory] = useState<EmailView[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await emailService.getEmailViewHistory()
        
        if (error || !data) return

        // Get unique emails
        const uniqueEmails = data.reduce((acc: EmailView[], current) => {
          const exists = acc.find(item => item.email_viewed === current.email_viewed)
          if (!exists) {
            acc.push(current)
          }
          return acc
        }, [])

        // Fetch creator details for each email
        const emailsWithCreators = await Promise.all(
          uniqueEmails.map(async (item) => {
            const { data: creatorData } = await supabase
              .from('tiktok')
              .select('username, image')
              .eq('email', item.email_viewed)
              .single()

            return {
              ...item,
              creator: creatorData || undefined
            }
          })
        )

        // Sort by most recent
        emailsWithCreators.sort((a, b) => 
          new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime()
        )
        
        setHistory(emailsWithCreators)
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Revealed Emails</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No emails revealed yet
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between border-b pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={item.creator?.image} 
                    alt={item.creator?.username || 'Creator'} 
                  />
                  <AvatarFallback>
                    {item.creator?.username?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {item.creator?.username || 'Unknown Creator'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.email_viewed}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Revealed: {format(new Date(item.viewed_at), 'PPp')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
} 