"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts"

const donutData = [
  { name: "Sold units", value: 32, color: "#A7D9ED" },
  { name: "Total units", value: 68, color: "#5B9BD5" }
]

const lineData = [
  { month: "Dec", expense: 15, profit: 20 },
  { month: "Jan", expense: 18, profit: 25 },
  { month: "Feb", expense: 22, profit: 30 },
  { month: "Mar", expense: 25, profit: 35 },
  { month: "Apr", expense: 28, profit: 40 },
  { month: "May", expense: 30, profit: 45 },
  { month: "Jun", expense: 32, profit: 50 }
]

const storeData = [
  { name: "Gateway VR", sales: 674 },
  { name: "Mall of Asia", sales: 542 },
  { name: "SM Megamall", sales: 489 },
  { name: "Greenbelt", sales: 423 },
  { name: "Robinsons", sales: 398 },
  { name: "Ayala Center", sales: 356 },
  { name: "Glorietta", sales: 312 },
  { name: "Power Plant", sales: 289 },
  { name: "Eastwood", sales: 267 },
  { name: "Bonifacio", sales: 234 }
]

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inventory Values - Donut Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-300"></div>
              <span className="text-sm text-muted-foreground">Sold units</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-muted-foreground">Total units</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Stores by Sales - Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Stores by Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {storeData.map((store, index) => (
              <div key={store.name} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{store.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-300 h-2 rounded-full" 
                      style={{ width: `${(store.sales / 674) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{store.sales}k</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expense vs Profit - Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Expense vs Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                  domain={[0, 60]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#FFAB91" 
                  strokeWidth={3}
                  dot={{ fill: '#FFAB91', strokeWidth: 2, r: 4 }}
                  name="Expense"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#8BC34A" 
                  strokeWidth={3}
                  dot={{ fill: '#8BC34A', strokeWidth: 2, r: 4 }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-300"></div>
              <span className="text-sm text-muted-foreground">Expense</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-sm text-muted-foreground">Profit</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
