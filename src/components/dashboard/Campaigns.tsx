import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, BarChart3, Target } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

// Mock data for campaigns
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Collection Launch",
    status: "Active",
    objective: "Brand Awareness",
    budget: 15000,
    startDate: "2024-06-01",
    creators: 12,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    deliverables: {
      posts: 3,
      stories: 5,
      reels: 2
    }
  },
  {
    id: 2,
    name: "Holiday Season Campaign",
    status: "Draft",
    objective: "Sales/Conversions",
    budget: 25000,
    startDate: "2024-12-01",
    creators: 8,
    image: "https://images.unsplash.com/photo-1513094735237-8f2714d57c13",
    deliverables: {
      posts: 4,
      stories: 8,
      reels: 4
    }
  },
  {
    id: 3,
    name: "Spring Fashion Week",
    status: "Completed",
    objective: "Engagement",
    budget: 18000,
    startDate: "2024-03-15",
    creators: 15,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    deliverables: {
      posts: 2,
      stories: 4,
      reels: 3
    }
  }
]

interface CampaignModalProps {
  campaign: Campaign | null
  isOpen: boolean
  onClose: () => void
}

function CampaignModal({ campaign, isOpen, onClose }: CampaignModalProps) {
  if (!campaign) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-bold mb-1">{campaign.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{campaign.objective}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Campaign Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="text-lg font-semibold">
                    ${campaign.budget.toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Creators</p>
                  <p className="text-lg font-semibold">{campaign.creators}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge 
                    variant={campaign.status === "Active" ? "default" : "secondary"}
                    className="mt-1 text-white"
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Campaign Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">
                  This campaign aims to promote our latest collection through authentic creator content,
                  focusing on lifestyle integration and product storytelling.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Campaign Goals</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Increase brand awareness among target demographic</li>
                  <li>Drive engagement through authentic creator content</li>
                  <li>Generate user-generated content for brand channels</li>
                  <li>Boost sales during campaign period</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Deliverables */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content Deliverables</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(campaign.deliverables).map(([key, value]) => (
                <div key={key} className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="text-sm font-medium capitalize mb-1">{key}</h4>
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-sm text-muted-foreground">Required posts</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Campaign Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(campaign.startDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">30 days</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface Campaign {
  id: number
  name: string
  status: string
  objective: string
  budget: number
  startDate: string
  creators: number
  image: string
  deliverables: {
    posts: number
    stories: number
    reels: number
  }
}

export default function Campaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
            onClick={() => setSelectedCampaign(campaign)}
          >
            {/* Cover Image */}
            <div className="relative h-48 group">
              <img
                src={campaign.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge 
                  variant={campaign.status === "Active" ? "default" : "secondary"}
                  className="text-white"
                >
                  {campaign.status}
                </Badge>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="p-4">
              <div>
                <h3 className="font-bold hover:text-blue-600 transition-colors">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500">{campaign.objective}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 my-4">
                <Stat
                  icon={<DollarSign className="h-4 w-4" />}
                  value={`$${campaign.budget.toLocaleString()}`}
                  label="Budget"
                />
                <Stat
                  icon={<Users className="h-4 w-4" />}
                  value={campaign.creators}
                  label="Creators"
                />
                <Stat
                  icon={<CalendarIcon className="h-4 w-4" />}
                  value={new Date(campaign.startDate).toLocaleDateString()}
                  label="Start Date"
                />
              </div>

              {/* Deliverables */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(campaign.deliverables).map(([key, value]) => (
                  <Badge 
                    key={key} 
                    variant="secondary"
                    className="capitalize text-white"
                  >
                    {value} {key}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CampaignModal
        campaign={selectedCampaign}
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
      />
    </div>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string | number; label: string }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center text-gray-500 mb-1">
        {icon}
      </div>
      <div className="font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
} 