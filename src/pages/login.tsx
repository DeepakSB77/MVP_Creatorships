'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { FaGoogle, FaFacebook } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from '@/lib/supabase'
import { toast, Toaster } from 'sonner'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Check for remembered login on component mount
  useEffect(() => {
    const checkRememberedLogin = async () => {
      const remembered = localStorage.getItem('rememberMe') === 'true'
      if (remembered) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          navigate('/dashboard')
        }
      }
    }

    checkRememberedLogin()
  }, [navigate])

  // Pre-fill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail')
    if (rememberedEmail) {
      setEmail(rememberedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Form validation
    if (!email) {
      toast.error('Email is required')
      setIsLoading(false)
      return
    }

    if (!password) {
      toast.error('Password is required')
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        switch (error.message) {
          case 'Invalid login credentials':
            toast.error('Invalid email or password')
            break
          case 'Email not confirmed':
            toast.error('Please verify your email address')
            break
          default:
            toast.error(error.message)
        }
        return
      }

      if (data.session) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true')
          localStorage.setItem('userEmail', email)
        } else {
          localStorage.removeItem('rememberMe')
          localStorage.removeItem('userEmail')
        }
        
        toast.success('Welcome back!', {
          description: 'Successfully logged in to your account'
        })
        navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred', {
        description: 'Please try again later'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        toast.error('Google Sign-in failed', {
          description: error.message
        })
      }
    } catch (error: any) {
      toast.error('Failed to connect with Google', {
        description: 'Please try again later'
      })
    }
  }

  const handleFacebookSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        toast.error('Facebook Sign-in failed', {
          description: error.message
        })
      }
    } catch (error: any) {
      toast.error('Failed to connect with Facebook', {
        description: 'Please try again later'
      })
    }
  }

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px]">
          <CardHeader className="text-center space-y-2 sm:space-y-3">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl">Sign in to your account</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              to enjoy all of our cool <span className="text-blue-500">features</span> ✌️
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email address</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 sm:h-10 text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 sm:h-10 text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                    className="h-4 w-4 sm:h-5 sm:w-5"
                  />
                  <Label 
                    htmlFor="remember-me" 
                    className="text-xs sm:text-sm font-medium leading-none"
                  >
                    Remember me
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-xs sm:text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-9 sm:h-10 text-sm sm:text-base bg-primary text-white hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>

          <div className="p-4 sm:p-6 md:p-8 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                className="w-full h-9 sm:h-10 text-xs sm:text-sm flex items-center justify-center space-x-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <FaGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Sign in with Google</span>
              </Button>
              <Button 
                className="w-full h-9 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                <FaFacebook className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Continue with Facebook</span>
              </Button>
            </div>

            <div className="text-center text-xs sm:text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}