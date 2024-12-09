import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  Users, 
  MessageSquare,

  LayoutDashboard,
  BarChart3,
  Settings,
  Briefcase,
  PlusCircle,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Loader2,
  X
} from "lucide-react"
import Creators from "../../components/dashboard/Creators"
import Campaigns from "../../components/dashboard/Campaigns"
import Messages from "../../components/dashboard/Messages"
import Statistics from "../../components/dashboard/Statistics"
import Reports from "../../components/dashboard/Reports"
import AccountSettings from "../../components/dashboard/AccountSettings"
import HelpCenter from "../../components/dashboard/HelpCenter"
import DashboardOverview from "@/components/dashboard/DashboardOverview"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import CreateCampaignForm from "@/components/dashboard/CreateCampaignForm"
import {  motion } from "framer-motion"
import logo from "@/assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { ScrollArea } from "@/components/ui/scroll-area"
import { SubscriptionBanner } from '@/components/subscription/SubscriptionBanner'
import MediaKit from "@/components/dashboard/MediaKit"

const menuItems = [
  {
    title: "Main Menu",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", component: "dashboard" },
      { icon: Users, label: "Creators", component: "creators" },
      { icon: Briefcase, label: "Campaigns", component: "campaigns" },
      { icon: MessageSquare, label: "Messages", component: "messages" },
      { icon: FileText, label: "Media Kit", component: "mediakit" },
    ]
  },
  {
    title: "Analytics",
    items: [
      { icon: BarChart3, label: "Statistics", component: "statistics" },
      { icon: FileText, label: "Reports", component: "reports" },
    ]
  },
  {
    title: "Support",
    items: [
      { icon: Settings, label: "Settings", component: "settings" },
      { icon: HelpCircle, label: "Help Center", component: "help" },
    ]
  }
]

