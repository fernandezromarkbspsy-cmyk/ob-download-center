"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, ShoppingCart, Users, AlertTriangle } from "lucide-react"

interface OverviewCardProps {
  icon: React.ReactNode
  value: string
  label: string
  isSpecial?: boolean
}

function OverviewCard({ icon, value, label, isSpecial = false }: OverviewCardProps) {
  return (
    <Card className={`${isSpecial ? 'bg-orange-50 border-orange-200' : ''} hover-lift premium-shadow animate-fade-in group`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
              isSpecial ? 'bg-orange-100 group-hover:bg-orange-200' : 'bg-blue-100 group-hover:bg-blue-200'
            }`}>
              <div className={`transition-colors duration-300 ${isSpecial ? 'text-orange-600 group-hover:text-orange-700' : 'text-blue-600 group-hover:text-blue-700'}`}>
                {icon}
              </div>
            </div>
            <div>
              <div className={`text-2xl font-bold transition-colors duration-300 ${isSpecial ? 'text-orange-800 group-hover:text-orange-900' : 'text-foreground group-hover:text-primary'}`}>
                {value}
              </div>
              <div className={`text-sm transition-colors duration-300 ${isSpecial ? 'text-orange-600 group-hover:text-orange-700' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {label}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Over View</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <OverviewCard
            icon={<Package className="w-6 h-6" />}
            value="5483"
            label="Total Products"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <OverviewCard
            icon={<ShoppingCart className="w-6 h-6" />}
            value="2859"
            label="Orders"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <OverviewCard
            icon={<Users className="w-6 h-6" />}
            value="583 K"
            label="Total Customers"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <OverviewCard
            icon={<AlertTriangle className="w-6 h-6" />}
            value="12"
            label="Out of Stock"
            isSpecial={true}
          />
        </div>
      </div>
    </div>
  )
}
