import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../Components/Header";

import { toast } from "react-toastify";
import { createComplaintApi } from "../Services/AllApi";

const ReportIssue = () => {
  const { donorId } = useParams();
  const navigate = useNavigate();

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!reason || !description) {
      return toast.error("Please fill all fields");
    }

    try {
      const token = sessionStorage.getItem("token");

      const res = await createComplaintApi(
        { donorId, reason, description },
        token
      );

      if (res.status === 201) {
        toast.success("Complaint submitted");
        navigate("/my-complaints");
      }
    } catch (err) {
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-xl mx-auto pt-32 px-6">
        <h1 className="text-3xl font-black mb-6">Report Issue</h1>

        <div className="space-y-5 bg-white p-6 rounded-2xl shadow">

          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-100"
          >
            <option value="">Select a reason</option>
            <option value="No-show">Didn't show up</option>
            <option value="Bad Behaviour">Behaved Rudely</option>
            
            <option value="False Info">False information</option>
            <option value="Other">Other</option>
          </select>

          <textarea
            rows="5"
            placeholder="Explain what happened..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-xl bg-slate-100"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-red-600 text-white rounded-xl font-bold"
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;