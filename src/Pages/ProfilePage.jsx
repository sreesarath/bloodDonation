import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, Droplet, Calendar,
  Camera, Trash2, Award, MapPin, Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
  deleteAccountApi,
  getMyProfileApi,
  toggleAvailiblityApi,
  updateProfileApi,
  uploadImageApi
} from '../Services/AllApi';
import Header from '../Components/Header';

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

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
    fetchProfile();
  }, []);

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await updateProfileApi(form, token);

      if (res.status === 200) {
        toast.success("Profile updated");

        // update session user (important for header sync)
        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem("user")),
          name: form.name
        };

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

        // 🔥 update header instantly
        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem("user")),
          profile: res.data.image
        };

        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userChanged"));

        fetchProfile();
      }
    } catch {
      toast.error("Image upload failed");
    }
  };

  // ================= TOGGLE =================
  const toggleAvailability = async () => {
    await toggleAvailiblityApi(token);
    fetchProfile();
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (window.confirm("Delete your account permanently?")) {
      await deleteAccountApi(token);
      sessionStorage.clear();
      window.location.href = "/";
    }
  };

  // ================= BADGE STYLE =================
  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "Hero Donor":
        return "bg-amber-100 text-amber-700";
      case "Active Donor":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ================= UI =================
  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-20">

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="h-36 bg-gradient-to-r from-red-600 to-rose-500"></div>

          {/* PROFILE */}
          <div className="px-8 pb-10 -mt-16">

            {/* TOP SECTION */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

              {/* IMAGE */}
              <div className="relative group">
                <img
                  src={profile.profile || `https://ui-avatars.com/api/?name=${profile.name}`}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                  alt="profile"
                />
                <label className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full cursor-pointer">
                  <Camera size={16} />
                  <input type="file" hidden onChange={handleImageUpload} />
                </label>
              </div>

              {/* NAME */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold">{profile.name}</h2>
                <p className="text-gray-500 flex items-center gap-1 justify-center md:justify-start">
                  <MapPin size={14} /> Blood Donor
                </p>
              </div>

              {/* STATUS */}
              <button
                onClick={toggleAvailability}
                disabled={!profile.isEligible}
                className={`px-5 py-2 rounded-full text-sm font-semibold ${profile.isEligible
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {profile.isEligible ? "Available" : "Unavailable"}
              </button>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-6 mt-10">

              {/* LEFT */}
              <div className="md:col-span-2 space-y-6">

                {/* CONTACT */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={16} /> {profile.email}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} /> {profile.phone}
                  </div>
                </div>

                {/* EDIT FORM */}
                <div className="bg-slate-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <h3 className="font-semibold">Personal Info</h3>
                    {!edit && (
                      <button onClick={() => setEdit(true)} className="text-red-600 text-sm">
                        Edit
                      </button>
                    )}
                  </div>

                  {edit ? (
                    <div className="space-y-3">
                      <input
                        value={form.name || ""}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Name"
                      />

                      <input
                        value={form.phone || ""}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Phone"
                      />

                      {/* 🔥 Blood Group */}
                      <select
                        value={form.bloodgroup || ""}
                        onChange={(e) => setForm({ ...form, bloodgroup: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select Blood Group</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                        <option>O+</option>
                        <option>O-</option>
                      </select>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="flex-1 bg-red-600 text-white py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEdit(false)}
                          className="px-4 bg-gray-300 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Blood Donor | Community Member
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-6">

                {/* BLOOD GROUP */}
                <div className="bg-black text-white p-5 rounded-xl text-center">
                  <Droplet size={20} className="mx-auto mb-2" />
                  <h2 className="text-3xl font-bold">{profile.bloodgroup || "N/A"}</h2>
                </div>

                {/* STATS */}
                <div className="bg-slate-50 p-5 rounded-xl space-y-4">

                  <div>
                    <Award size={16} />
                    <span className={`ml-2 px-3 py-1 rounded ${getBadgeStyle(profile.badge)}`}>
                      {profile.badge}
                    </span>
                  </div>

                  <div>
                    <Calendar size={16} />{" "}
                    Last Donation: {profile.lastDonated
                      ? new Date(profile.lastDonated).toLocaleDateString()
                      : "No donations"}
                  </div>

                  <div>
                    Total Donations: <b>{profile.totalDonation || 0}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              className="mt-10 text-red-500 text-sm flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete Account
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;