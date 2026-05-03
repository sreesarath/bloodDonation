import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Upload, Activity, ShieldCheck,
  ChevronRight, ChevronLeft, AlertCircle, Phone,
  Scale, Calendar, Droplets, FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Components/Header';
import { donorRegiterApi } from '../Services/AllApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';



const DonorRegisterForm = () => {
  const navigate=useNavigate()
  const [isEligible, setIsEligible] = useState(true);
  const [formData, setFormData] = useState({
    bloodgroup: '',
    weight: '',
    gender:'',
    phone: '',
    lastDonated: '',
    idProof: null
  });
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState({
    lat: "",
    lng: ""
  })

  //handle geo location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => toast.error("Location access is required for emergency matching.")
      );
    }
  }, []);


  const bloodgroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  const isValidMobile = /^[6-9]\d{9}$/.test(formData.phone);

  useEffect(() => {
    if (formData.lastDonated) {
      const lastDate = new Date(formData.lastDonated);
      const today = new Date();
      const diffDays = Math.ceil((today - lastDate) / (1000 * 60 * 60 * 24));
      setIsEligible(diffDays >= 90);
    }
  }, [formData.lastDonated]);


  const handleSubmit = async () => {
    // Basic validation
    if (!location.lat || !location.lng) {
      return Swal.fire("Location Required", "Please enable location to register.", "warning");
    }

    const token = sessionStorage.getItem('token');
    const data = new FormData();

    // Append all fields
    data.append('bloodgroup', formData.bloodgroup)
    data.append('weight', formData.weight)
    data.append('gender', formData.gender)
    data.append('phone', formData.phone)
    data.append('lastDonated', formData.lastDonated)
    data.append('idProof', formData.idProof)

    // Append location
    data.append('lat', location.lat);
    data.append('lng', location.lng);

    const res = await donorRegiterApi(data, token);

    if (res.status === 201 || res.status === 200) {
      Swal.fire("Success", "You are now a registered donor!", "success");
      // Redirect or Reset
      navigate('/profile')
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (

   <ProtectedPage>
        <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
      <Header />

      <main className="max-w-2xl mx-auto px-6 pt-32 pb-20">
        {/* Modern Stepper */}
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4 px-2">
            <div>
              <p className="text-rose-600 font-black text-sm uppercase tracking-widest mb-1">Step 0{step}</p>
              <h1 className="text-3xl font-black italic">
                {step === 1 && "Vital Stats"}
                {step === 2 && "Eligibility"}
                {step === 3 && "Verification"}
              </h1>
            </div>
            <span className="text-slate-400 font-bold">{step}/3</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              className="h-full bg-rose-600"
            />
          </div>
        </div>

        <motion.div
          layout
          className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: VITALS */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                    <Droplets size={16} className="text-rose-500" /> Select Blood Group
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {bloodgroups.map(g => (
                      <button
                        key={g}
                        onClick={() => setFormData({ ...formData, bloodgroup: g })}
                        className={`py-4 rounded-2xl font-black transition-all border-2 ${formData.bloodgroup === g
                          ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200'
                          : 'bg-white border-slate-100 text-slate-400 hover:border-rose-200 hover:text-rose-500'
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
  <label className="text-sm font-bold text-slate-500 mb-2 block uppercase">
    Gender
  </label>

  <div className="flex gap-3">
    {["Male", "Female", "Other"].map(g => (
      <button
        key={g}
        onClick={() => setFormData({ ...formData, gender: g })}
        className={`flex-1 py-3 rounded-xl font-bold border-2 ${
          formData.gender === g
            ? "bg-rose-600 text-white border-rose-600"
            : "bg-white text-slate-400 border-slate-200"
        }`}
      >
        {g}
      </button>
    ))}
  </div>
</div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      <Scale size={16} /> Body Weight
                    </label>
                    <input
                      type="number"
                      placeholder="50+"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 transition-all font-bold"
                    />
                    <span className="absolute right-4 bottom-4 text-slate-400 font-bold">KG</span>
                  </div>

                  <div className="relative">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">
                      <Phone size={16} /> Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 transition-all font-bold ${formData.phone && !isValidMobile ? 'focus:ring-amber-500' : 'focus:ring-rose-500'
                        }`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ELIGIBILITY */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6 text-center py-4"
              >
                <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Calendar size={40} />
                </div>
                <h2 className="text-2xl font-black">When was your last donation?</h2>
                <input
                  type="date"
                  onChange={(e) => setFormData({ ...formData, lastDonated: e.target.value })}
                  className="w-full max-w-xs mx-auto bg-slate-50 p-4 rounded-2xl border-none focus:ring-2 focus:ring-rose-500 font-bold block"
                />

                <div className={`mt-8 p-6 rounded-[2rem] border-2 transition-all ${isEligible
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
                  }`}>
                  <div className="flex items-center justify-center gap-3 mb-2 font-black uppercase tracking-widest text-xs">
                    {isEligible ? <ShieldCheck /> : <AlertCircle />}
                    {isEligible ? "Safe to proceed" : "Safety Warning"}
                  </div>
                  <p className="font-bold">
                    {isEligible
                      ? "Your health stats meet the standard 90-day recovery window."
                      : "The mandatory 90-day recovery period has not yet passed."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: UPLOAD */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-black mb-2">Final Verification</h2>
                  <p className="text-slate-400">Please upload a valid Govt ID (Aadhar/Voter ID)</p>
                </div>

                <label className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center gap-4 hover:border-rose-200 hover:bg-rose-50/30 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-rose-100 group-hover:text-rose-600 transition-all">
                    <Upload size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-black text-slate-600">Click to upload file</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">PDF, PNG, OR JPG (MAX 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFormData({ ...formData, idProof: e.target.files[0] })}
                  />
                </label>

                {formData.idProof && (
                  <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="p-3 bg-white rounded-xl shadow-sm text-rose-600"><FileSearch size={20} /></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold truncate text-sm">{formData.idProof.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase">{(formData.idProof.size / 1024).toFixed(0)} KB</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-4 px-6 border-2 border-slate-100 text-slate-400 rounded-2xl font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}

            <button
              onClick={step === 3 ? handleSubmit : nextStep}
              disabled={
                (step === 1 && (!formData.bloodgroup || !isValidMobile || !formData.weight || !formData.gender)) ||
                (step === 2 && !isEligible) ||
                (step === 3 && !formData.idProof)
              }
              className="flex-[2] py-4 px-6 bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-30 disabled:shadow-none flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {step === 3 ? "Complete Registration" : "Continue"}
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>

        <p className="text-center mt-8 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          Your data is encrypted & secure
        </p>
      </main>
    </div>
   </ProtectedPage>
  );
};

export default DonorRegisterForm;