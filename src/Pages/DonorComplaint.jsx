import React, { useEffect, useState } from 'react';
import { getDonorComplaintApi, respondComplaintApi } from '../Services/AllApi';
import Header from '../Components/Header';
import { toast } from 'react-toastify';
import { MessageSquare, AlertCircle, CheckCircle, Send, Clock, Inbox, History } from 'lucide-react';

const DonorComplaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [response, setResponse] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(null);
    const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'history'

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await getDonorComplaintApi(token);
            if (res.status === 200) {
                setComplaints(res.data);
            }
        } catch (error) {
            toast.error("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (id) => {
        if (!response[id]?.trim()) {
            return toast.error("Please provide a valid response");
        }
        
        setSubmitting(id);
        const token = sessionStorage.getItem('token');
        try {
            const res = await respondComplaintApi(id, response[id], token);
            if (res.status === 200) {
                toast.success("Response submitted successfully");
                setResponse(prev => {
                    const newState = { ...prev };
                    delete newState[id];
                    return newState;
                });
                fetchComplaints();
            }
        } catch (error) {
            toast.error("Failed to send response");
        } finally {
            setSubmitting(null);
        }
    };

    // Filter Logic
    const pendingCases = complaints.filter(c => c.status === "PENDING_DONOR");
    const historyCases = complaints.filter(c => c.status !== "PENDING_DONOR");

    const currentDisplay = activeTab === "pending" ? pendingCases : historyCases;

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <Header />

            <div className="max-w-5xl mx-auto pt-32 pb-20 px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                            Resolution Center
                        </h1>
                        <p className="text-slate-500 mt-2">
                            Manage and respond to feedback received from requesters.
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-slate-200/50 p-1 rounded-2xl border border-slate-200">
                        <button 
                            onClick={() => setActiveTab("pending")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === "pending" 
                                ? "bg-white text-orange-600 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Inbox size={18} />
                            Pending ({pendingCases.length})
                        </button>
                        <button 
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === "history" 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <History size={18} />
                            History ({historyCases.length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                        <p className="mt-4 text-slate-500 font-medium">Loading your cases...</p>
                    </div>
                ) : currentDisplay.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === "pending" ? <CheckCircle className="text-green-400 w-8 h-8" /> : <Clock className="text-slate-300 w-8 h-8" />}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {activeTab === "pending" ? "All Caught Up!" : "No History Yet"}
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-2">
                            {activeTab === "pending" 
                                ? "You have addressed all pending complaints. Good job!" 
                                : "Cases you've responded to will appear in this archive."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {currentDisplay.map((see) => (
                            <div 
                                key={see._id} 
                                className={`bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden ${activeTab === 'history' ? 'opacity-95' : ''}`}
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-2xl h-fit ${see.status === 'PENDING_DONOR' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                                            {see.status === 'PENDING_DONOR' ? <AlertCircle size={24} /> : <MessageSquare size={24} />}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                <h3 className="text-lg font-bold text-slate-900">{see.reason}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-50 px-2 py-1 rounded">#{see._id.slice(-6).toUpperCase()}</span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                        see.status === 'PENDING_DONOR' 
                                                        ? 'bg-orange-100 text-orange-600' 
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                        {see.status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/50 p-4 rounded-2xl mb-6">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Requester's Complaint</p>
                                                <p className="text-slate-700 leading-relaxed font-medium">
                                                    {see.description}
                                                </p>
                                            </div>

                                            {see.status === "PENDING_DONOR" ? (
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <textarea
                                                            placeholder="Explain your side of the situation or provide an update..."
                                                            value={response[see._id] || ""}
                                                            onChange={(e) => setResponse({ ...response, [see._id]: e.target.value })}
                                                            className="w-full min-h-[140px] p-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-slate-900 focus:ring-0 transition-all resize-none text-slate-700 placeholder:text-slate-400"
                                                        />
                                                        <button
                                                            disabled={submitting === see._id}
                                                            onClick={() => handleResponse(see._id)}
                                                            className="absolute bottom-4 right-4 bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-slate-200"
                                                        >
                                                            {submitting === see._id ? 'Submitting...' : 'Send Response'}
                                                            <Send size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4">
                                                    <div className="flex items-center gap-2 mb-2 text-green-700 font-bold text-sm">
                                                        <CheckCircle size={16} />
                                                        Your Official Response
                                                    </div>
                                                    <p className="text-slate-600 text-sm italic">
                                                        "{see.donorResponse || "Response submitted successfully."}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonorComplaint;