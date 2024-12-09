interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
}

export default function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <p className="text-sm text-green-600 mt-1">{change}</p>
        </div>
        <div className="text-gray-600">{icon}</div>
      </div>
    </div>
  )
} 