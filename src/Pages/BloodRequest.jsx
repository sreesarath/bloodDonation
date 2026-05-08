import React, { useState, useEffect } from 'react';
import { Plus, Hospital, RefreshCw, Trash2, Phone, Calendar, Droplet, MapPin, CheckCircle, AlertCircle, Activity, History } from 'lucide-react';
import Header from '../Components/Header';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { createRequestApi, getMyRequestApi, deleteRequestApi, rateDonorApi } from '../Services/AllApi';
import socket from '../Services/socket';

const BloodRequest = () => {
  const [form, setForm] = useState({ hospital: "", bloodgroup: "O+", unitsNeeded: 1, startDate: "", endDate: "" });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [activeTab, setActiveTab] = useState('active');

  const getToken = () => {
    const token = sessionStorage.getItem("token");
    return (!token || token === "undefined" || token === "null") ? null : token;
  };

  const openRatingModal = (donor) => {
    setSelectedDonor(donor);
    setShowRating(true);
  };

  const fetchRequests = async () => {
    setFetching(true);
    const token = getToken();
    if (!token) { setFetching(false); return; }
    try {
      const res = await getMyRequestApi(token);
      if (res.status === 200) setRequests(res.data.data || []);
    } catch (err) { toast.error("Failed to load your requests"); } finally { setFetching(false); }
  };

  useEffect(() => {
    fetchRequests();
    const handler = () => { toast.success("🎉 A donor accepted your request!"); fetchRequests(); };
    socket.on("requestAccepted", handler);
    return () => socket.off("requestAccepted", handler);
  }, []);

  const handleRatingSubmit = async () => {
    const token = getToken();
    try {
      const res = await rateDonorApi(selectedDonor.requestId, { donorId: selectedDonor.donorId, rating, review }, token);
      if (res.status === 200) {
        toast.success("Rated successfully ⭐");
        setShowRating(false); setRating(0); setReview(""); setSelectedDonor(null); fetchRequests();
      }
    } catch (err) { toast.error("Rating failed"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = getToken();
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const reqBody = {
        ...form,
        unitsNeeded: Number(form.unitsNeeded),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      try {
        const res = await createRequestApi(reqBody, token);
        if (res.status === 201) {
          toast.success("Request broadcasted successfully!");
          setForm({ hospital: "", bloodgroup: "O+", unitsNeeded: 1, startDate: "", endDate: "" });
          fetchRequests();
        }
      } catch (err) { toast.error("Failed to send request"); } finally { setLoading(false); }
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
      } catch (err) { toast.error("Delete failed"); }
    }
  };
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'history') {
      // Logic: Request is marked 'completed' or units needed are fully met
      return req.status === 'completed' || (req.donors?.filter(d => d.status === 'completed').length >= req.unitsNeeded);
    } else {
      // Logic: Still active and looking for donors
      return req.status !== 'completed' && (req.donors?.filter(d => d.status === 'completed').length < req.unitsNeeded);
    }
  });
  const formatDateOnly = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <ProtectedPage>
      {/* Rating Modal */}
      {showRating && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800">Rate Donor</h3>
            <p className="text-sm text-slate-500 mb-6">Your feedback helps others trust donors</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)} className={`cursor-pointer text-3xl transition-all ${star <= rating ? "scale-110 text-yellow-400" : "text-gray-200 hover:text-yellow-200"}`}>★</span>
              ))}
            </div>
            <textarea placeholder="Write your experience..." value={review} onChange={(e) => setReview(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl mb-6 focus:ring-2 focus:ring-yellow-400 outline-none transition" />
            <div className="flex gap-2">
              <button onClick={() => setShowRating(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
              <button onClick={handleRatingSubmit} disabled={!rating} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-40 hover:bg-black transition">Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 pt-24 pb-20">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900">Blood Requests</h1>
            <p className="text-slate-500 mt-2">Manage your active broadcasts and track donor progress in real-time.</p>
          </div>

          {/* Broadcast Form */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 mb-12 relative overflow-hidden">
            {/* Decorative Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-500"></div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><Plus size={24} /></div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">New Broadcast</h2>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Initiate a request</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Hospital Name</label>
                  <input type="text" placeholder="City General" value={form.hospital} onChange={e => setForm({ ...form, hospital: e.target.value })} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Blood Group</label>
                  <select value={form.bloodgroup} onChange={e => setForm({ ...form, bloodgroup: e.target.value })} className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-white">
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Units Required</label>
                  <input type="number" min="1" value={form.unitsNeeded} onChange={e => setForm({ ...form, unitsNeeded: Number(e.target.value) })} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" required />
                </div>
              </div>
              <button disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                {loading ? <RefreshCw className="animate-spin" /> : <>Broadcast Request <CheckCircle size={18} /></>}
              </button>
            </form>
          </section>

          {/* Active Broadcasts  and completed */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800">My Broadcasts</h3>

            <div className="bg-slate-200/60 p-1 rounded-2xl flex gap-1 border border-slate-200">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Activity size={14} /> Active
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <History size={14} /> History
              </button>
            </div>
          </div>
          {fetching ? (
            <div className="grid md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2].map(n => <div key={n} className="h-64 bg-slate-200 rounded-3xl" />)}
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRequests.map(req => {
                const acceptedCount = req.donors?.filter(d => d.status === 'completed').length || 0;
                const progressPercent = Math.min((acceptedCount / req.unitsNeeded) * 100, 100);

                return (
                  <div key={req._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-red-100 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{req.hospital}</h3>
                        <div className="flex items-center gap-1 text-xs text-red-500 mt-1 font-bold">
                          <MapPin size={12} /> {req.bloodgroup}
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {activeTab === 'active' ? 'Live' : 'Closed'}
                      </span>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-4 mb-5">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Donation Goal</span>
                        <span className="text-xs font-bold text-slate-700">{acceptedCount} / {req.unitsNeeded} Units</span>
                      </div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                        <div className={`h-full transition-all duration-700 ${activeTab === 'active' ? 'bg-gradient-to-r from-red-400 to-rose-500' : 'bg-slate-400'}`} style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>

                    {/* Donors List */}
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {req.donors?.map((d, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {d.name?.charAt(0)}
                            </div>
                            <span className="text-xs font-medium">{d.name}</span>
                            <span className="text-[10px] text-slate-400">
                              {d.date ? new Date(d.date).toLocaleDateString() : "No date"}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {d.status === "completed" && !d.rating && (
                              <button onClick={() => openRatingModal(d)} className="text-[10px] font-bold text-yellow-600 hover:underline">Rate</button>
                            )}
                            <a href={`tel:${d.phone}`} className="text-slate-400 hover:text-green-700"><Phone size={14} /></a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {activeTab === 'active' && (
                      <button onClick={() => handleDelete(req._id)} className="w-full mt-4 py-2 text-xs text-slate-400 hover:text-red-500 font-bold flex items-center justify-center gap-2 transition">
                        <Trash2 size={14} /> Stop Broadcast
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet size={32} className="text-slate-300" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700">No active broadcasts</h4>
              <p className="text-slate-400 text-sm mt-1">Start a new broadcast to see it here.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BloodRequest;