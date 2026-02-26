"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, LayoutDashboard, LogOut, UserPlus, Calendar, Download, 
  Users, UserCheck, Clock, UserX, Search, ChevronLeft, ChevronRight, BellOff, Loader2 
} from "lucide-react";

export default function AdminDashboard() {
  // --- BACKEND CONNECTION STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFaculty: 0,
    presentToday: 0,
    lateArrivals: 0,
    onLeave: 0,
    attendanceRate: "0%"
  });
  const [attendanceLog, setAttendanceLog] = useState([]);

  // --- FETCH DATA FROM BACKEND ON LOAD ---
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/overview`);
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setAttendanceLog(data.recentLogs || []);
        }
      } catch (error) {
        console.error("Dashboard connection error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20 relative">
      
      {/* 1. Header Navigation */}
      <header className="w-full bg-white px-8 py-3 shadow-sm border-b border-slate-200 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/Logo.png" 
              alt="Khalsa College Logo" 
              width={250} 
              height={60} 
              className="h-10 w-auto object-contain [clip-path:inset(3px_0_0_0)]"
              priority 
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <Home size={18} /> <span className="hidden md:inline">Home</span>
          </Link>
          <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm">
            <LayoutDashboard size={18} /> <span className="hidden md:inline">Dashboard</span>
          </div>
          <Link href="/admin/login" className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors ml-2">
            <LogOut size={18} /> <span className="hidden md:inline">Logout</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content Wrapper */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 md:px-8 pt-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Overview of Khalsa College Faculty Attendance</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href="/admin/add-faculty">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm whitespace-nowrap">
                <UserPlus size={16} /> Add Faculty
              </button>
            </Link>
            <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium bg-white hover:bg-slate-50 flex items-center gap-2 shadow-sm">
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* 3. Stats Grid (Now Dynamic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Faculty", value: stats.totalFaculty, icon: <Users />, color: "bg-purple-50 text-purple-600", trend: "-" },
            { label: "Present Today", value: stats.presentToday, icon: <UserCheck />, color: "bg-green-50 text-green-600", trend: stats.attendanceRate },
            { label: "Late Arrivals", value: stats.lateArrivals, icon: <Clock />, color: "bg-orange-50 text-orange-600", trend: "-" },
            { label: "On Leave", value: stats.onLeave, icon: <UserX />, color: "bg-red-50 text-red-600", trend: "0%" }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">{item.label}</p>
                <div className={`p-2 rounded-full ${item.color}`}>{item.icon}</div>
              </div>
              <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${isLoading ? "text-slate-200" : "text-slate-900"}`}>
                  {isLoading ? "0" : item.value}
                </h3>
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">{item.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Faculty Attendance Log Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-900">Faculty Attendance Log</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search faculty..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-48 md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="overflow-x-auto flex-grow">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Time In</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td>
                    </tr>
                  ) : attendanceLog.length > 0 ? (
                    attendanceLog.map((log, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{log.name}</td>
                        <td className="px-6 py-4 text-slate-500">{log.department}</td>
                        <td className="px-6 py-4 font-mono text-blue-600">{log.timeIn}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Present</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <Image src="/Logo.png" alt="Watermark" width={180} height={70} className="mb-4 grayscale" />
                          <p className="text-slate-600 font-semibold text-lg">No Faculty Records Found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Alerts */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 h-fit min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Department Alerts</h2>
            <div className="flex-grow flex flex-col items-center justify-center opacity-50">
              <BellOff size={40} className="text-slate-400 mb-3" />
              <p className="text-slate-600 font-semibold">All Clear</p>
              <p className="text-xs text-slate-500 mt-1 text-center">No recent alerts or notifications to display.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full px-8 flex justify-between items-center text-[11px] md:text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5"><UserCheck size={14} />Secure Face Recognition System v1.0</div>
        <div>© 2026 Khalsa College Patiala</div>
      </footer>

    </div>
  );
}