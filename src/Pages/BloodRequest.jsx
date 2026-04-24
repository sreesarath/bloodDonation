import React, { useState, useEffect } from 'react';
import { Plus, Hospital, RefreshCw, Trash2, Phone, User, Users, Droplet, MapPin, AlertCircle } from 'lucide-react';
import Header from '../Components/Header';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';

import Swal from 'sweetalert2';
import { createRequestApi, getMyRequestApi, deleteRequestApi } from '../Services/AllApi';
import socket from '../Services/socket';

const BloodRequest = () => {
  const [form, setForm] = useState({ hospital: "", bloodgroup: "O+", unitsNeeded: 1 });
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
  socket.on("requestAccepted", (data) => {
    toast.success("🎉 A donor accepted your request!");
    fetchRequests(); 
  });

  return () => socket.off("requestAccepted");
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();
    
    if (!token) {
      toast.error("Not logged in");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const reqBody = { ...form, lat: pos.coords.latitude, lng: pos.coords.longitude };
      try {
        const res = await createRequestApi(reqBody, token);
        if (res.status === 201) {
          toast.success("Request broadcasted!");
          setForm({ hospital: "", bloodgroup: "O+", unitsNeeded: 1 });
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
      title: "Cancel this request?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, cancel it"
    });

    if (result.isConfirmed) {
      const token = getToken();
      try {
        const res = await deleteRequestApi(id, token);
        if (res.status === 200) {
          Swal.fire("Deleted!", "Your request has been removed.", "success");
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
        <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Blood Requests</h1>
            <p className="text-slate-500 mt-3 text-lg max-w-lg mx-auto">Manage your live blood requirements and connect with potential donors instantly.</p>
          </div>

          {/* Form */}
          <section className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Plus className="text-red-600" /> Create New Broadcast
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-6 gap-4">
              <div className="md:col-span-3 relative">
                <Hospital className="absolute left-3 top-4 text-slate-400" size={20} />
                <input type="text" placeholder="Hospital Name" value={form.hospital} onChange={e => setForm({...form, hospital: e.target.value})} className="w-full pl-10 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-100 outline-none transition" required />
              </div>
              <select value={form.bloodgroup} onChange={e => setForm({...form, bloodgroup: e.target.value})} className="md:col-span-1 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-100 bg-white">
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
              </select>
              <input type="number" min="1" value={form.unitsNeeded} onChange={e => setForm({...form, unitsNeeded: e.target.value})} className="md:col-span-1 p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-100" placeholder="Units" />
              <button disabled={loading} className="md:col-span-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" /> : "Broadcast"}
              </button>
            </form>
          </section>

          {/* Requests List */}
          <h3 className="text-2xl font-bold mb-6 text-slate-800">Your Active Broadcasts</h3>
          
          {fetching ? (
            <div className="text-center py-20 text-slate-400 animate-pulse">Loading...</div>
          ) : requests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map(req => (
                <div key={req._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{req.hospital}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                        <MapPin size={14}/> Active
                      </div>
                    </div>
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">{req.bloodgroup}</span>
                  </div>

                  <div className="flex gap-3 mb-6">
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">Units: {req.unitsNeeded}</span>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wide">{req.status}</span>
                  </div>

                  {/* Donors */}
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Users size={14} /> Accepted: {req.donors?.length || 0}
                    </h4>
                    {req.donors?.length > 0 ? (
                      <div className="space-y-2">
                        {req.donors.map((d, i) => (
                          <div key={i} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-sm font-medium">{d.name}</span>
                            <a href={`tel:${d.phone}`} className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-green-50 text-slate-700 px-3 py-1 rounded-md text-xs font-bold transition">
                              <Phone size={12} /> Call
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic flex items-center gap-2"><AlertCircle size={14}/> No responses yet.</p>
                    )}
                  </div>

                  <button onClick={() => handleDelete(req._id)} className="w-full mt-6 text-red-500 hover:bg-red-50 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                    <Trash2 size={16} /> Cancel Broadcast
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Droplet size={48} className="mx-auto text-slate-200 mb-4" />
              <h4 className="text-lg font-semibold text-slate-700">No active broadcasts</h4>
              <p className="text-slate-500">Your requests will appear here once created.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BloodRequest;