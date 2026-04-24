import React from 'react'
import AdminLayout from '../Admin-component/AdminLayout'



const DonorsPage = () => {
      const donors = [
    { id: 1, name: "Sarath", group: "O+", city: "Chennai", status: "Approved" },
    { id: 2, name: "Rahul", group: "B-", city: "Mumbai", status: "Approved" }
  ]
  return (
    <AdminLayout>
           <h1 className="text-3xl font-black mb-6">All Donors</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {donors.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="font-bold text-xl">{d.name}</h2>
            <p>Blood Group: {d.group}</p>
            <p>City: {d.city}</p>
            <p>Status: {d.status}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}

export default DonorsPage