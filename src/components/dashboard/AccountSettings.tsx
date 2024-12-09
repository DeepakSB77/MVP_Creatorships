import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  CreditCard,
  Upload,
} from "lucide-react"
import { 
  FaInstagram, 
  FaYoutube, 
  FaTiktok 
} from "react-icons/fa"
import { CreditHistory } from '@/components/subscription/CreditHistory'
import { useSubscription } from '@/hooks/useSubscription'
import { useNavigate } from 'react-router-dom';

export default function AccountSettings() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState("/default-avatar.png")
  const { isSubscribed, creditsRemaining } = useSubscription()
  
  // Add scroll reset effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    }
  }
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Photo - Updated Design */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage} />
                  <AvatarFallback>UP</AvatarFallback>
                </Avatar>
                <div 
                  className="absolute inset-0 bg-black/60 rounded-full opacity-0 
                             group-hover:opacity-100 transition-opacity duration-200 
                             flex items-center justify-center cursor-pointer"
                  onClick={() => document.getElementById('profileImage')?.click()}
                >
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('profileImage')?.click()}
                  className="relative overflow-hidden"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <p className="text-sm text-muted-foreground">
                  JPG, GIF or PNG. Max size of 2MB.
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => setProfileImage("/default-avatar.png")}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="@username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" />
              </div>
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FaInstagram className="h-5 w-5 text-pink-500" />
                <Input placeholder="Instagram profile URL" />
              </div>
              <div className="flex items-center gap-4">
                <FaYoutube className="h-5 w-5 text-red-500" />
                <Input placeholder="YouTube channel URL" />
              </div>
              <div className="flex items-center gap-4">
                <FaTiktok className="h-5 w-5" />
                <Input placeholder="TikTok profile URL" />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred language
                  </p>
                </div>
                <Select defaultValue="en">
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Time Zone</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your local time zone
                  </p>
                </div>
                <Select defaultValue="utc">
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Campaign Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new campaigns and opportunities
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Message Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for new messages
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                  <Button className="text-white">Update Password</Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/24</p>
                  </div>
                </div>
                <Button variant="outline">Edit</Button>
              </div>
              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing History</h2>
            <div className="space-y-4">
              {/* Add billing history items here */}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                    </p>
                  </div>
                  {!isSubscribed && (
                    <Button onClick={() => navigate('/subscription')} className="bg-primary text-white">
                      Upgrade to Pro
                    </Button>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium">Credits Remaining</p>
                  <p className="text-3xl font-bold text-primary">{creditsRemaining}</p>
                </div>
              </div>
              <div className="bg-primary/10 p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Benefits of Pro Plan</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                  <li>Unlimited page views</li>
                  <li>100 email credits monthly</li>
                  <li>Access to advanced features</li>
                  <li>Priority support</li>
                </ul>
              </div>
            </div>
          </Card>
          
          <CreditHistory />
        </TabsContent>
      </Tabs>

      {/* Save Changes Button */}
      <div className="mt-6 flex justify-end">
        <Button size="lg" className="text-white">
          Save Changes
        </Button>
      </div>
    </div>
  )
} 