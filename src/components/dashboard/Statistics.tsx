import { Card } from "@/components/ui/card"
import { TrendingUp, Users, Target, BarChart2 } from "lucide-react"

// Mock data - replace with your actual data source
const stats = [
  {
    title: "Active Campaigns",
    value: "12",
    change: "+2",
    icon: Target,
    trend: "up"
  },
  {
    title: "Completed Campaigns",
    value: "8",
    change: "+3",
    icon: Target,
    trend: "up"
  },
  {
    title: "Total Creators",
    value: "156",
    change: "+14",
    icon: Users,
    trend: "up"
  },
  {
    title: "Engagement Rate",
    value: "4.6%",
    change: "+0.8",
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "Total Budget",
    value: "$45,678",
    change: "+$12,234",
    icon: BarChart2,
    trend: "up"
  }
]

export default function Statistics() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaign Statistics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className={`p-6 ${
              index === stats.length - 1 ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className={`text-sm mt-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 