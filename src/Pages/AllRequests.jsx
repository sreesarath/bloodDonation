import React, { useState, useEffect } from 'react';
import { Hospital, MapPin, Check, X, RefreshCw, Droplet, PhoneCall, Calendar, History, Activity } from 'lucide-react';
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
  
  // New State for Tabs: 'active' or 'completed'
  const [activeTab, setActiveTab] = useState('active');

  const getToken = () => sessionStorage.getItem("token");
  const getUser = () => JSON.parse(sessionStorage.getItem("user") || "{}");
  const user = getUser();

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

  // Logic to separate requests
  const filteredRequests = requests.filter(req => {
    const myResponse = req.acceptedDonors?.find(
      d => (d.donorId?._id || d.donorId)?.toString() === user?._id
    );

    if (activeTab === 'completed') {
      return myResponse?.status === "completed";
    } else {
      // Show if not responded yet OR if accepted but not yet completed
      return !myResponse || myResponse.status === "accepted";
    }
  });

  const handleAccept = async (id) => {
    const selectDate = selectedDate[id];
    if (!selectDate) return toast.info("Please select a donation date");
    try {
      const res = await acceptRequestApi(id, { scheduledDate: selectDate.toISOString() }, getToken());
      if (res.status === 200) {
        toast.success("Request Accepted!");
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await completeDonationApi(id, {}, getToken());
      if (res.status === 200) {
        toast.success("Donation marked as completed");
        fetchRequests(); // This will move the item to the 'completed' tab
      }
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Nearby Requests</h1>
            
            {/* Tab Switcher - Styled like DevHub */}
            <div className="flex justify-center mt-8">
              <div className="bg-slate-200/50 p-1 rounded-2xl flex gap-1 border border-slate-200">
                <button 
                  onClick={() => setActiveTab('active')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Activity size={16} /> Active Requests
                </button>
                <button 
                  onClick={() => setActiveTab('completed')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <History size={16} /> Completed
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400"><RefreshCw className="animate-spin mx-auto mb-2" /> Loading...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Droplet size={48} className="mx-auto text-slate-200 mb-4" />
              <h4 className="text-lg font-semibold text-slate-700">
                {activeTab === 'active' ? "No pending requests nearby" : "No completed donations yet"}
              </h4>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRequests.map(req => {
                const myResponse = req.acceptedDonors?.find(
                  d => (d.donorId?._id || d.donorId)?.toString() === user?._id
                );
                const alreadyResponded = !!myResponse;

                return (
                  <div key={req._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 relative ">
                    {/* Status Badge */}
                    {myResponse?.status === "completed" && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 rounded-bl-xl text-[10px] font-black uppercase">
                        Completed
                      </div>
                    )}

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
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">Units: {req.unitsNeeded}</span>
                      <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Conditional Rendering based on state */}
                    {myResponse?.status === "completed" ? (
                      <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3">
                         <div className="p-2 bg-emerald-500 text-white rounded-full"><Check size={16}/></div>
                         <div>
                            <p className="text-sm font-bold text-emerald-800">Donation Successful</p>
                            <p className="text-xs text-emerald-600">Thank you for saving a life!</p>
                         </div>
                      </div>
                    ) : myResponse?.status === "accepted" ? (
                      <div className='bg-amber-50 p-4 rounded-xl space-y-3 border border-amber-100'>
                        <p className='text-sm font-semibold text-amber-700 flex items-center gap-2'>
                          <Activity size={14}/> Request Accepted - Action Required
                        </p>
                        <div className="flex items-center justify-between text-sm py-2 border-y border-amber-200/50">
                           <span className="text-slate-600">Requester: {req.userId?.name}</span>
                           <a href={`tel:${req.userId?.phone}`} className="text-amber-700 font-bold flex items-center gap-1 hover:underline">
                             <PhoneCall size={14}/> Call
                           </a>
                        </div>
                        <button onClick={() => handleComplete(req._id)} className='w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold transition shadow-md shadow-emerald-200'>
                          Mark as Donated
                        </button>
                      </div>
                    ) : (
                      /* Form for new requests */
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3.5 text-slate-400 z-10" size={16} />
                          <DatePicker
                            selected={selectedDate[req._id]}
                            onChange={(date) => setSelectedDate(prev => ({ ...prev, [req._id]: date }))}
                            minDate={new Date(req.startDate)}
                            maxDate={new Date(req.endDate)}
                            placeholderText="Select donation date"
                            portalId="root-portal"
                            popperClassName="z-[9999]"
                            autoComplete="off"
                            className="w-full pl-10 p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-red-100 bg-white"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAccept(req._id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition">
                            <Check size={16} /> Accept
                          </button>
                          <button onClick={() => handleReject(req._id)} className="px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-sm transition">
                            <X size={16} />
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