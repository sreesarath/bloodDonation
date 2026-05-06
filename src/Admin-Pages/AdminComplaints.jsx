import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { getAdminComplaintApi, takeActionApi } from "../Services/AllApi";

import {
  ShieldAlert,
  UserX,
  CheckCircle,
  Search,
  MailWarning,
  Users,
  Activity,
  ArrowUpRight,
  User
} from "lucide-react";
import AdminLayout from "../Admin-component/AdminLayout";
import { Tooltip } from "rsuite";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ESCALATED");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await getAdminComplaintApi(token);
      if (res.status === 200) setComplaints(res.data);
    } catch (err) {
      toast.error("Security clearance required or network failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = sessionStorage.getItem("token");
      await takeActionApi(id, action, token);
      toast.success(`Protocol: ${action.toUpperCase()} executed`);
      fetchData();
    } catch (err) {
      toast.error("Execution override failed.");
    }
  };

  const filteredData = useMemo(() => {
    return complaints.filter((c) => {
      const matchesTab = activeTab === "CLOSED"
        ? ["CLOSED", "RESOLVED"].includes(c.status)
        : c.status === activeTab;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        c.userId?.name?.toLowerCase().includes(searchLower) ||
        c.donorId?.name?.toLowerCase().includes(searchLower) ||
        c._id.toLowerCase().includes(searchLower) ||
        c.reason?.toLowerCase().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [complaints, activeTab, searchTerm]);

  const stats = {
    escalated: complaints.filter(c => c.status === "ESCALATED").length,
    resolved: complaints.filter(c => ["CLOSED", "RESOLVED"].includes(c.status)).length,
    total: complaints.length
  };

  return (
    <AdminLayout>
      <div className="font-sans text-slate-900">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-red-600 font-bold text-xs uppercase tracking-[0.2em]">Compliance Intelligence</span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mt-1">
              Case Management
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search names, IDs, or reasons..."
                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none w-full md:w-80 shadow-sm transition-all"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Active Escalations", value: stats.escalated, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
            { label: "Total Resolutions", value: stats.resolved, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Reports", value: stats.total, icon: Activity, color: "text-blue-600", bg: "bg-blue-50" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-300 flex items-center gap-1">
                  LIVE <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 mt-4 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Control */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-[1.5rem] w-fit mb-8 border border-slate-200">
          <button
            onClick={() => setActiveTab("ESCALATED")}
            className={`px-8 py-2.5 rounded-[1.2rem] text-sm font-bold transition-all duration-300 ${activeTab === "ESCALATED" ? "bg-white text-red-600 shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
          >
            Pending Escalations
          </button>
          <button
            onClick={() => setActiveTab("CLOSED")}
            className={`px-8 py-2.5 rounded-[1.2rem] text-sm font-bold transition-all duration-300 ${activeTab === "CLOSED" ? "bg-white text-slate-900 shadow-md scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
          >
            Archived Resolutions
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Case Metadata</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Dispute Parties</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Response Archive</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan="4" className="py-24 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-red-600"></div></td></tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <Users size={48} className="mb-4" />
                        <p className="font-bold text-slate-500 italic">Zero matches found in encrypted records</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((c) => (
                    <tr key={c._id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-8 py-8">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono bg-slate-900 text-white px-2 py-0.5 rounded">ID: {c._id.slice(-6).toUpperCase()}</span>
                            {c.status === 'ESCALATED' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />}
                          </div>
                          <span className="font-extrabold text-slate-800 text-lg group-hover:text-red-600 transition-colors">{c.reason}</span>
                          <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed line-clamp-2">{c.description}</p>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                              <User size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Requester</span>
                              <span className="text-sm font-black text-slate-700">{c.requesterId?.name || 'Unknown User'}</span>
                              <span className="text-sm font-black text-slate-400">{c.requesterId?.email || 'Unknown User'}</span>
                            </div>
                          </div>
                          <div className="flex items-center top-2 gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-xs font-bold">
                              <User size={14} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Donor</span>
                              <span className="text-sm font-black text-slate-700">{c.donorId?.name || 'Unknown Donor'}</span>
                              <span className="text-sm font-black text-slate-400">{c.donorId?.email|| 'Unknown email'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        {c.donorResponse ? (
                          <div className="relative p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-600 italic leading-relaxed group-hover:bg-white transition-colors">
                            <ArrowUpRight className="absolute top-2 right-2 text-slate-300" size={14} />
                            "{c.donorResponse}"
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs italic">
                            <MailWarning size={14} /> No defense logged
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-8 text-right">
                        {activeTab === "ESCALATED" ? (
                          <div className="flex justify-end gap-2">
                            {/* Warning Action */}
                            <Tooltip
                             title="Issue official warning"
                            >
                              <button
                                onClick={() => handleAction(c._id, "warn")}
                                className="p-3 bg-white text-yellow-600 border border-yellow-100 rounded-2xl hover:bg-yellow-600 hover:text-white hover:shadow-lg hover:shadow-yellow-200 transition-all active:scale-90"
                              >
                                <MailWarning size={18} />
                              </button>
                            </Tooltip>

                            {/* Suspend Action */}
                            <Tooltip
                            title="Restrict donor account access"
                            >
                              <button
                                onClick={() => handleAction(c._id, "suspend")}
                                className="p-3 bg-white text-red-600 border border-red-100 rounded-2xl hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all active:scale-90"
                              >
                                <UserX size={18} />
                              </button>
                            </Tooltip>

                            {/* Resolve Action */}
                            <Tooltip
                            title="Resolve case and move to archive"
                            >
                              <button
                                onClick={() => handleAction(c._id, "close")}
                                className="p-3 bg-white text-green-600 border border-green-100 rounded-2xl hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-200 transition-all active:scale-90"
                              >
                                <CheckCircle size={18} />
                              </button>
                            </Tooltip>
                          </div>
                        ) : (
                          <span className={`inline-block px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${c.status === 'CLOSED' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-600 border border-green-100'
                            }`}>
                            {c.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminComplaints;