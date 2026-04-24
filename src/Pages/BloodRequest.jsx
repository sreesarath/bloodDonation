import React, { useState, useEffect } from 'react';
import { Plus, Hospital, RefreshCw, Trash2, Phone, Users, Droplet, MapPin, AlertCircle, Calendar, CheckCircle } from 'lucide-react';
import Header from '../Components/Header';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { createRequestApi, getMyRequestApi, deleteRequestApi } from '../Services/AllApi';
import socket from '../Services/socket';

// Skeleton Loader Component
const RequestSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-48" />
    ))}
  </div>
);

const BloodRequest = () => {
  const [form, setForm] = useState({ hospital: "", bloodgroup: "O+", unitsNeeded: 1, startDate: "", endDate: "" });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const getToken = () => {
    const token = sessionStorage.getItem("token");
    return (!token || token === "undefined" || token === "null") ? null : token;
  };

  const fetchRequests = async () => {
    setFetching(true);
    const token = getToken();
    if (!token) return;
    try {
      const res = await getMyRequestApi(token);
      if (res.status === 200) setRequests(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load your requests");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    socket.on("requestAccepted", () => {
      toast.success("🎉 A donor accepted your request!");
      fetchRequests();
    });
    return () => socket.off("requestAccepted");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const reqBody = { ...form, lat: pos.coords.latitude, lng: pos.coords.longitude };
      try {
        const res = await createRequestApi(reqBody, token);
        if (res.status === 201) {
          toast.success("Request broadcasted successfully!");
          setForm({ hospital: "", bloodgroup: "O+", unitsNeeded: 1, startDate: "", endDate: "" });
          fetchRequests();
        }
      } catch (err) {
        toast.error("Failed to send request");
      } finally {
        setLoading(false);
      }
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Broadcast?",
      text: "This action will stop finding donors for this specific request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Remove"
    });

    if (result.isConfirmed) {
      const token = getToken();
      try {
        const res = await deleteRequestApi(id, token);
        if (res.status === 200) {
          Swal.fire("Deleted!", "Request has been removed.", "success");
          fetchRequests();
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">

          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Blood Requests</h1>
            <p className="text-slate-500 mt-2">Manage live requirements and connect with donors in real-time.</p>
          </div>

          {/* Broadcast Form */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Plus className="text-red-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">New Broadcast</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Hospital Name</label>
                  <input type="text" placeholder="e.g. City General" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Blood Group</label>
                  <select value={form.bloodgroup} onChange={e => setForm({ ...form, bloodgroup: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white">
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Units Required</label>
                  <input type="number" min="1" value={form.unitsNeeded} onChange={e => setForm({ ...form, unitsNeeded: e.target.value })} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Start Date</label>
                  <input type="date" onChange={(e) => setForm({ ...form, startDate: e.target.value })} value={form.startDate} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">End Date</label>
                  <input type="date" onChange={(e) => setForm({ ...form, endDate: e.target.value })} value={form.endDate} className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" required />
                </div>
              </div>

              <button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" /> : <>Broadcast Request <CheckCircle size={18} /></>}
              </button>
            </form>
          </section>

          {/* List Section */}
  {/* List Section */}
<h3 className="text-2xl font-bold mb-6 text-slate-800">
  Your Active Broadcasts
</h3>

{fetching ? (
  <div className="text-center py-20 text-slate-400 animate-pulse">
    <RefreshCw className="mx-auto mb-2 animate-spin" />
    Loading your requests...
  </div>
) : requests.length > 0 ? (
  <div className="grid md:grid-cols-2 gap-6">
    {requests.map(req => (
      <div
        key={req._id}
        className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition">
              {req.hospital}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin size={14} /> Active Request
            </div>
          </div>

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
            {req.bloodgroup}
          </span>
        </div>

        {/* META INFO */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
            Units: {req.unitsNeeded}
          </span>

          <span className={`text-xs font-semibold px-3 py-1 rounded-lg 
            ${req.status === "completed"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"}`}>
            {req.status}
          </span>
        </div>

        {/* DONORS SECTION */}
        <div className="border-t pt-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users size={14} />
            Accepted Donors ({req.donors?.length || 0})
          </h4>

          {req.donors?.length > 0 ? (
            <div className="space-y-3">
              {req.donors.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border hover:bg-white hover:shadow transition"
                >
                  {/* LEFT */}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {d.name}
                    </p>

                    {d.date && (
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <Calendar size={12} />
                        {new Date(d.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* RIGHT */}
                  <a
                    href={`tel:${d.phone}`}
                    className="text-xs bg-white border px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-100 flex items-center gap-1 font-medium"
                  >
                    <Phone size={12} />
                    Call
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400 italic bg-slate-50 p-3 rounded-lg">
              <AlertCircle size={14} />
              No donors have accepted yet.
            </div>
          )}
        </div>

        {/* ACTION */}
        <button
          onClick={() => handleDelete(req._id)}
          className="w-full mt-6 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Cancel Broadcast
        </button>
      </div>
    ))}
  </div>
) : (
  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
    <Droplet size={48} className="mx-auto text-slate-300 mb-4" />
    <h4 className="text-lg font-semibold text-slate-700">
      No active broadcasts
    </h4>
    <p className="text-sm text-slate-400 mt-1">
      Create a request to notify nearby donors.
    </p>
  </div>
)}
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BloodRequest;