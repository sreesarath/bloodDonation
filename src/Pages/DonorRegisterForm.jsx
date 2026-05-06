import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Upload, Activity, ShieldCheck,
  ChevronRight, ChevronLeft, AlertCircle, Phone,
  Scale, Calendar, Droplets, FileSearch, User,
  MapPin, HeartPulse, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Components/Header';
import { donorRegiterApi } from '../Services/AllApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';

const DonorRegisterForm = () => {
  const navigate = useNavigate();
  const [isEligible, setIsEligible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({ lat: "", lng: "" });

  // 1. Defined initial state to include all fields used in validation
  const [formData, setFormData] = useState({
    bloodgroup: '', weight: '', gender: '', phone: '',
    lastDonated: '', idProof: null, hasDisease: '',
    donatedBefore: '', donationCount: '', isOnMedication: '',
    hasAllergies: '', traveledAbroad: '',
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => toast.warn("Location services disabled. Matching accuracy may decrease.")
      );
    }
  }, []);

  const bloodgroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const isValidMobile = /^[6-9]\d{9}$/.test(formData.phone);

  useEffect(() => {
    if (formData.lastDonated) {
      const diffDays = Math.ceil((new Date() - new Date(formData.lastDonated)) / (1000 * 60 * 60 * 24));
      setIsEligible(diffDays >= 90);
    }
  }, [formData.lastDonated]);

  const handleSubmit = async () => {
    // 2. Safely retrieve token from session storage
    const token = sessionStorage.getItem('token');

    if (!location.lat) return Swal.fire("Precision Required", "Please allow location access to continue.", "info");
    if (!token) return Swal.fire("Authentication Error", "Please login again to continue.", "error");

    setIsUploading(true);
    const data = new FormData();

    // 3. Append all data including location
    Object.keys(formData).forEach(key => {
      if (formData[key] !== "" && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    data.append('lat', location.lat);
    data.append('lng', location.lng);

    try {
      const token = sessionStorage.getItem("token");
      const res = await donorRegiterApi(data, token);
      if (res.status === 201 || res.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Your donor profile is now live in the network.",
          icon: "success",
          confirmButtonColor: "#e11d48"
        });
        navigate('/profile'); // Redirect after success
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.response?.data?.message || "Registration failed. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden">
        <Header />

        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl opacity-60" />
        </div>

        <main className="max-w-6xl mx-auto px-6 pt-32 pb-20 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              <span className="text-rose-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Medical Onboarding</span>
              <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
                Join the <br /><span className="text-rose-600">Lifeline</span> Network
              </h1>

              <div className="space-y-6">
                {[
                  { s: 1, t: "Vital Statistics", d: "Blood group and body metrics" },
                  { s: 2, t: "Health Screening", d: "Eligibility and history" },
                  { s: 3, t: "Identity Sync", d: "Govt verification" }
                ].map((item) => (
                  <div key={item.s} className={`flex gap-4 items-start transition-opacity ${step >= item.s ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${step === item.s ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200' : 'border-slate-200'}`}>
                      {step > item.s ? <CheckCircle2 size={18} /> : `0${item.s}`}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider">{item.t}</h4>
                      <p className="text-xs text-slate-500 font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white hidden lg:block border-t-4 border-rose-600">
                <div className="flex justify-between items-start mb-6">
                  <Activity className="text-rose-500" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400">LIVE PREVIEW</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs text-slate-400">Blood Type</span>
                    <span className="font-bold text-rose-500">{formData.bloodgroup || "--"}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs text-slate-400">Identity Status</span>
                    <span className="text-xs font-bold">{formData.idProof ? "Attached" : "Pending"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-4">
                    <MapPin size={10} />
                    {location.lat ? "Encrypted Location Active" : "Waiting for GPS..."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <motion.div layout className="bg-white/80 backdrop-blur-xl border border-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                    <section>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Droplets size={14} className="text-rose-500" /> Essential Biometrics
                      </h3>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {bloodgroups.map(g => (
                          <button
                            key={g}
                            onClick={() => setFormData({ ...formData, bloodgroup: g })}
                            className={`aspect-square rounded-2xl font-black transition-all border-2 text-sm flex items-center justify-center ${formData.bloodgroup === g
                              ? 'bg-rose-600 border-rose-600 text-white shadow-xl shadow-rose-200 scale-105'
                              : 'bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-rose-200 hover:text-rose-600'
                              }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="text-xs font-black text-slate-500 uppercase mb-3 block tracking-wider">Weight (Minimum 50kg)</label>
                        <div className="relative">
                          <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                          <input
                            type="number"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold"
                            placeholder="55"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-xs font-black text-slate-500 uppercase mb-3 block tracking-wider">Contact Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                          <input
                            type="tel"
                            className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-500 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>


                      {/* 4. Added missing Gender selection to unblock validation */}
                      <div className="md:col-span-2 group">
                        <label className="text-xs font-black text-slate-500 uppercase mb-3 block tracking-wider">Gender</label>
                        <div className="flex gap-4">
                          {['Male', 'Female', 'Other'].map(gen => (
                            <button
                              key={gen}
                              onClick={() => setFormData({ ...formData, gender: gen })}
                              className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${formData.gender === gen ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-50 text-slate-400'}`}
                            >
                              {gen}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="bg-rose-50 rounded-3xl p-6 flex items-start gap-4">
                      <div className="p-3 bg-white rounded-2xl text-rose-600 shadow-sm"><HeartPulse /></div>
                      <div>
                        <h4 className="font-black text-sm text-rose-900">Health Declaration</h4>
                        <p className="text-xs text-rose-700 font-medium">Please answer accurately for patient safety.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { label: "Chronic or Transmissible Disease?", key: "hasDisease" },
                        { label: "Have you donated blood before?", key: "donatedBefore" },
                        { label: "Currently on any medication?", key: "isOnMedication" },
                        { label: "Any allergies?", key: "hasAllergies" },
                        { label: "Traveled abroad in last 12 months?", key: "traveledAbroad" }
                      ].map((q) => (
                        <div key={q.key} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                          <span className="font-bold text-slate-700">{q.label}</span>
                          <div className="flex gap-2 mt-3 md:mt-0">
                            {["Yes", "No"].map(v => (
                              <button
                                key={v}
                                onClick={() => setFormData({ ...formData, [q.key]: v })}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${formData[q.key] === v ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      {formData.donatedBefore === "Yes" && (
                        <div className="mb-6">
                          <label className="text-xs font-black text-slate-500 uppercase mb-3 block tracking-wider">How many times?</label>
                          <input
                            type="number"
                            className="w-full bg-slate-50 rounded-2xl p-4 font-bold border-2 border-transparent focus:border-rose-500 transition-all"
                            value={formData.donationCount}
                            onChange={(e) => setFormData({ ...formData, donationCount: e.target.value })}
                          />
                        </div>
                      )}
                      <label className="text-xs font-black text-slate-500 uppercase mb-4 block">Last Donation Date</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 rounded-2xl p-4 font-bold border-2 border-transparent focus:border-rose-500 transition-all"
                        onChange={(e) => setFormData({ ...formData, lastDonated: e.target.value })}
                      />
                      {!isEligible && (
                        <div className="mt-4 flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-2xl">
                          <AlertCircle size={18} />
                          <p className="text-xs font-bold uppercase tracking-tight">Recovery window active: 90 days required.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-rose-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-200">
                        <ShieldCheck size={40} />
                      </div>
                      <h3 className="text-2xl font-black">Identity Verification</h3>
                      <p className="text-slate-400 text-sm mt-2">Upload your Aadhar, Voter ID, or Passport to verify donor status.</p>
                    </div>

                    <label className="relative block group cursor-pointer">
                      <div className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center gap-4 group-hover:border-rose-200 group-hover:bg-rose-50/20 transition-all">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-rose-600 transition-all shadow-sm">
                          <Upload size={28} />
                        </div>
                        <div className="text-center">
                          <p className="font-black text-slate-600">Drop your ID proof here</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Maximum file size: 5MB (JPG, PNG, PDF)</p>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, idProof: e.target.files[0] })}
                      />
                    </label>

                    {formData.idProof && (
                      <div className="bg-slate-900 text-white p-5 rounded-[2rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-rose-500"><FileSearch size={20} /></div>
                          <div>
                            <p className="text-sm font-bold truncate max-w-[200px]">{formData.idProof.name}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase">READY TO SYNC</p>
                          </div>
                        </div>
                        <CheckCircle2 className="text-emerald-500" />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 mt-16 pt-8 border-t border-slate-50">
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="h-16 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 group"
                  >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
                  </button>
                )}

                <button
                  onClick={step === 3 ? handleSubmit : () => setStep(s => s + 1)}
                  disabled={
                    (step === 1 && (!formData.bloodgroup || !isValidMobile || !formData.weight)) ||
                    (step === 2 && (!isEligible || !formData.hasDisease || !formData.donatedBefore || !formData.isOnMedication)) ||
                    (step === 3 && (!formData.idProof || isUploading))
                  }
                  className="flex-1 h-16 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl shadow-slate-200 hover:bg-rose-600 transition-all disabled:opacity-20 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <span className="relative z-10 uppercase tracking-[0.15em] text-xs">
                    {isUploading ? "Syncing Network..." : step === 3 ? "Complete Onboarding" : "Next Milestone"}
                  </span>
                  {!isUploading && <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </ProtectedPage>
  );
};

export default DonorRegisterForm;