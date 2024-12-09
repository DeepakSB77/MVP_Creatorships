import { useForm } from "react-hook-form"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"


type CampaignFormData = {
  campaignName: string
  objective: string
  campaignType: string
  budget: number
  startDate: string
  endDate: string
  selectedCreators: string[]
  deliverables: {
    posts: number
    stories: number
    reels: number
    videos: number
  }
  contentGuidelines: string
  brandGuidelines: File[]
  referenceContent: File[]
  additionalNotes: string
  targetAudience: {
    ageRange: string
    location: string[]
    interests: string[]
  }
  paymentTerms: string
}

interface CreateCampaignFormProps {
  onClose: () => void;
}

export default function CreateCampaignForm({ onClose }: CreateCampaignFormProps) {
  const form = useForm<CampaignFormData>()

  const onSubmit = (data: CampaignFormData) => {
    console.log(data)
    onClose() // Close modal after submission
  }

  return (
    <>
      {/* Just keep the title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fill in the details below to create a new campaign.</h1>
      </div>

      <div className="max-h-[80vh] overflow-y-auto">
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Campaign Information */}
              <div className="space-y-4">
                
                
                <FormField
                  control={form.control}
                  name="campaignName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Collection 2024" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem className="z-10">
                      <FormLabel>Campaign Objective</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          <SelectItem value="awareness" className="cursor-pointer hover:bg-gray-100">Brand Awareness</SelectItem>
                          <SelectItem value="engagement" className="cursor-pointer hover:bg-gray-100">Engagement</SelectItem>
                          <SelectItem value="sales" className="cursor-pointer hover:bg-gray-100">Sales/Conversions</SelectItem>
                          <SelectItem value="traffic" className="cursor-pointer hover:bg-gray-100">Website Traffic</SelectItem>
                          <SelectItem value="followers" className="cursor-pointer hover:bg-gray-100">Follower Growth</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full h-10 px-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                  "bg-white border border-input"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              classNames={{
                                day_selected: "bg-primary text-white hover:bg-primary hover:text-white"
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Deliverables Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Content Requirements</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="deliverables.posts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Posts</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliverables.stories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Stories</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliverables.reels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Reels</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliverables.videos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Videos</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="contentGuidelines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Guidelines</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your content requirements, dos and don'ts, specific hashtags, etc."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* File Uploads */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Supporting Materials</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brandGuidelines"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Guidelines</FormLabel>
                        <FormControl>
                          <div 
                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById('brandGuidelinesInput')?.click()}
                          >
                            <input
                              id="brandGuidelinesInput"
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                field.onChange(files)
                              }}
                            />
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              Drop files here or click to upload
                            </p>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referenceContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Content</FormLabel>
                        <FormControl>
                          <div 
                            className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                            onClick={() => document.getElementById('referenceContentInput')?.click()}
                          >
                            <input
                              id="referenceContentInput"
                              type="file"
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                const files = Array.from(e.target.files || [])
                                field.onChange(files)
                              }}
                            />
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              Drop files here or click to upload
                            </p>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other important information..."
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="text-white">
                  Submit Campaign
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </>
  )
}