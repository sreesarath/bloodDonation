import React from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts"
import { Droplets, Activity, Clock, CheckCircle2, TrendingUp, Filter } from "lucide-react"
import AdminLayout from '../Admin-component/AdminLayout'

import { useState } from 'react'
import { genarateReportApi, getAdminDash } from '../Services/AllApi'
import { useEffect } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const DashBoardPage = () => {
  // Blood group data

  const [stats, setStats] = useState({
    totalDonors: 0,
    pendingRequests: 0,
    ApprovedRequests: 0,
    successRate: '0 %'
  })
  const [trendData, setTrendData] = useState([])
  const [chartData, setChartData] = useState([])
  const [range, setRange] = useState("6months")

  useEffect(() => {
    const fetchStat = async () => {
      const token = sessionStorage.getItem('token')
      const res = await getAdminDash(token, range)
      if (res.status === 200) {
        setStats(res.data.stats)
        setChartData(res.data.distribution)
        setTrendData(res.data.trendData)
      }
    }
    fetchStat()
  }, [range])

  const handleDownload = async () => {
    const token=sessionStorage.getItem('token')

    const res = await genarateReportApi(token,range)

  
  const url = window.URL.createObjectURL(new Blob([res.data]))

  const a = document.createElement("a")
  a.href = url
  a.download = "report.csv"
  a.click()
  window.URL.revokeObjectURL(url)
  }

  const totalUnits = chartData.reduce((sum, ind) => sum + ind.value, 0)

  const statCards = [
    { label: 'Total Donors', value: stats.totalDonors, trend: 'Verified', icon: <Droplets />, color: 'rose' },
    { label: 'Pending Requests', value: stats.pendingRequests, trend: 'Action Needed', icon: <Clock />, color: 'amber' },
    { label: 'Approved Requests', value: stats.ApprovedRequests, trend: 'Completed', icon: <CheckCircle2 />, color: 'emerald' },
    { label: 'Donation Success', value: stats.successRate, trend: 'Avg. Rate', icon: <TrendingUp />, color: 'blue' },
  ];



  


  const COLORS = ["#e11d48", "#fb7185", "#f43f5e", "#94a3b8"];

  return (
    <AdminLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Analytics <span className="text-rose-600"><Activity size={32} /></span>
          </h1>
          <p className="text-slate-500 mt-1">Monitor blood bank efficiency and donor engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            onChange={(e) => setRange(e.target.value)}
            className="bg-white border rounded-xl px-3 py-2"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button onClick={handleDownload} className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200">
            Generate Report
          </button>
        </div>
      </div>

      {/* Advanced Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {
          statCards.map((val, ind) => (
            <div key={ind} className='bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all'>
              <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center bg-${val.color}-50 text-${val.color}-600`}>
                {val.icon}
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{val.label}</p>
              <div className="flex items-end justify-between mt-2">
                <h2 className="text-3xl font-black text-slate-900">{val.value}</h2>
                <span className="text-slate-400 text-[10px] font-bold">{val.trend}</span>
              </div>

            </div>
          ))
        }
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Donation Trends</h2>
              <p className="text-slate-500 text-sm italic">Monthly volume analysis</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-500 px-3 py-2 outline-none cursor-pointer">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="donations" stroke="#e11d48" strokeWidth={4} fillOpacity={1} fill="url(#colorDonations)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart Inventory */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
          <h2 className="text-2xl font-black text-slate-900 mb-2 text-center">Inventory</h2>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 leading-none">{totalUnits}</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Units</span>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            {chartData.map((item, i) => {
              const percentage = totalUnits
                ? ((item.value / totalUnits) * 100).toFixed(0)
                : 0

              return (
                <div key={item.name} className="flex items-center group cursor-default">
                  <div
                    className="w-2 h-8 rounded-full transition-all group-hover:w-3 mr-3"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></div>

                  <span className="flex-1 text-slate-600 font-bold text-sm tracking-wide">
                    {item.name} Group
                  </span>

                  <span className="bg-slate-50 px-3 py-1 rounded-full font-black text-xs text-slate-900 transition-colors group-hover:bg-rose-50 group-hover:text-rose-600">
                    {percentage}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

export default DashBoardPage