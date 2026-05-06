import React, { useState, useEffect } from 'react';
import { 
  Check, X, Clock, Mail, Phone, 
  User, ShieldAlert, ExternalLink, 
  Loader2, Eye 
} from "lucide-react";
import AdminLayout from '../Admin-component/AdminLayout';
import { approveDonorApi, getPendingDonorsApi, rejectDonorApi } from '../Services/AllApi';
import { toast } from 'react-toastify';

const ApprovalPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchPendingDonors();
  }, []);

  const fetchPendingDonors = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('token');
      const res = await getPendingDonorsApi(token);
      if (res.status === 200) {
        setRequests(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, actionType) => {
    setProcessingId(id);
    const token = sessionStorage.getItem("token");
    try {
      if (actionType === 'approve') {
        await approveDonorApi(id, token);
        toast.success("Donor approved successfully");
      } else {
        await rejectDonorApi(id, token);
        toast.warn("Donor request rejected");
      }
      fetchPendingDonors();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  // Helper to open modal
  const openDoc = (docUrl) => {
    setSelectedDoc(docUrl);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      {/* 1. DOCUMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="font-black text-xl text-slate-900">Identity Verification Document</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto bg-slate-50 p-6 flex justify-center">
              {/* If it's an image */}
              {selectedDoc?.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <img src={selectedDoc} alt="Identity Proof" className="max-w-full h-auto rounded-lg shadow-md" />
              ) : (
                /* If it's a PDF or other file (Embedded viewer) */
                <iframe 
                  src={selectedDoc} 
                  className="w-full h-[70vh] rounded-lg border-none" 
                  title="Document Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Approvals
            {requests.length > 0 && (
              <span className="text-sm font-bold bg-rose-100 text-rose-600 px-3 py-1 rounded-full animate-pulse">
                Action Required
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Verify credentials and identity proofs for new donor registrations.</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl font-bold text-sm">
            <Clock size={16} />
            {requests.length} Pending
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-rose-600 mb-4" size={40} />
            <p className="text-slate-400 font-medium">Loading pending requests...</p>
          </div>
        ) : requests.length > 0 ? (
          requests.map(r => (
            <div 
              key={r._id} 
              className="group bg-white rounded-[1.8rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-rose-100 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-8">
                
                {/* 1. BLOOD GROUP BADGE */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex flex-col items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                    <span className="text-[10px] font-black uppercase opacity-60 tracking-widest">Group</span>
                    <span className="text-2xl font-black">{r.bloodgroup || r.group}</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                    <ShieldAlert size={10} className="text-white" />
                  </div>
                </div>

                {/* 2. DONOR INFO */}
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      {r.userId?.name}
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tighter">New Registry</span>
                    </h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Mail size={14} className="text-rose-500" /> {r.userId?.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Phone size={14} className="text-rose-500" /> {r.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <User size={14} className="text-rose-500" /> {r.weight}kg • {r.gender || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* ID PROOF PREVIEW (TRIGGER MODAL) */}
                  <div 
                    onClick={() => openDoc(r.idProof)} // Use the actual field name from your DB (e.g., r.idProof)
                    className="inline-flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group/doc"
                  >
                    <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center group-hover/doc:border-rose-300 transition-colors">
                      <Eye size={14} className="text-slate-400 group-hover/doc:text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Identity Verification</p>
                      <p className="text-xs font-bold text-slate-700">Click to preview document</p>
                    </div>
                  </div>
                </div>

                {/* 3. ACTION BUTTONS */}
                <div className="flex lg:flex-col xl:flex-row gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                  <button 
                    disabled={processingId === r._id}
                    onClick={() => handleAction(r._id, 'reject')} 
                    className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <X size={18} /> Reject
                  </button>
                  <button 
                    disabled={processingId === r._id}
                    onClick={() => handleAction(r._id, 'approve')} 
                    className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-rose-200 hover:bg-rose-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {processingId === r._id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={18} /> Approve Donor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Workspace Clear</h3>
            <p className="text-slate-400 font-medium mt-2 max-w-xs text-center">There are no pending registrations to review at this moment.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ApprovalPage;