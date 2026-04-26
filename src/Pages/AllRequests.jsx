import React, { useState, useEffect } from 'react';
import { Hospital, MapPin, Check, X, RefreshCw, Droplet, PhoneCall, Calendar, AlertCircle } from 'lucide-react';
import Header from '../Components/Header';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';
import { getNearbyRequestApi, acceptRequestApi, rejectRequestApi, completeDonationApi } from '../Services/AllApi';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({});

  const getToken = () => sessionStorage.getItem("token");
  const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");

  const fetchRequests = () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await getNearbyRequestApi(pos.coords.latitude, pos.coords.longitude, token);
          if (res.status === 200) setRequests(res.data.data || []);
        } catch (err) {
          toast.error("Could not fetch requests");
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.error("Location access denied");
        setLoading(false);
      }
    );
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAccept = async (id) => {
    const selectDate = selectedDate[id];
    if (!selectDate) return toast.info("Please select a donation date");

    try {
      const res = await acceptRequestApi(id, { scheduledDate: selectDate.toLocaleDateString() }, getToken());
      if (res.status === 200) {
        toast.success("Request Accepted!");

        //storing requester info
        const requesterInfo = res.data.requester
        setRequests(prev => prev.map(val => val._id === id ? { ...val, requester: requesterInfo, accepted: true } : val));
         fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleReject = async (id) => {
    const reason = reasons[id];
    if (!reason) return toast.info("Please enter a reason for rejection");

    try {
      const res = await rejectRequestApi(id, { reason }, getToken());
      if (res.status === 200) {
        toast.success("Request rejected");
        setRequests(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };
  const handleComplete = async (id) => {
    try {
      const res = await completeDonationApi(id, {}, getToken())
      if (res.status === 200) {
        toast.success("Donation marked as completed");
        setRequests((val) => val.filter(D => D._id !== id))
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to update");

    }
  }

  const user = getUser();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">

          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Nearby Requests</h1>
            <p className="text-slate-500 mt-3 text-lg">Help save lives by responding to local blood requests.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400"><RefreshCw className="animate-spin mx-auto mb-2" /> Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Droplet size={48} className="mx-auto text-slate-200 mb-4" />
              <h4 className="text-lg font-semibold text-slate-700">No requests nearby</h4>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map(req => {
                const alreadyResponded = req.acceptedDonors?.some(
                  d => (d.donorId?._id || d.donorId)?.toString() === user?._id
                );
                const myResponse = req.acceptedDonors?.find(
                  d => (d.donorId?._id || d.donorId)?.toString() === user?._id
                );

                return (
                  <div key={req._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{req.hospital}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <MapPin size={12} /> Within 50km
                        </div>
                      </div>
                      <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">{req.bloodgroup}</span>
                    </div>

                    <div className="flex gap-2 mb-6">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">Units Needed: {req.unitsNeeded}</span>
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </span>
                    </div>


                    {myResponse && myResponse.status === "accepted" ? (
                      <div className='bg-green-50 p-4 rounded-xl space-y-3'>
                        <p className='text-sm font-semibold text-green-700'>
                          Request Accepted - Stay Connected With Requester
                        </p>
                        <p className="text-sm">
                          👤 {req.userId?.name}
                        </p>

                        <a
                          href={`tel:${req.userId?.phone}`}
                          className="block text-center bg-white border py-2 rounded-lg text-sm font-medium"
                        >
                          📞 Call Requester
                        </a>

                        <button
                          onClick={() => handleComplete(req._id)}
                          className='w-full bg-green-600 text-white py-2 rounded-lg text-sm font-bold'
                        >
                          Mark as Donated
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Reason for rejection..."
                          className="w-full p-3 text-sm rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-100"
                          onChange={(e) => setReasons(prev => ({ ...prev, [req._id]: e.target.value }))}
                        />

                        <div className="relative">
                          <Calendar className="absolute left-3 top-3.5 text-slate-400 z-10" size={16} />
                          <DatePicker
                            selected={selectedDate[req._id]}
                            onChange={(date) => setSelectedDate(prev => ({ ...prev, [req._id]: date }))}
                            minDate={new Date(req.startDate)}
                            maxDate={new Date(req.endDate)}
                            placeholderText="Select your donation date"
                            className="w-full pl-10 p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-red-100"
                            calendarClassName="shadow-lg border-0"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            disabled={alreadyResponded}
                            onClick={() => handleAccept(req._id)}
                            className={`flex-1 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition
                            ${alreadyResponded
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700 text-white"}`}
                          >
                            <Check size={16} />
                            {alreadyResponded ? "Already Accepted" : "Accept"}
                          </button>
                          <button onClick={() => handleReject(req._id)} className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition">
                            <X size={16} /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  );
};

export default AllRequests;