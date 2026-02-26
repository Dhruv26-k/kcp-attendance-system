"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UserCheck, Loader2, UserX, Calendar, PlaneTakeoff } from "lucide-react";

export default function LeaveManagement() {
  const [leaveList, setLeaveList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaveList();
  }, []);

  const fetchLeaveList = async () => {
    try {
      // Fetch only those who are on leave
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/all`);
      if (response.ok) {
        const data = await response.json();
        // Filter locally for now, or use a specific backend route if available
        setLeaveList(data.filter(f => f.status === "on-leave"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const endLeave = async (id, name) => {
    if (!confirm(`Mark ${name} as Active and end their leave period?`)) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });

      if (response.ok) {
        setLeaveList(leaveList.filter(f => f._id !== id));
        alert(`${name} is now marked as Active.`);
      }
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20">
      
      <header className="w-full bg-white px-8 py-3 shadow-sm border-b border-slate-200 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/admin/dashboard">
            <Image src="/Logo.png" alt="Logo" width={200} height={50} className="h-10 w-auto object-contain" />
          </Link>
        </div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors bg-slate-50 px-4 py-2 rounded-xl text-sm border border-slate-200">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </header>

      <main className="max-w-4xl mx-auto w-full p-6 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3 justify-center md:justify-start">
              <PlaneTakeoff className="text-red-500" /> Leave Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">Personnel currently marked as away from campus.</p>
          </div>
          <div className="bg-red-50 text-red-600 px-6 py-2 rounded-2xl font-bold border border-red-100 shadow-sm">
            Total on Leave: {leaveList.length}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-red-500 mb-4" size={40} />
            <p className="text-slate-500">Checking leave records...</p>
          </div>
        ) : leaveList.length > 0 ? (
          <div className="space-y-4">
            {leaveList.map((person) => (
              <div key={person._id} className="bg-white rounded-3xl p-6 border border-red-100 shadow-md shadow-red-900/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:border-red-300">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center text-2xl font-bold border border-slate-200">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xl">{person.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                      <span className="font-bold text-blue-600 uppercase tracking-tighter">{person.department}</span>
                      <span>•</span>
                      <span>ID: {person.employeeId}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => endLeave(person._id, person.name)}
                  className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                >
                  <UserCheck size={18} /> Mark as Active
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 border border-dashed border-slate-200 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <Calendar size={48} className="text-slate-200" />
            </div>
            <p className="text-slate-600 font-bold text-xl tracking-tight">Everyone is Active</p>
            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
              There are currently no faculty members marked as on leave.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}