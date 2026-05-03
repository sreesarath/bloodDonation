import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import {
  Mail, Phone, Droplet, Calendar,
  MapPin, Award, Star, ShieldCheck, 
  MessageSquare, Heart, Weight
} from "lucide-react";
import { getDonorByIdApi, getDonorRatingApi } from "../Services/AllApi";

const DonorProfile = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [ratingData, setRatingData] = useState({
    avgRating: 0,
    totalRatings: 0
  });

  const token = sessionStorage.getItem("token");

  const checkEligibility = (date) => {
    if (!date) return true;
    const diff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diff >= 90;
  };

  useEffect(() => {
    const fetchDonor = async () => {
      const res = await getDonorByIdApi(id, token);
      if (res.status === 200) {
        setDonor(res.data.data);
      }
    };
    fetchDonor();
  }, [id]);

  useEffect(() => {
    const fetchDonorRating = async () => {
      try {
        const res = await getDonorRatingApi(id, token);
        setRatingData(res.data);
      } catch (err) {
        console.log("failed to fetch rating");
      }
    };
    if (id) fetchDonorRating();
  }, [id]);

  if (!donor) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Fetching donor details...</p>
      </div>
    );
  }

  const eligible = checkEligibility(donor.lastDonated);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <Header />

      <div className="max-w-5xl mx-auto pt-28 px-4">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-white">
          
          {/* VIBRANT COVER GRADIENT */}
          <div className="h-44 bg-gradient-to-r from-red-600 via-rose-500 to-orange-400 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          <div className="px-6 md:px-12 pb-12 -mt-20 relative">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
              
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
                {/* DONOR AVATAR */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-red-500 to-rose-400 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <img
                    src={donor.userId?.profile || `https://ui-avatars.com/api/?name=${donor.userId?.name}&background=random`}
                    className="relative w-40 h-40 rounded-[1.8rem] object-cover border-4 border-white shadow-xl"
                    alt="donor"
                  />
                  <div className={`absolute -bottom-2 -right-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-lg border-2 border-white ${
                    eligible ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                  }`}>
                    {eligible ? "Ready to Donate" : "In Recovery"}
                  </div>
                </div>

                {/* NAME & VERIFICATION */}
                <div className="flex-1 text-center md:text-left mb-2">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">{donor.userId?.name}</h1>
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-blue-100 uppercase tracking-tighter">
                      <ShieldCheck size={14} /> Verified Donor
                    </span>
                  </div>
                  
                  <p className="text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start mt-1">
                    <MapPin size={16} className="text-red-500" /> Professional Life Saver
                  </p>

                  {/* RATINGS UI */}
                  <div className='flex items-center gap-2 mt-4 justify-center md:justify-start'>
                    {ratingData.totalRatings > 0 ? (
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-xl border border-yellow-100 shadow-sm">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(ratingData.avgRating) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-yellow-700">{ratingData.avgRating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({ratingData.totalRatings} reviews)</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 italic">No reviews yet</span>
                    )}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pb-2">
                  <button
                    disabled={!eligible}
                    onClick={() => window.location.href = `tel:${donor.phone}`}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 shadow-lg ${
                      eligible 
                      ? "bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5 shadow-slate-200" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Phone size={18} /> Call
                  </button>

                  <button
                    onClick={() => {
                      const msg = encodeURIComponent(`Hi ${donor.userId?.name}, I need ${donor.bloodgroup} blood urgently. Can you help?`);
                      window.open(`https://wa.me/91${donor.phone}?text=${msg}`);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5"
                  >
                    <MessageSquare size={18} /> WhatsApp
                  </button>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              
              {/* LEFT: CONTACT & BIO */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Heart size={20} className="text-red-500" /> Donor Overview
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* EMAIL CARD - Fixed Overlap */}
                    <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 min-w-0">
                      <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0"><Mail size={20} /></div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-slate-700 font-semibold text-sm break-all">{donor.userId?.email}</p>
                      </div>
                    </div>

                    {/* PHONE CARD */}
                    <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-50 min-w-0">
                      <div className="p-3 bg-blue-50 text-blue-500 rounded-xl shrink-0"><Phone size={20} /></div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact</p>
                        <p className="text-slate-700 font-semibold text-sm">+91 {donor.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-200/60">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About the Donor</h4>
                    <p className="text-slate-600 leading-relaxed font-medium italic">
                      "I believe in the power of giving. A single pint of blood can save three lives, and I am committed to being there for those in need whenever I am eligible."
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT: BLOOD GROUP & HEALTH STATS */}
              <div className="space-y-6">
                {/* BIG BLOOD TYPE CARD */}
                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  <Droplet size={36} className="mx-auto mb-4 text-red-500 fill-red-500" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-1">Blood Group</p>
                  <h2 className="text-7xl font-black">{donor.bloodgroup}</h2>
                </div>

                {/* HEALTH INFO CARD */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <ShieldCheck size={20} className="text-blue-500" />
                    <h4 className="font-bold text-slate-800">Health Profile</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Weight size={18} /> <span>Body Weight</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">{donor.weight} KG</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Calendar size={18} /> <span>Last Donated</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">
                        {donor.lastDonated ? new Date(donor.lastDonated).toLocaleDateString() : "First Timer"}
                      </span>
                    </div>

                    {!eligible && (
                      <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Under mandatory 90-day recovery period</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;