"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Lock, Bell, Shield, Save, LogOut, Phone, Mail, Loader2, Calendar, Settings } from "lucide-react";

export default function FacultySettings() {
  const [facultyData, setFacultyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. LOAD PROFILE DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("loggedInFacultyId");

        // Mock Bypass for testing without backend
        if (userId === "KCP-MOCK-123") {
          setFacultyData({
            name: "Prof. Arshdeep Singh",
            email: "arshdeep.s@khalsacollege.edu.in",
            phone: "+91 98765-43210",
            department: "Computer Science"
          });
          setIsLoading(false);
          return;
        }

        // Real Backend Fetch
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFacultyData(data);
        }
      } catch (error) {
        console.error("Settings load error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInFacultyId");
    window.location.href = "/faculty/login";
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8f9fb]">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-slate-800 pb-20">
      
      {/* Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/faculty/dashboard" className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </header>

      <main className="max-w-3xl mx-auto p-6 md:p-10 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
            <User size={20} className="text-blue-600" /> Personal Profile
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={facultyData?.name} 
                  className="w-full p-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <input 
                  type="text" 
                  value={facultyData?.department} 
                  disabled 
                  className="w-full p-3.5 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 font-medium cursor-not-allowed" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="email" 
                    defaultValue={facultyData?.email} 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="tel" 
                    defaultValue={facultyData?.phone} 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900">
            <Shield size={20} className="text-green-600" /> Security & Privacy
          </h2>
          <div className="space-y-3">
             <Link href="/faculty/check-in" className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Lock size={18} className="text-slate-400 group-hover:text-blue-600" />
                   </div>
                   <div>
                    <span className="font-bold text-sm block">Reset Biometric Face Map</span>
                    <span className="text-[10px] text-slate-400 font-medium">Update your facial recognition data.</span>
                   </div>
                </div>
                <span className="text-xs font-bold text-blue-600 underline">Update Now</span>
             </Link>
          </div>
        </div>

        <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2 active:scale-[0.98]">
          <Save size={20} /> Update My Profile
        </button>
      </main>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-around items-center z-50 rounded-t-[32px] shadow-lg">
        <Link href="/faculty/dashboard" className="flex flex-col items-center gap-1 text-slate-400 transition-colors">
          <User size={20} /><span className="text-[10px] font-bold uppercase tracking-tighter">Home</span>
        </Link>
        <Link href="/faculty/schedule" className="flex flex-col items-center gap-1 text-slate-400 transition-colors">
          <Calendar size={20} /><span className="text-[10px] font-bold uppercase tracking-tighter">Schedule</span>
        </Link>
        <Link href="/faculty/settings" className="flex flex-col items-center gap-1 text-blue-600 transition-colors">
          <Settings size={20} /><span className="text-[10px] font-bold uppercase tracking-tighter">Settings</span>
        </Link>
      </div>

    </div>
  );
}