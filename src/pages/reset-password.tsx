'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { supabase } from '@/lib/supabase'
import { toast, Toaster } from 'sonner'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        toast.error('Failed to reset password', {
          description: error.message
        })
      } else {
        toast.success('Password updated successfully!')
        navigate('/login')
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Set New Password</CardTitle>
            <CardDescription>
              Please enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                  id="confirm-password"
                  type="password" 
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
} 