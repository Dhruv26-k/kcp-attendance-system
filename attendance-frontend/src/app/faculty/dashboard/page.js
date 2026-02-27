"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, Calendar, Bell, User, 
  PlayCircle, Menu, X, Inbox, Loader2, LogOut, Lock 
} from "lucide-react";

export default function FacultyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // --- BACKEND CONNECTION STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [facultyData, setFacultyData] = useState(null);
  const [stats, setStats] = useState({ totalPresent: 0 });
  const [recentActivity, setRecentActivity] = useState([]);

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem("loggedInFacultyId");
    window.location.href = "/faculty/login";
  };

  // --- FETCH DATA FROM BACKEND ON LOAD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem("loggedInFacultyId") || "temp-id-123";

        // --- MOCK BYPASS FOR TESTING ---
        if (userId === "KCP-MOCK-123") {
          setFacultyData({
            name: "Prof. Arshdeep Singh",
            department: "Computer Science",
            email: "arshdeep.s@khalsacollege.edu.in",
            phone: "+91 98765-43210"
          });
          
          // FAKE DATA COMPLETELY CLEARED HERE:
          setStats({ totalPresent: 0 }); 
          setRecentActivity([]); 
          
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/dashboard/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setFacultyData(data.profile);
          setStats(data.stats);
          setRecentActivity(data.recentActivity || []);
        } else {
          console.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Backend connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans text-slate-800 overflow-hidden relative">
      
      {/* 1. SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Image src="/Logo.png" alt="Logo" width={35} height={35} className="object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-900 leading-tight">Khalsa College</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Patiala</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/faculty/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          
          <Link href="/faculty/schedule" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Calendar size={18} /> My Schedule
          </Link>

          <Link href="/faculty/leaves" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Inbox size={18} /> Leave Requests
          </Link>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors mt-auto"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
        
        {/* SIDEBAR PROFILE SECTION */}
        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {isLoading ? <Loader2 size={12} className="animate-spin" /> : facultyData ? facultyData.name.charAt(0) : "?"}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate tracking-tight">
                  {isLoading ? "Syncing..." : facultyData ? facultyData.name : "Guest User"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {facultyData ? facultyData.department : "Khalsa College"}
                </p>
              </div>
           </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto relative">
            <button className="text-slate-400 hover:text-slate-600 relative p-2 transition-colors">
              <Bell size={20} />
            </button>
            
            {/* PROFILE DROPDOWN TRIGGER */}
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs uppercase hover:ring-2 hover:ring-blue-100 transition-all focus:outline-none"
            >
               {facultyData ? facultyData.name.charAt(0) : <User size={16}/>}
            </button>

            {/* PROFILE DROPDOWN MENU */}
            {isProfileOpen && (
              <div className="absolute top-12 right-0 mt-2 w-80 bg-white rounded-3xl border border-slate-100 shadow-2xl p-6 z-50">
                <div className="flex flex-col items-center text-center mb-6">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl uppercase mb-3 shadow-inner">
                      {facultyData ? facultyData.name.charAt(0) : <User size={24}/>}
                   </div>
                   <h3 className="font-bold text-slate-900 text-lg leading-tight">
                     {facultyData ? facultyData.name : "Guest User"}
                   </h3>
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                     {facultyData ? facultyData.department : "Khalsa College"}
                   </p>
                </div>
                
                <div className="space-y-4 border-t border-slate-50 pt-5">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</span>
                      <span className="text-sm font-medium text-slate-700">{facultyData?.email || "N/A"}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</span>
                      <span className="text-sm font-medium text-slate-700">{facultyData?.phone || "N/A"}</span>
                   </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50">
                   <Link href="/faculty/check-in" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors">
                      <Lock size={14} /> Reset Biometric Map
                   </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24" onClick={() => isProfileOpen && setIsProfileOpen(false)}>
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome back{facultyData ? `, ${facultyData.name.split(' ')[0]}` : ""}!
                </h1>
                <p className="text-slate-500 mt-1 text-sm font-medium">
                  {isLoading ? "Syncing with secure servers..." : "Here is your academic attendance overview."}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                Session: 2025-26
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className={`bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm transition-all flex items-center justify-between ${isLoading ? "opacity-50" : "opacity-100"}`}>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">Total Present</p>
                  <h3 className="text-4xl font-black text-slate-800">
                    {isLoading ? "-" : stats.totalPresent}
                  </h3>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-500">
                  <Calendar size={32}/>
                </div>
              </div>
            </div>

            {/* Attendance Action */}
            <div className="bg-white p-8 rounded-[32px] border border-dashed border-slate-300 flex flex-col items-center text-center gap-4 group hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-300">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                <PlayCircle size={32} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ready to mark attendance?</h2>
                <p className="text-slate-500 text-xs mt-1">Open the facial recognition gateway within campus boundaries.</p>
              </div>
              <Link href="/faculty/check-in">
                <button className="bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                  Initialize AI Scan
                </button>
              </Link>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="font-bold text-slate-900">Recent Attendance Logs</h2>
                <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">View All History</Link>
              </div>
              
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 size={32} className="animate-spin mb-4 text-blue-500" />
                  <p className="text-sm font-medium">Retrieving logs...</p>
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] text-slate-400 bg-slate-50 uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Check-In Time</th>
                        <th className="px-8 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((record, index) => (
                        <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 font-semibold text-slate-700">{record.date}</td>
                          <td className="px-8 py-5 font-mono text-blue-600">{record.timeIn}</td>
                          <td className="px-8 py-5">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-24 flex flex-col items-center justify-center text-slate-300 italic">
                  <Inbox size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold text-slate-400 mt-2">No records found for the current month.</p>
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-around items-center z-50 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link href="/faculty/dashboard" className="flex flex-col items-center gap-1 text-blue-600"><LayoutDashboard size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Home</span></Link>
          <Link href="/faculty/schedule" className="flex flex-col items-center gap-1 text-slate-400"><Calendar size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Schedule</span></Link>
          <Link href="/faculty/leaves" className="flex flex-col items-center gap-1 text-slate-400"><Inbox size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Leaves</span></Link>
        </div>
      </div>
    </div>
  );
}