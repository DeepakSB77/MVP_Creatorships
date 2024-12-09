import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/useSubscription'
import { emailService } from '@/lib/emailService'
import { cn } from '@/lib/utils'

interface EmailViewerProps {
  email: string | null
  isLoading?: boolean
  onReveal: () => Promise<string | null>
  creditsRemaining?: number
  preview?: string
  className?: string;
}

export function EmailViewer({ 
  isLoading, 
  onReveal, 
  creditsRemaining,
  preview,
  className,
}: EmailViewerProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const { checkSubscription } = useSubscription()
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleReveal = async () => {
    if (!onReveal || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const fetchedEmail = await onReveal();
      if (!fetchedEmail) {
        toast.error('Failed to fetch email');
        return;
      }

      const { error, creditsRemaining: updatedCredits, isAlreadyRevealed } = 
        await emailService.trackEmailView(fetchedEmail);
      
      if (error) {
        toast.error(error);
        return;
      }

      setRevealedEmail(fetchedEmail);
      setIsRevealed(true);
      await checkSubscription();

      if (isAlreadyRevealed) {
        toast.success('Email revealed (Previously revealed)');
      } else {
        toast.success(`Email revealed! ${updatedCredits} credits remaining`);
      }

    } catch (error) {
      console.error('Reveal error:', error);
      toast.error('Failed to reveal email');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (revealedEmail && isRevealed) {
      await navigator.clipboard.writeText(revealedEmail)
      setCopied(true)
      toast.success('Email copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={cn("border rounded-lg p-4 bg-white shadow-sm", className)}>
      {isLoading || isProcessing ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
          <span>Loading...</span>
        </div>
      ) : !isRevealed ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Lock className="h-4 w-4" />
            <span className="text-sm">{preview || 'Email hidden'}</span>
          </div>
          <Button 
            onClick={handleReveal}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={creditsRemaining !== undefined && creditsRemaining <= 0}
          >
            <Mail className="mr-2 h-4 w-4" />
            {creditsRemaining !== undefined ? `Reveal Email (${creditsRemaining} credits)` : 'Reveal Email'}
          </Button>
        </div>
      ) : (
        <div 
          className="space-y-2 cursor-pointer group"
          onClick={handleCopy}
        >
          <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium select-all">{revealedEmail}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 px-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 