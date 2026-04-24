import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import AdminLayout from '../Admin-component/AdminLayout'



const DashBoardPage = () => {
      const data = [
    { name: "O+", value: 40 },
    { name: "A+", value: 30 },
    { name: "B+", value: 20 },
    { name: "Others", value: 10 },
  ]

  const COLORS = ["#e11d48", "#f43f5e", "#fb7185", "#fda4af"]
  return (
    <AdminLayout>
    <h1 className="text-3xl font-black mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-400">Total Donors</p>
          <h2 className="text-3xl font-black">1284</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-400">Pending Requests</p>
          <h2 className="text-3xl font-black">24</h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-sm text-gray-400">Approved</p>
          <h2 className="text-3xl font-black">1020</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl shadow w-full max-w-md">
        <h2 className="font-bold mb-4">Blood Distribution</h2>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={80}>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      </AdminLayout>
  )
}

export default DashBoardPage