// Add this type and mock data
interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: 'campaign' | 'message' | 'system'
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Campaign Request',
    description: 'Nike has invited you to their summer campaign',
    time: '2 minutes ago',
    read: false,
    type: 'campaign'
  },
  {
    id: '2',
    title: 'New Message',
    description: 'Sarah sent you a message about the collaboration',
    time: '1 hour ago',
    read: false,
    type: 'message'
  },
  {
    id: '3',
    title: 'Campaign Approved',
    description: 'Your submission for Adidas campaign was approved',
    time: '2 hours ago',
    read: true,
    type: 'campaign'
  },
  {
    id: '4',
    title: 'Profile Update',
    description: 'Your profile changes have been saved successfully',
    time: '1 day ago',
    read: true,
    type: 'system'
  }
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [activeComponent, setActiveComponent] = useState(() => 
    localStorage.getItem('activeComponent') || "dashboard"
  )
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <DashboardOverview />
      case "creators":
        return <Creators />
      case "campaigns":
        return <Campaigns />
      case "messages":
        return <Messages />
      case "statistics":
        return <Statistics />
      case "reports":
        return <Reports />
      case "settings":
        return <AccountSettings />
      case "help":
        return <HelpCenter />
      case "mediakit":
        return <MediaKit />
      default:
        return <DashboardOverview />
    }
  }

  const handleLogout = async () => {
    try {
      // Try to refresh the session first
      const { data: sessionData, error: refreshError } = await supabase.auth.refreshSession()
      
      // If refresh fails, force clear the session
      if (refreshError || !sessionData.session) {
        await supabase.auth.signOut()
        localStorage.clear()
        toast.success('Logged out successfully')
        navigate('/login')
        return
      }

      // Proceed with normal signout
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
      await supabase.auth.signOut()
      localStorage.clear()
      navigate('/login')
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth error:', error)
          navigate('/login')
          return
        }

        if (!session) {
          navigate('/login')
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error:', error)
        navigate('/login')
      }
    }

    // Update this part
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoading(false)
      }
      if (event === 'SIGNED_OUT') {
        navigate('/login')
      }
    })

    checkAuth()

    // Ensure immediate cleanup
    return () => {
      subscription?.unsubscribe()
    }
  }, [navigate])

  console.log('Dashboard rendering, isLoading:', isLoading)

  const handleMenuClick = (componentName: string) => {
    setActiveComponent(componentName)
    localStorage.setItem('activeComponent', componentName)
    // Close sidebar only on mobile screens
    if (window.innerWidth < 768) { // 768px is Tailwind's 'md' breakpoint
      setCollapsed(true)
    }
  }

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <motion.img 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            src={logo} 
            alt="Creatorships Logo" 
            className="mx-auto h-16 w-16 mb-4"
          />
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-screen flex dark:bg-gray-950">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 border-r bg-white z-20",
          "h-full",
          collapsed ? "w-[60px] sm:w-[70px] md:w-[80px]" : "w-[240px] sm:w-[260px] md:w-[280px]",
          "transform transition-transform duration-300",
          collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Mobile Close Button - Only shows on mobile when sidebar is open */}
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 md:hidden h-8 w-8 rounded-full"
            onClick={() => setCollapsed(true)}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        )}

        {/* Sidebar content wrapper */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 sm:-right-4 top-4 sm:top-6 z-30 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white border shadow-sm hidden md:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            ) : (
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            )}
          </Button>

          {/* Logo */}
          <div className={cn(
            "flex items-center gap-2 sm:gap-3 p-4 sm:p-2",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <img 
              src={logo}
              alt="Logo" 
              className={cn(
                "rounded-lg object-contain",
                collapsed ? "h-8 w-8 sm:h-10 sm:w-10" : "h-16 ml-10 w-16 sm:h-20 sm:w-20"
              )}
            />
          </div>

          {/* Create Button */}
          <div className="px-2 sm:px-4 mb-4 sm:mb-4">
            <Button 
              className={cn(
                "w-full justify-start gap-2 text-white text-xs sm:text-sm",
                collapsed && "justify-center px-0"
              )}
              onClick={() => setShowCreateCampaign(true)}
            >
              <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              {!collapsed && <span>Create Campaign</span>}
            </Button>
          </div>

          {/* Menu Sections */}
          <div className="space-y-4 sm:space-y-6">
            {menuItems.map((section, index) => (
              <div key={index} className="px-2 sm:px-4">
                {!collapsed && (
                  <h3 className="mb-0 px-2 text-xs sm:text-sm font-medium text-gray-500">
                    {section.title}
                  </h3>
                )}
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = activeComponent === item.component
                    return (
                      <button
                        key={item.component}
                        onClick={() => handleMenuClick(item.component)}
                        className={cn(
                          "flex w-full items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2",
                          "text-xs sm:text-sm text-gray-500 transition-all hover:text-gray-900",
                          isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100",
                          collapsed && "justify-center"
                        )}
                      >
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1",
        collapsed ? "ml-[60px] sm:ml-[70px] md:ml-[80px]" : "ml-[240px] sm:ml-[260px] md:ml-[280px]"
      )}>
        <SubscriptionBanner />
        {/* Top Navigation */}
        <div className="border-b bg-white">
          <div className="flex h-12 sm:h-14 md:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Search */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 md:flex-initial">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-8 sm:h-9 md:h-10 w-[160px] sm:w-[200px] lg:w-[300px] rounded-md border 
                           border-gray-200 pl-8 sm:pl-10 text-xs sm:text-sm focus:outline-none 
                           focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Right side menu */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {mockNotifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 
                                     text-[10px] font-medium text-white flex items-center justify-center">
                        {mockNotifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-[380px] bg-white p-0"
                  sideOffset={8}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      Mark all as read
                    </Button>
                  </div>
                  <ScrollArea className="h-[calc(100vh-20rem)] min-h-[300px]">
                    <div className="px-2 py-1">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors
                            ${notification.read ? 'opacity-60' : 'bg-primary/5'}
                            hover:bg-gray-100`}
                        >
                          <div className={`mt-1 p-2 rounded-full 
                            ${notification.type === 'campaign' ? 'bg-green-100' : 
                              notification.type === 'message' ? 'bg-blue-100' : 'bg-gray-100'}`}
                          >
                            {notification.type === 'campaign' ? (
                              <Briefcase className="h-4 w-4 text-green-600" />
                            ) : notification.type === 'message' ? (
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Bell className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {notification.time}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t text-center">
                    <Button variant="ghost" size="sm" className="text-xs w-full">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 
                                    flex items-center justify-center">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      </div>
                      <div className="text-left hidden lg:block">
                        <div className="text-xs sm:text-sm font-medium">John Doe</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">john@example.com</div>
                      </div>
                    </div>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 hidden lg:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-[180px] sm:w-[200px] bg-white"
                  sideOffset={8}
                >
                  <DropdownMenuItem className="text-xs sm:text-sm cursor-pointer hover:bg-gray-100">
                    <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-xs sm:text-sm cursor-pointer hover:bg-gray-100 text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {renderComponent()}
          </div>
        </div>
      </div>

      {/* Create Campaign Modal */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent className="max-w-[90vw] sm:max-w-[85vw] md:max-w-4xl p-0 
                                 overflow-hidden bg-white rounded-lg shadow-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="p-4 sm:p-6"
          >
            <CreateCampaignForm onClose={() => setShowCreateCampaign(false)} />
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <span className="text-sm text-green-500">{change}</span>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description: string
  time: string
}

export function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg">
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-sm text-gray-400">{time}</span>
    </div>
  )
}