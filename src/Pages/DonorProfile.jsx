import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import {
  Mail, Phone, Droplet, Calendar,
  MapPin, Award, MessageCircle
} from "lucide-react";
import {  getDonorByIdApi } from "../Services/AllApi";

const DonorProfile = () => {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);

  const token = sessionStorage.getItem("token");

  // ✅ Eligibility Logic (REAL-TIME)
  const checkEligibility = (date) => {
    if (!date) return true;
    const diff = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
    return diff >= 90;
  };

  useEffect(() => {
    const fetchDonor = async () => {
      const res = await getDonorByIdApi(id,token);

      if (res.status === 200) {
       
        
        setDonor(res.data.data);
      }
    };

    fetchDonor();
  }, [id]);

  if (!donor) {
    return <div className="text-center mt-32 text-lg">Loading...</div>;
  }

  const eligible = checkEligibility(donor.lastDonated);

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="max-w-5xl mx-auto pt-28 px-6">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* 🔴 COVER */}
          <div className="h-40 bg-gradient-to-r from-red-600 via-rose-500 to-pink-500"></div>

          {/* PROFILE */}
          <div className="px-8 pb-10 -mt-20">

            {/* TOP */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

              {/* IMAGE */}
              <div className="relative group">
                <img
                  src={donor.userId?.profile || "https://ui-avatars.com/api/?name=" + donor.userId?.name}
                  className="w-36 h-36 rounded-2xl border-4 border-white shadow-lg object-cover transition-transform group-hover:scale-105"
                  alt="profile"
                />

                {/* 🟢 Availability Badge */}
                <div className={`absolute bottom-2 right-2 px-3 py-1 text-xs rounded-full font-bold shadow ${
                  eligible ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                }`}>
                  {eligible ? "Available" : "Recovery"}
                </div>
              </div>

              {/* NAME */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900">{donor.userId?.name}</h2>
                <p className="text-slate-500 flex items-center gap-1 justify-center md:justify-start">
                  <MapPin size={14} /> Verified Blood Donor
                </p>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex gap-3">
                <button
                  disabled={!eligible}
                  onClick={() => window.location.href = `tel:${donor.phone}`}
                  className={`px-5 py-2 rounded-xl font-bold transition ${
                    eligible
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Call
                </button>

                <button
                  onClick={() => {
                    const msg = encodeURIComponent(
                      `Hi ${donor.userId?.name}, I need ${donor.bloodgroup} blood. Can you help?`
                    );
                    window.open(`https://wa.me/91${donor.phone}?text=${msg}`);
                  }}
                  className="px-5 py-2 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600"
                >
                  WhatsApp
                </button>
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {/* LEFT */}
              <div className="md:col-span-2 space-y-6">

                {/* CONTACT */}
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} /> {donor.userId?.email}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} /> {donor.phone}
                  </div>
                </div>

                {/* ABOUT */}
                <div className="bg-slate-50 p-5 rounded-2xl">
                  <h3 className="font-bold mb-2 text-slate-700">About Donor</h3>
                  <p className="text-sm text-slate-500">
                    Passionate blood donor committed to saving lives and helping the community.
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div className="space-y-6">

                {/* BLOOD */}
                <div className="bg-black text-white p-6 rounded-2xl text-center shadow-lg">
                  <Droplet size={18} className="mx-auto mb-2" />
                  <h2 className="text-4xl font-black">{donor.bloodgroup}</h2>
                </div>

                {/* STATS */}
                <div className="bg-slate-50 p-5 rounded-2xl space-y-4">

                  <div className="flex items-center gap-2">
                    <Award size={16} />
                    Weight: {donor.weight} kg
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Last Donation: {
                      donor.lastDonated
                        ? new Date(donor.lastDonated).toLocaleDateString()
                        : "No record"
                    }
                  </div>

                  {/* ⏳ Next Eligible */}
                  {!eligible && (
                    <div className="text-xs text-red-500 font-bold">
                      Not eligible yet (90-day rule)
                    </div>
                  )}
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