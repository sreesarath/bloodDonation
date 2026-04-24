import React, { useState, useEffect } from 'react';
import { Hospital, MapPin, Check, X, RefreshCw, Droplet } from 'lucide-react';
import Header from '../Components/Header';
import ProtectedPage from './ProtectedPage';
import { toast } from 'react-toastify';
import { getNearbyRequestApi, acceptRequestApi, rejectRequestApi } from '../Services/AllApi';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [reasons, setReasons] = useState({});
  const [loading, setLoading] = useState(false);

  const getToken = () => sessionStorage.getItem("token");
  const getUser = () => JSON.parse(sessionStorage.getItem("user"));

  // 🔄 Fetch requests
  const fetchRequests = () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await getNearbyRequestApi(
            pos.coords.latitude,
            pos.coords.longitude,
            token
          );

          if (res.status === 200) {
            setRequests(res.data.data || []);
          }
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

  useEffect(() => {
    fetchRequests();
  }, []);

  // ✅ Accept
  const handleAccept = async (id) => {
    try {
      const res = await acceptRequestApi(id, getToken());

      if (res.status === 200) {
        toast.success("Request Accepted!");

        // 🔥 Remove instantly from UI
        setRequests(prev => prev.filter(r => r._id !== id));
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    }
  };

  // ❌ Reject
  const handleReject = async (id) => {
    const reason = reasons[id];

    if (!reason) {
      return toast.info("Please enter a reason for rejection");
    }

    try {
      const res = await rejectRequestApi(id, { reason }, getToken());

      if (res.status === 200) {
        toast.success("Request rejected");

        // 🔥 Remove instantly
        setRequests(prev => prev.filter(r => r._id !== id));
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject");
    }
  };

  const user = getUser();

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="max-w-5xl mx-auto px-4 pt-24 pb-20">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Nearby Requests
            </h1>
            <p className="text-slate-500 mt-2">
              Help people nearby by donating blood.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center py-20 text-slate-400">
              <RefreshCw className="animate-spin mx-auto mb-2" />
              Loading...
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <Droplet size={48} className="mx-auto text-slate-200 mb-4" />
              <h4 className="text-lg font-semibold text-slate-700">
                No requests nearby
              </h4>
              <p className="text-slate-500">
                Check back later.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {requests.map(req => {

                // ✅ check already responded
                const alreadyResponded = req.acceptedDonors?.some(
                  d => d.donorId === user?._id
                );

                return (
                  <div
                    key={req._id}
                    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                          <Hospital size={16} /> {req.hospital}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <MapPin size={12} /> Within 50km
                        </p>
                      </div>

                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                        {req.bloodgroup}
                      </span>
                    </div>

                    {/* Units */}
                    <div className="bg-slate-50 p-3 rounded-xl mb-4 text-sm">
                      Units Needed: <b>{req.unitsNeeded}</b>
                    </div>

                    {/* If already responded */}
                    {alreadyResponded ? (
                      <div className="text-green-600 font-bold text-sm text-center">
                        ✅ You already responded
                      </div>
                    ) : (
                      <div className="space-y-3">

                        <input
                          type="text"
                          placeholder="Reason (if rejecting)"
                          className="w-full p-3 text-sm rounded-lg border"
                          onChange={(e) =>
                            setReasons(prev => ({
                              ...prev,
                              [req._id]: e.target.value
                            }))
                          }
                        />

                        <div className="flex gap-2">

                          <button
                            onClick={() => handleAccept(req._id)}
                            className="flex-1 bg-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                          >
                            <Check size={16} /> Donate
                          </button>

                          <button
                            onClick={() => handleReject(req._id)}
                            className="flex-1 border py-2 rounded-xl flex items-center justify-center gap-2"
                          >
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