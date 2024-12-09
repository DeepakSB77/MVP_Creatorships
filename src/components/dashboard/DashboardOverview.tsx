import { Card } from "@/components/ui/card"
import { Users, BarChart3, MessageSquare, Briefcase } from "lucide-react"

export default function DashboardOverview() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold">Dashboard Overview</h1>
      
      {/* Stats Grid - responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Creators"
          value="1,234"
          change="+12.3% from last month"
          icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        />
        <StatCard
          title="Active Campaigns"
          value="56"
          change="+3.2% from last month"
          icon={<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        />
        <StatCard
          title="Messages"
          value="892"
          change="+28.4% from last month"
          icon={<MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        />
        <StatCard
          title="Total Revenue"
          value="$12,345"
          change="+15.8% from last month"
          icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
        />
      </div>

      {/* Recent Activity - responsive padding and text */}
      <Card className="p-3 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Recent Activity</h2>
        <div className="space-y-2 sm:space-y-3">
          <ActivityItem
            icon={<Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
            title="New Creator Joined"
            description="Jane Smith joined the platform"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
            title="Campaign Created"
            description="Summer Collection Campaign launched"
            time="5 hours ago"
          />
          <ActivityItem
            icon={<MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
            title="New Message"
            description="You have a new message from John Doe"
            time="1 day ago"
          />
        </div>
      </Card>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

function StatCard({ title, value, change, icon }: StatCardProps) {
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

function ActivityItem({ icon, title, description, time }: ActivityItemProps) {
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