import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import { toast } from "react-toastify";
import { escalateComplaintApi, getMyComplaintsApi, resolveComplaintApi } from "../Services/AllApi";
import { 
  ShieldAlert, 
  MessageSquare, 
  CheckCircle2, 
  History, 
  User,
  Gavel,
  Archive,
  Activity
} from "lucide-react";

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'closed'

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await getMyComplaintsApi(token);
      setComplaints(res.data);
    } catch (error) {
      toast.error("Failed to sync complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (id) => {
    const token = sessionStorage.getItem("token");
    await escalateComplaintApi(id, token);
    toast.success("Case escalated to administrative review");
    fetchComplaints();
  };

  const handleResolve = async (id) => {
    const token = sessionStorage.getItem('token');
    await resolveComplaintApi(id, token);
    toast.success("Marked as resolved");
    fetchComplaints();
  };

  // Logic to separate complaints
  const activeComplaints = complaints.filter(c => c.status === "PENDING" || c.status === "RESPONDED" || c.status === "PENDING_DONOR");
  const closedComplaints = complaints.filter(c => c.status === "RESOLVED" || c.status === "ESCALATED" || c.status === "CLOSED");

  const currentDisplay = activeTab === "active" ? activeComplaints : closedComplaints;

  const getStatusStyle = (status) => {
    switch (status) {
      case "RESPONDED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "ESCALATED": return "bg-purple-100 text-purple-700 border-purple-200";
      case "RESOLVED": 
      case "CLOSED": return "bg-slate-100 text-slate-600 border-slate-200";
      default: return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Header />

      <div className="max-w-4xl mx-auto pt-32 pb-20 px-6">
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Support History</h1>
            <p className="text-slate-500 mt-2">Track and manage your reported issues.</p>
          </div>
          
          {/* Tabs Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab("active")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "active" 
                ? "bg-white text-red-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Activity size={18} />
              Active ({activeComplaints.length})
            </button>
            <button 
              onClick={() => setActiveTab("closed")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                activeTab === "closed" 
                ? "bg-white text-slate-900 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Archive size={18} />
              Closed ({closedComplaints.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
          </div>
        ) : currentDisplay.length > 0 ? (
          <div className="space-y-6">
            {currentDisplay.map((c) => (
              <div 
                key={c._id} 
                className={`group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 relative overflow-hidden ${activeTab === 'closed' ? 'opacity-90' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(c.status)}`}>
                    {c.status}
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    ID: {c._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className={`rounded-2xl p-3 h-fit transition-colors ${activeTab === 'active' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Involved Donor</p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="font-bold text-slate-800">{c.donorId?.name || "Unknown Donor"}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Issue Category</p>
                        <span className="font-semibold text-slate-700">{c.reason}</span>
                      </div>
                    </div>

                    {c.donorResponse && (
                      <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 relative">
                        <div className="flex items-center gap-2 mb-2 text-slate-800 font-bold text-sm">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          Donor Response
                        </div>
                        <p className="text-slate-600 text-sm italic leading-relaxed">
                          "{c.donorResponse}"
                        </p>
                      </div>
                    )}

                    {c.status === "RESPONDED" && activeTab === 'active' && (
                      <div className="flex flex-wrap gap-3 mt-6">
                        <button
                          onClick={() => handleResolve(c._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-sm shadow-green-200 transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Resolved
                        </button>

                        <button
                          onClick={() => handleEscalate(c._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all active:scale-95"
                        >
                          <Gavel className="w-4 h-4" />
                          Escalate to Admin
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'active' ? <Activity className="text-slate-300 w-10 h-10" /> : <Archive className="text-slate-300 w-10 h-10" />}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'active' ? "No active issues" : "No closed cases"}
            </h2>
            <p className="text-slate-500 mt-1">
              {activeTab === 'active' 
                ? "Everything is running smoothly right now." 
                : "Your resolved history will appear here."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;