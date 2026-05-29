import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, Droplet, Calendar,
  Camera, Trash2, Award, MapPin, Loader2, Star, Edit3, ShieldCheck, Heart, X, Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  deleteAccountApi,
  getDonorRatingApi,
  getMyProfileApi,
  toggleAvailiblityApi,
  updateProfileApi,
  uploadImageApi
} from '../Services/AllApi';
import Header from '../Components/Header';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const ProfilePage = () => {
  const navigate=useNavigate()
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratingData, setRatingData] = useState({
    avgRating: 0,
    totalRatings: 0
  });

  const token = sessionStorage.getItem("token");

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfileApi(token);
      if (res.status === 200) {
        setProfile(res.data.data);
        setForm(res.data.data);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = io("https://blooddonation-server-cbnq.onrender.com");
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user?._id) socket.emit("register", user._id);

    socket.on("donorApproved", (data) => toast.success(data.message));
    socket.on("donorRejected", (data) => toast.error(data.message));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await updateProfileApi(form, token);
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        const updatedUser = { ...JSON.parse(sessionStorage.getItem("user")), name: form.name };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userChanged"));
        setEdit(false);
        fetchProfile();
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = async (e) => {
    if (!e.target.files[0]) return;
    try {
      const data = new FormData();
      data.append("profile", e.target.files[0]);
      const res = await uploadImageApi(data, token);
      if (res.status === 200) {
        toast.success("Profile picture updated");
        const updatedUser = { ...JSON.parse(sessionStorage.getItem("user")), profile: res.data.image };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userChanged"));
        fetchProfile();
      }
    } catch {
      toast.error("Image upload failed");
    }
  };

  useEffect(() => {
    if (profile._id) fetchRating();
  }, [profile]);

  const fetchRating = async () => {
    try {
      const res = await getDonorRatingApi(profile._id, token);
      setRatingData(res.data);
    } catch (err) {
      console.log("Rating fetch failed");
    }
  };

  const toggleAvailability = async () => {
    await toggleAvailiblityApi(token);
    fetchProfile();
  };

