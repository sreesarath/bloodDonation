import React, { useState } from 'react'
import { Check, X } from "lucide-react"
import AdminLayout from '../Admin-component/AdminLayout'


const ApprovalPage = () => {
      const [requests, setRequests] = useState([
    { id: 1, name: "Sarath", group: "O+", status: "Pending" },
    { id: 2, name: "Rahul", group: "B-", status: "Pending" }
  ])
    const approve = (id) => {
    setRequests(req => req.filter(r => r.id !== id))
    alert("Approved")
  }

  const reject = (id) => {
    setRequests(req => req.filter(r => r.id !== id))
    alert("Rejected")
  }
  return (
   <AdminLayout>
   <h1 className="text-3xl font-black mb-6">Approvals</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th>Blood Group</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-t">
                <td className="p-4 font-bold">{r.name}</td>
                <td>{r.group}</td>
                <td>{r.status}</td>
                <td className="flex gap-3 p-4">
                  <button onClick={() => approve(r.id)} className="bg-green-500 text-white p-2 rounded">
                    <Check size={16}/>
                  </button>
                  <button onClick={() => reject(r.id)} className="bg-red-500 text-white p-2 rounded">
                    <X size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   </AdminLayout>
  )
}

export default ApprovalPage