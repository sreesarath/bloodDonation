import React, { useEffect, useState } from 'react';
import {
  Search, Filter, Trash2, MapPin, Droplets, User, 
  ChevronLeft, ChevronRight, Loader2, Users, 
  MoreVertical, ShieldAlert, History, Activity, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../Admin-component/AdminLayout';
import { deletedonorApi, getAllDonorsApi } from '../Services/AllApi';
import { toast } from 'react-toastify';

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bloodFilter, setBloodFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const donorsPerPage = 6;
  const defaultProfile = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await getAllDonorsApi(token);
      const data = res?.data?.data || [];
      setDonors(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load donors list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("This action cannot be undone. Remove this donor?")) return;
    try {
      const token = sessionStorage.getItem("token");
      await deletedonorApi(id, token);
      setDonors(prev => prev.filter(d => d._id !== id));
      toast.success("Donor record removed");
    } catch (err) {
      toast.error("Delete operation failed");
    }
  };

  const filteredDonors = donors.filter(d => {
    const name = d?.userId?.name?.toLowerCase() || "";
    const group = d?.bloodgroup || "";
    return name.includes(search.toLowerCase()) && (bloodFilter === "" || group === bloodFilter);
  });

  const indexOfLast = currentPage * donorsPerPage;
  const indexOfFirst = indexOfLast - donorsPerPage;
  const currentDonors = filteredDonors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  // Advanced Framer Motion Variants
  const containerVars = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <AdminLayout>
      {/* --- HERO SECTION --- */}
      <div className="relative mb-12 p-8 rounded-[3rem] bg-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Admin Intelligence</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Donor <span className="text-rose-500">Registry</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2 max-w-md">Real-time management of the blood donation ecosystem and life-saver profiles.</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl min-w-[160px]">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Network</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-white">{donors.length}</span>
                <Users className="text-rose-500 mb-1" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SMART FILTERS --- */}
      <div className="grid md:grid-cols-12 gap-4 mb-10">
        <div className="md:col-span-8 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by donor name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 outline-none transition-all font-semibold text-slate-700"
          />
        </div>

        <div className="md:col-span-4 relative group">
          <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
          <select
            value={bloodFilter}
            onChange={(e) => { setBloodFilter(e.target.value); setCurrentPage(1); }}
            className="w-full pl-14 pr-10 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-rose-500/5 focus:border-rose-200 outline-none appearance-none cursor-pointer font-bold text-slate-700"
          >
            <option value="">All Blood Groups</option>
            {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {loading ? (
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-[450px] bg-white rounded-[2.5rem] border border-slate-100 animate-pulse flex flex-col p-8">
               <div className="flex gap-4 mb-8">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl"></div>
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  </div>
               </div>
               <div className="flex-1 space-y-4">
                  <div className="h-20 bg-slate-50 rounded-2xl"></div>
                  <div className="h-20 bg-slate-50 rounded-2xl"></div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          variants={containerVars}
          initial="initial"
          animate="animate"
          className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {currentDonors.length > 0 ? (
              currentDonors.map(d => (
                <motion.div 
                  variants={itemVars}
                  layout
                  key={d._id} 
                  className="group bg-white rounded-[2.5rem] border border-slate-100 hover:border-rose-200 hover:shadow-2xl hover:shadow-rose-500/5 transition-all duration-500 p-8 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={d.userId?.profile || defaultProfile}
                          alt="profile"
                          className="w-20 h-20 rounded-3xl object-cover border-4 border-slate-50 shadow-sm"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${d.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500 shadow-lg shadow-amber-200 animate-pulse'}`}></span>
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">{d.userId?.name || "Anonymous"}</h3>
                        <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                          <MapPin size={14} className="text-rose-500" />
                          <span className="text-xs font-bold truncate max-w-[120px] uppercase tracking-wider">{d.location?.address || "Region Unknown"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                       <div className="px-4 py-2 bg-rose-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-rose-200">
                        {d.bloodgroup}
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-rose-50/50 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <History size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Donations</span>
                      </div>
                      <p className="text-lg font-black text-slate-700">{d.donationCount || 0} Times</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-rose-50/50 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health</span>
                      </div>
                      <p className="text-lg font-black text-slate-700 truncate">{d.hasDisease || "Healthy"}</p>
                    </div>
                  </div>

                  {/* Details List */}
                  <div className="flex-1 space-y-3 px-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Medication</span>
                      <span className="text-slate-700 font-black">{d.isOnMedication || "None"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Allergies</span>
                      <span className="text-slate-700 font-black">{d.hasAllergies || "None"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold">Travel Hist.</span>
                      <span className="text-slate-700 font-black">{d.traveledAbroad || "Local"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                      <User size={14} /> Profile Detail
                    </button>
                    
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                      title="Delete Record"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100"
              >
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                   <ShieldAlert size={40} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Search Protocol Failed</h3>
                <p className="text-slate-400 font-medium mt-2">We couldn't find any donors matching your filter parameters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* --- PROFESSIONAL PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-16 gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400">
            Showing <span className="text-slate-900">{indexOfFirst + 1}</span> to <span className="text-slate-900">{Math.min(indexOfLast, filteredDonors.length)}</span> of <span className="text-slate-900">{filteredDonors.length}</span> Records
          </p>
          
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 bg-slate-50 text-slate-600 rounded-2xl disabled:opacity-30 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={20}/>
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1
                      ? "bg-rose-600 text-white shadow-xl shadow-rose-200"
                      : "text-slate-400 hover:bg-slate-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 bg-slate-50 text-slate-600 rounded-2xl disabled:opacity-30 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default DonorsPage;