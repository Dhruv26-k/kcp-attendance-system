"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Send, Clock, Calendar, CheckCircle, XCircle, Loader2, ArrowLeft } from "lucide-react";

export default function LeaveManagement() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);
  
  // Form States
  const [formData, setFormData] = useState({
    type: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  // --- SUBMIT LEAVE TO BACKEND ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const userId = localStorage.getItem("loggedInFacultyId");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/leaves/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        alert("Leave request submitted for approval.");
        setFormData({ type: "Casual Leave", startDate: "", endDate: "", reason: "" });
      }
    } catch (error) {
      console.error("Leave submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] p-6 md:p-10 pb-24 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/faculty/dashboard" className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
            <p className="text-slate-500 text-sm font-medium">Apply for leaves and track your approval status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Apply Form */}
          <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Send size={18} className="text-blue-600" /> New Application
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium"
                >
                  <option>Casual Leave</option>
                  <option>Medical Leave</option>
                  <option>Duty Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                  <input type="date" required onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm outline-none bg-slate-50/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                  <input type="date" required onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm outline-none bg-slate-50/50" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                <textarea 
                  required 
                  placeholder="Mention the purpose of leave..."
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm outline-none bg-slate-50/50 h-24 resize-none"
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-2 shadow-lg shadow-blue-200">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Application"}
              </button>
            </form>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
               <Clock size={18} className="text-blue-600" /> Leave History
            </h2>
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 bg-slate-50 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-4">Duration</th>
                      <th className="px-8 py-4">Type</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-semibold text-slate-700">Mar 02 - Mar 04</td>
                      <td className="px-8 py-5 text-slate-500 font-medium">Casual Leave</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-bold uppercase">Pending</span>
                      </td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}