import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSubscription } from "@/hooks/useSubscription"
import { Check } from "lucide-react"

export default function Subscription() {
  const { pagesViewed } = useSubscription()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <Card className="max-w-lg w-full p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Upgrade Your Account</h1>
          <p className="text-gray-600 mt-2">
            You've viewed {pagesViewed} pages. Subscribe to continue accessing all features.
          </p>
        </div>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Pro Plan</h2>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Unlimited page views
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                100 email credits monthly
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                Advanced features
              </li>
            </ul>
            <Button className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700">
              Subscribe Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
} 