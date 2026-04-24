import React from 'react'
import { BarChart3, Users, ShieldAlert } from "lucide-react"

const AdminLayout = ({children}) => {
  return (
     <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden lg:block">
        <h1 className="text-xl font-black mb-10">BloodFinder Admin</h1>

        <nav className="space-y-3">
          <a href="/admin" className="flex items-center gap-3 p-3 bg-rose-600 rounded-xl font-bold">
            <BarChart3 size={18}/> Dashboard
          </a>

          <a href="/admin-approval" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl">
            <ShieldAlert size={18}/> Approvals
          </a>

          <a href="/admin-donors" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-xl">
            <Users size={18}/> Donors
          </a>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        {children}
      </main>

    </div>
  )
}

export default AdminLayout