const handleDelete = async () => {
  Swal.fire({
    title: 'Are you sure?',
    text: "This action is permanent. Your life-saver profile and data will be removed from the network.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e11d48',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, delete my account',
    cancelButtonText: 'No, keep it',
    background: '#ffffff',
    customClass: {
      popup: 'rounded-[2rem]',
      confirmButton: 'rounded-xl px-6 py-3 font-bold',
      cancelButton: 'rounded-xl px-6 py-3 font-bold'
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = sessionStorage.getItem("token")

        const res = await deleteAccountApi(token);

        if (res.status === 200) {
          sessionStorage.clear();

          await Swal.fire({
            title: 'Deleted!',
            text: 'Your account has been successfully removed.',
            icon: 'success',
            confirmButtonColor: '#e11d48',
            customClass: { popup: 'rounded-[2rem]' }
          });

          window.location.href = "/";
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete account',
          icon: 'error',
          confirmButtonColor: '#e11d48'
        });
      }
    }
  });
};
  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "Hero Donor": return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
      case "Active Donor": return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
      default: return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="mt-4 text-slate-500 font-medium tracking-wide">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-28">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden border border-white">

          {/* DYNAMIC HEADER BACKGROUND */}
          <div className="h-48 bg-gradient-to-br from-red-600 via-red-500 to-rose-400 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>

          <div className="px-6 md:px-12 pb-12 -mt-20 relative">
            {/* TOP ACTIONS BAR */}
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">

              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
                {/* PROFILE IMAGE */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-red-500 to-rose-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                  <img
                    src={profile.profile || `https://ui-avatars.com/api/?name=${profile.name}&background=random`}
                    className="relative w-40 h-40 rounded-[2rem] object-cover border-4 border-white shadow-2xl"
                    alt="profile"
                  />
                  <label className="absolute bottom-2 right-2 bg-white text-slate-800 p-2.5 rounded-xl cursor-pointer shadow-lg hover:bg-slate-50 transition-colors border">
                    <Camera size={18} />
                    <input type="file" hidden onChange={handleImageUpload} />
                  </label>
                </div>

                {/* NAME AND VERIFICATION */}
                <div className="flex-1 text-center md:text-left mb-2">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">{profile.name}</h1>
                    {profile.status === "approved" && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-100">
                        <ShieldCheck size={14} /> VERIFIED
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 font-medium flex items-center gap-2 justify-center md:justify-start mt-1">
                    <MapPin size={16} className="text-red-500" /> Life Saver & Blood Donor
                  </p>

                  {/* RATINGS */}
                  <div className='flex items-center gap-2 mt-3 justify-center md:justify-start'>
                    {ratingData.totalRatings > 0 ? (
                      <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                        <div className="flex text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < Math.floor(ratingData.avgRating) ? "currentColor" : "none"} />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-yellow-700">{ratingData.avgRating.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({ratingData.totalRatings} reviews)</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">No reviews yet</span>
                    )}
                  </div>
                </div>

                {/* AVAILABILITY TOGGLE */}
                <div className="pb-2">
                  <button
                    onClick={toggleAvailability}
                    disabled={!profile.isEligible}
                    className={`group relative flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all duration-300 ${profile.isEligible
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200 hover:-translate-y-0.5"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                      }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${profile.isEligible ? 'bg-white' : 'bg-slate-400'}`}></div>
                    {profile.isEligible ? "AVAILABLE TO DONATE" : "NOT ELIGIBLE YET"}
                  </button>
                </div>
              </div>
            </div>

            {/* NOTIFICATION BANNERS */}
            <div className="mt-8">
              {profile.status === "pending" && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-4 text-amber-700">
                  <div className="bg-amber-100 p-2 rounded-xl"><Loader2 className="animate-spin" size={20} /></div>
                  <p className="text-sm font-semibold">Verification in progress. We are reviewing your documents to ensure community safety.</p>
                </div>
              )}
              {profile.status === "rejected" && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-red-700">
                    <div className="bg-red-100 p-2 rounded-xl">❌</div>
                    <div>
                      <p className="text-sm font-bold">Application Rejected</p>
                      <p className="text-xs opacity-80">Your ID proof didn't meet requirements. Please update and re-submit.</p>
                    </div>
                  </div>
                  <button onClick={() => setEdit(true)} className="bg-red-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">Re-apply Now</button>
                </div>
              )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid md:grid-cols-3 gap-8 mt-12">

              {/* LEFT COLUMN: INFO & EDIT */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-slate-50/50 rounded-[1.5rem] p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100"><Edit3 size={20} className="text-red-500" /></div>
                      <h3 className="text-xl font-bold text-slate-800">Personal Information</h3>
                    </div>
                    {!edit && (
                      <button onClick={() => setEdit(true)} className="flex items-center gap-1.5 text-red-600 text-sm font-bold hover:underline">
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {edit ? (
                    <div className="grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Full Name</label>
                        <input
                          value={form.name || ""}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none transition-all"
                          placeholder="Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Phone Number</label>
                        <input
                          value={form.phone || ""}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none transition-all"
                          placeholder="Phone"
                        />
                      </div>

                      {/* UPDATE LAST DONATED DATE */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Last Donated Date</label>
                        <input
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={form.lastDonated ? new Date(form.lastDonated).toISOString().split('T')[0] : ""}
                          onChange={(e) => setForm({ ...form, lastDonated: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Blood Group</label>
                        <select
                          value={form.bloodgroup || ""}
                          onChange={(e) => setForm({ ...form, bloodgroup: e.target.value })}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-100 outline-none transition-all"
                        >
                          <option value="">Select Blood Group</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg}>{bg}</option>)}
                        </select>
                      </div>

                      <div className="flex gap-3 md:col-span-2 mt-4">
                        <button onClick={handleUpdate} className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">Save Changes</button>
                        <button onClick={() => { setEdit(false); setForm(profile); }} className="px-8 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-100 transition-colors min-w-0">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
                          <Mail size={20} />
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Email Address
                          </p>
                          <p className="text-slate-700 font-semibold text-sm break-all leading-tight">
                            {profile.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-100 transition-colors min-w-0">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
                          <Phone size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Phone Number
                          </p>
                          <p className="text-slate-700 font-semibold text-sm leading-tight">
                            {profile.phone}
                          </p>
                        </div>
                      </div>
                      {/* VIEW LAST DONATED DATE IN READ-ONLY MODE */}
                      <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:border-red-100 transition-colors min-w-0">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl shrink-0">
                          <Calendar size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Last Donation Date
                          </p>
                          <p className="text-slate-700 font-semibold text-sm leading-tight">
                            {profile.lastDonated ? new Date(profile.lastDonated).toLocaleDateString() : "No record"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: STATS CARDS */}
              <div className="space-y-6">
                {/* BLOOD TYPE CARD */}
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] text-center shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                  <Droplet size={32} className="mx-auto mb-4 text-red-500 fill-red-500" />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Blood Group</p>
                  <h2 className="text-6xl font-black">{profile.bloodgroup || "--"}</h2>
                </div>

                {/* ACHIEVEMENTS CARD */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-5">
                  <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <Heart size={20} className="text-rose-500" />
                    <h4 className="font-bold text-slate-800">Donor Highlights</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Award size={16} /> <span>Rank</span>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${getBadgeStyle(profile.badge)}`}>
                        {profile.badge || "New Member"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar size={16} /> <span>Last Donated</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {profile.lastDonated ? new Date(profile.lastDonated).toLocaleDateString() : "Never"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Droplet size={16} /> <span>Contribution</span>
                      </div>
                      <span className="text-sm font-bold text-slate-700">{profile.totalDonation || 0} Times</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DANGER ZONE */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center md:justify-start">
              <button
                onClick={handleDelete}
                className="group flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-sm font-bold"
              >
                <div className="p-2 rounded-lg group-hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                </div>
                Delete Account Permanently
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;