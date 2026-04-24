import React, { useState, useMemo, useEffect } from 'react';
import Header from '../Components/Header';
import {
  Search, MapPin, Phone,
  MessageCircle, Filter, AlertCircle,
  Award, Zap, User, ArrowRight
} from 'lucide-react';
import { getAllDonorsApi } from '../Services/AllApi';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [maxDistance, setMaxDistance] = useState(100);

  const defaultProfile = (gender) => {
    if (gender === "Female") return "src/assets/femaleDonor.jpeg";
    return "src/assets/donors.image.jpg";
  };

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const token = sessionStorage.getItem('token')
        const res = await getAllDonorsApi(token);
        if (res.status === 200) setDonors(res.data.data);
      } catch (err) {
        console.error("Failed to fetch donors", err);
      }
    };
    fetchDonors();
  }, []);

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        donor.userId?.name?.toLowerCase().includes(search) ||
        donor.bloodgroup?.toLowerCase().includes(search);
      const matchesDropdown = selectedGroup === 'All' || donor.bloodgroup === selectedGroup;
      const distanceValue = donor.distance ? parseFloat(donor.distance) : 0;
      return matchesSearch && matchesDropdown && distanceValue <= maxDistance;
    });
  }, [donors, searchTerm, selectedGroup, maxDistance]);

  const checkEligibility = (lastDate) => {
    if (!lastDate) return true;
    const diffDays = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);
    return diffDays >= 90;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] mb-2 block">Community Network</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Verified Donors</h1>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex gap-8">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Donors</p>
              <p className="text-xl font-black text-slate-900">{donors.length}</p>
            </div>
            <div className="w-[1px] bg-slate-100 h-full" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Nearby</p>
              <p className="text-xl font-black text-rose-600">{filteredDonors.length}</p>
            </div>
          </div>
        </div>

        {/* --- MODERN SEARCH BAR --- */}
        <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-slate-200/60 border border-slate-100 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-4 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by name or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none"
              />
            </div>

            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl">
                <Filter size={18} className="text-slate-400" />
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="bg-transparent w-full py-2 font-black text-slate-700 outline-none cursor-pointer"
                >
                  <option value="All">All Groups</option>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="lg:col-span-3 px-2">
              <div className="flex justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Radius</span>
                <span className="text-xs font-black text-rose-600">{maxDistance} km</span>
              </div>
              <input
                type="range" min="1" max="100"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-rose-600"
              />
            </div>

            <div className="lg:col-span-2">
              <button
                onClick={() => { setSearchTerm(''); setSelectedGroup('All'); setMaxDistance(100); }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- DONOR CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonors.map((donor) => {
            const eligible = checkEligibility(donor.lastDonated);

            return (
              <div key={donor._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="bg-slate-50 rounded-[2rem] p-6 h-full flex flex-col">
                  
                  {/* Top Info */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden ring-4 ring-white shadow-md">
                        <img
                          src={donor.userId?.profile || defaultProfile(donor.gender)}
                          alt="Profile"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${eligible ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                        {eligible ? <Zap size={14} className="text-white fill-current" /> : <AlertCircle size={14} className="text-white" />}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Blood Type</span>
                      <div className="bg-rose-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-rose-200">
                        {donor.bloodgroup}
                      </div>
                    </div>
                  </div>

                  {/* Donor Name & Location */}
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 mb-1">{donor.userId?.name || "Life Saver"}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={14} className="text-rose-500" />
                      <span className="text-xs font-bold truncate">{donor.location?.address || 'Verified Location'}</span>
                    </div>
                  </div>

                  {/* Horizontal Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center">
                      <User size={14} className="text-blue-500 mb-1" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Gender</span>
                      <span className="text-xs font-black text-slate-700">{donor.gender}</span>
                    </div>
                    <div className="bg-white/60 p-3 rounded-2xl border border-white flex flex-col items-center">
                      <Award size={14} className="text-purple-500 mb-1" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Weight</span>
                      <span className="text-xs font-black text-slate-700">{donor.weight} kg</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto space-y-3">
                    <button
                      disabled={!eligible}
                      onClick={() => eligible && (window.location.href = `tel:${donor.mobile}`)}
                      className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all ${
                        eligible 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Phone size={18} />
                      {eligible ? 'Call Now' : 'In Recovery'}
                    </button>
                    
                    <button
                      onClick={() => {
                        const message = encodeURIComponent(`Hi ${donor.userId?.name}, I found your profile on the Blood Finder App. I need ${donor.bloodgroup} blood. Are you available to help?`);
                        window.open(`https://wa.me/91${donor.mobile}?text=${message}`, '_blank');
                      }}
                      className="w-full py-4 rounded-2xl font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-all flex items-center justify-center gap-3"
                    >
                      <MessageCircle size={18} /> WhatsApp Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- EMPTY STATE --- */}
        {filteredDonors.length === 0 && (
          <div className="text-center py-32">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 border border-slate-50">
              <Search size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No matches found</h3>
            <p className="text-slate-400 font-bold mt-2">Try adjusting your filters or expanding your radius.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Donors;