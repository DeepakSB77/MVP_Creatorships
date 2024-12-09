'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Add form state management
interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  address: {
    country: string;
    city: string;
  };
  social: {
    instagram: string;
    tiktok: string;
    youtube: string;
    about: string;
  };
}

export default function Multistep() {
  // Add form state
  const [formData, setFormData] = useState<FormData>({
    personalInfo: { firstName: '', lastName: '', email: '' },
    address: { country: '', city: '' },
    social: { 
      instagram: '', 
      tiktok: '', 
      youtube: '', 
      about: '' 
    }
  });

  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(33)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Add form validation
  const isStepValid = () => {
    switch (step) {
      case 1:
        const { firstName, lastName, email } = formData.personalInfo;
        return firstName && lastName && email;
      case 2:
        const { country, city } = formData.address;
        return country && city;
      case 3:
        return true; // Social handles are optional
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (isStepValid() && step < 3) {
      const newStep = step + 1;
      setStep(newStep);
      setProgress(newStep === 2 ? 66 : 100);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      const newStep = step - 1
      setStep(newStep)
      setProgress(newStep === 1 ? 33 : 66)
    }
  }

  const handleSubmit = () => {
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl bg-background-card shadow-lg rounded-xl p-6 md:p-8 border border-border">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-secondary mt-2">Join our community today</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-secondary">
            <span>Step {step} of 3</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-primary-light [&>div]:bg-primary"
          />
        </div>

        {/* Form Steps */}
        <div>
          {step === 1 && (
            <PersonalInfoStep 
              data={formData.personalInfo}
              onChange={(data) => setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, ...data }
              }))}
            />
          )}
          {step === 2 && (
            <AddressStep 
              data={formData.address}
              onChange={(data) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, ...data }
              }))}
            />
          )}
          {step === 3 && (
            <SocialHandlesStep 
              data={formData.social}
              onChange={(data) => setFormData(prev => ({
                ...prev,
                social: { ...prev.social, ...data }
              }))}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 border-t border-border pt-6">
          <div className="flex justify-between items-center">
            <div>
              {step > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevStep}
                  className="border-border hover:bg-background hover:text-primary"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
            </div>
            
            <div>
              {step < 3 ? (
                <Button 
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary-hover text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Updated Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">Account Created</DialogTitle>
              <DialogDescription className="text-center">
                Your account has been successfully created!
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center">
              <Button onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Update PersonalInfoStep
interface PersonalInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
  };
  onChange: (data: Partial<FormData['personalInfo']>) => void;
}

function PersonalInfoStep({ data, onChange }: PersonalInfoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">User Registration</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name" className="text-sm font-medium">
            First Name
          </Label>
          <Input 
            id="first-name" 
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="First name" 
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="last-name" className="text-sm font-medium">
            Last Name
          </Label>
          <Input 
            id="last-name" 
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Last name" 
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          type="email" 
          placeholder="you@example.com" 
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          We&apos;ll never share your email.
        </p>
      </div>
    </div>
  )
}

// Update AddressStep
interface AddressStepProps {
  data: {
    country: string;
    city: string;
  };
  onChange: (data: Partial<FormData['address']>) => void;
}

function AddressStep({ data, onChange }: AddressStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">User Details</h2>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Country / Region</Label>
          <Select 
            value={data.country}
            onValueChange={(value) => onChange({ country: value })}
          >
            <SelectTrigger className="w-full mt-1 bg-background">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="mx">Mexico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">City</Label>
          <Input 
            value={data.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="City" 
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

// Update SocialHandlesStep
interface SocialHandlesProps {
  data: FormData['social'];
  onChange: (data: Partial<FormData['social']>) => void;
}

function SocialHandlesStep({ data, onChange }: SocialHandlesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Social Media</h2>
      
      <div className="space-y-4">
        <div>
          <Label>Instagram</Label>
          <div className="flex mt-2">
            <div className="bg-gray-100 px-3 py-2 border rounded-l-md flex items-center text-pink-500">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <Input 
              value={data.instagram}
              onChange={(e) => onChange({ instagram: e.target.value })}
              placeholder="@username" 
              className="flex-1 rounded-l-none"
            />
          </div>
        </div>

        <div>
          <Label>TikTok</Label>
          <div className="flex mt-2">
            <div className="bg-gray-100 px-3 py-2 border rounded-l-md flex items-center text-black">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </div>
            <Input 
              value={data.tiktok}
              onChange={(e) => onChange({ tiktok: e.target.value })}
              placeholder="@username" 
              className="flex-1 rounded-l-none"
            />
          </div>
        </div>

        <div>
          <Label>YouTube Channel</Label>
          <div className="flex mt-2">
            <div className="bg-gray-100 px-3 py-2 border rounded-l-md flex items-center text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <Input 
              value={data.youtube}
              onChange={(e) => onChange({ youtube: e.target.value })}
              placeholder="Channel name" 
              className="flex-1 rounded-l-none"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>About</Label>
        <Textarea 
          value={data.about}
          onChange={(e) => onChange({ about: e.target.value })}
          placeholder="Brief description about yourself" 
          className="mt-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Brief description for your profile. URLs are hyperlinked.
        </p>
      </div>
    </div>
  )
}