import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Share2, Eye, Heart, MessageCircle, BarChart3, DollarSign, Instagram } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Mock campaign report data
const campaignReports = [
  {
    id: 1,
    name: "Summer Collection Launch",
    period: "June 1 - June 30, 2024",
    status: "Completed",
    budget: 15000,
    totalReach: 1250000,
    engagement: {
      likes: 85000,
      comments: 12000,
      shares: 5000,
      saves: 3000,
    },
    engagementRate: 8.4,
    impressions: 2100000,
    creators: [
      {
        name: "Sarah Johnson",
        handle: "@sarahjstyle",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
        followers: 500000,
        performance: {
          reach: 280000,
          engagement: 25000,
          engagementRate: 8.9,
        },
        content: [
          {
            type: "Post",
            image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop",
            reach: 150000,
            likes: 15000,
            comments: 800,
            caption: "Summer vibes with @brandname's new collection! 🌞 #SummerStyle",
            date: "2024-06-15"
          },
          {
            type: "Reel",
            thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=800&fit=crop",
            reach: 130000,
            views: 180000,
            caption: "How to style the new summer collection ✨",
            date: "2024-06-18"
          }
        ]
      },
      // Add more creators...
    ],
    roi: 3.2,
    conversions: 1200,
    revenue: 48000,
  },
  // Add more campaign reports...
]

export default function Reports() {
  const handlePrintReport = () => {
    const printContent = document.querySelector('.printable-content')?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Campaign Report</title>
            <style>
              body { 
                padding: 20px;
                font-family: system-ui, -apple-system, sans-serif;
                color: #0f172a;
              }
              .p-6 { padding: 1.5rem; }
              .space-y-6 > * + * { margin-top: 1.5rem; }
              .rounded-lg { border-radius: 0.5rem; }
              .bg-primary\/5 { background-color: rgba(59, 130, 246, 0.05); }
              .text-xl { font-size: 1.25rem; }
              .text-sm { font-size: 0.875rem; }
              .text-2xl { font-size: 1.5rem; }
              .font-semibold { font-weight: 600; }
              .text-muted-foreground { color: #64748b; }
              .grid { display: grid; }
              .gap-4 { gap: 1rem; }
              .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
              .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
              .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
              .mb-4 { margin-bottom: 1rem; }
              .flex { display: flex; }
              .items-center { align-items: center; }
              .gap-3 { gap: 0.75rem; }
              .border-b { border-bottom: 1px solid #e2e8f0; }
              .pb-6 { padding-bottom: 1.5rem; }
              .last\\:border-0:last-child { border: 0; }
              .last\\:pb-0:last-child { padding-bottom: 0; }
              img { max-width: 100%; height: auto; }
              .aspect-square { aspect-ratio: 1 / 1; }
              .object-cover { object-fit: cover; }
              .border { border: 1px solid #e2e8f0; }
              .overflow-hidden { overflow: hidden; }
              .text-primary { color: #3b82f6; }
              .text-lg { font-size: 1.125rem; }
              .card { 
                background: white;
                border-radius: 0.5rem;
                border: 1px solid #e2e8f0;
                margin-bottom: 1.5rem;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
              }
              .avatar {
                width: 40px;
                height: 40px;
                border-radius: 9999px;
                overflow: hidden;
              }
              .avatar img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .text-right { text-align: right; }
              .justify-between { justify-content: space-between; }
              .items-start { align-items: flex-start; }
              .font-medium { font-weight: 500; }
              @media print {
                @page {
                  margin: 20mm;
                  size: A4;
                }
                body {
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="p-6 space-y-6 print:!p-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-2xl font-bold">Campaign Reports</h1>
        <div className="flex gap-4 print:hidden">
          <Select defaultValue="1">
            <SelectTrigger className="w-[240px] bg-white dark:bg-gray-950">
              <SelectValue placeholder="Select Campaign" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-950">
              <SelectItem value="1">Summer Collection Launch</SelectItem>
              <SelectItem value="2">Holiday Season Campaign</SelectItem>
              <SelectItem value="3">Spring Fashion Week</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePrintReport} className="text-white">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="printable-content">
        {campaignReports.map((report) => (
          <div key={report.id} className="space-y-6">
            {/* Campaign Overview */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-semibold">${report.budget.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-2xl font-semibold">{(report.totalReach / 1000000).toFixed(1)}M</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-semibold">{report.engagementRate}%</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground">ROI</p>
                  <p className="text-2xl font-semibold">{report.roi}x</p>
                </div>
              </div>
            </Card>

            {/* Engagement Metrics */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Engagement Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Likes</p>
                    <p className="text-lg font-semibold">{report.engagement.likes.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="text-lg font-semibold">{report.engagement.comments.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Share2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Shares</p>
                    <p className="text-lg font-semibold">{report.engagement.shares.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Saves</p>
                    <p className="text-lg font-semibold">{report.engagement.saves.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Creator Performance */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Creator Performance</h2>
              <div className="space-y-6">
                {report.creators.map((creator, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-semibold">{(creator.followers / 1000)}K</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Reach</p>
                        <p className="font-semibold">{(creator.performance.reach / 1000)}K</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Engagement</p>
                        <p className="font-semibold">{(creator.performance.engagement / 1000)}K</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Eng. Rate</p>
                        <p className="font-semibold">{creator.performance.engagementRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Creator Content */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Creator Content</h2>
              <div className="space-y-6">
                {report.creators.map((creator, index) => (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-semibold">{(creator.followers / 1000)}K</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Content</p>
                        <p className="font-semibold">{creator.content.length}</p>
                      </div>
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm text-muted-foreground">Followers</p>
                        <p className="font-semibold">{creator.followers / 1000}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Creator Content Showcase */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Content</h2>
              <div className="space-y-8">
                {report.creators.map((creator, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar>
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">{creator.handle}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {creator.content.map((post, postIndex) => (
                        <div key={postIndex} className="border rounded-lg overflow-hidden">
                          <div className="relative aspect-square">
                            <img
                              src={post.type === "Post" ? post.image : post.thumbnail}
                              alt={`Content by ${creator.name}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Instagram className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{post.type}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {post.caption}
                            </p>
                            <div className="flex gap-4 text-sm">
                              {post.type === "Post" ? (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{post.likes?.toLocaleString() ?? 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>{post.comments?.toLocaleString() ?? 0}</span>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  <span>{post.views?.toLocaleString() ?? 0} views</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ROI & Conversions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Campaign Results</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Revenue Generated</p>
                  </div>
                  <p className="text-2xl font-semibold">${report.revenue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Conversions</p>
                  </div>
                  <p className="text-2xl font-semibold">{report.conversions}</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <p className="text-sm text-muted-foreground">Total Impressions</p>
                  </div>
                  <p className="text-2xl font-semibold">{(report.impressions / 1000000).toFixed(1)}M</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
} 