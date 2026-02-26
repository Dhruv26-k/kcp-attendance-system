"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, LayoutDashboard, LogOut, UserPlus, Calendar, Download, 
  Users, UserCheck, Clock, UserX, Search, ChevronLeft, ChevronRight, BellOff, Loader2 
} from "lucide-react";

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalFaculty: 0,
    presentToday: 0,
    lateArrivals: 0,
    onLeave: 0,
    attendanceRate: "0%"
  });
  const [attendanceLog, setAttendanceLog] = useState([]);

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

  const filteredLogs = attendanceLog.filter(log => {
    if (filter === "all") return true;
    return log.status.toLowerCase() === filter;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20 relative">
      <header className="w-full bg-white px-8 py-3 shadow-sm border-b border-slate-200 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/Logo.png" alt="Logo" width={250} height={60} className="h-10 w-auto object-contain" priority />
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

      <main className="flex-grow w-full max-w-[1400px] mx-auto px-6 md:px-8 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Overview of Khalsa College Faculty Attendance</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link href="/admin/add-faculty">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
                <UserPlus size={16} /> Add Faculty
              </button>
            </Link>
          </div>
        </div>

        {/* 3. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/manage-faculty" className="block group transition-transform hover:-translate-y-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full group-hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium group-hover:text-blue-600 transition-colors">Total Faculty</p>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all"><Users size={18} /></div>
              </div>
              <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${isLoading ? "text-slate-200" : "text-slate-900"}`}>{isLoading ? "0" : stats.totalFaculty}</h3>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Edit List</span>
              </div>
            </div>
          </Link>

          <button onClick={() => setFilter("present")} className="text-left group transition-transform hover:-translate-y-1">
            <div className={`bg-white p-6 rounded-3xl border shadow-sm h-full group-hover:shadow-md ${filter === "present" ? "border-green-500" : "border-slate-100"}`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Present Today</p>
                <div className="p-2 bg-green-50 text-green-600 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors"><UserCheck size={18} /></div>
              </div>
              <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${isLoading ? "text-slate-200" : "text-slate-900"}`}>{isLoading ? "0" : stats.presentToday}</h3>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{stats.attendanceRate}</span>
              </div>
            </div>
          </button>

          <button onClick={() => setFilter("late")} className="text-left group transition-transform hover:-translate-y-1">
            <div className={`bg-white p-6 rounded-3xl border shadow-sm h-full group-hover:shadow-md ${filter === "late" ? "border-orange-500" : "border-slate-100"}`}>
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Late Arrivals</p>
                <div className="p-2 bg-orange-50 text-orange-600 rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors"><Clock size={18} /></div>
              </div>
              <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${isLoading ? "text-slate-200" : "text-slate-900"}`}>{isLoading ? "0" : stats.lateArrivals}</h3>
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">View All</span>
              </div>
            </div>
          </button>

          <Link href="/admin/leave-management" className="text-left group transition-transform hover:-translate-y-1 block">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full group-hover:shadow-md group-hover:border-red-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium group-hover:text-red-600 transition-colors">On Leave</p>
                <div className="p-2 bg-red-50 text-red-600 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors"><UserX size={18} /></div>
              </div>
              <div className="flex justify-between items-end">
                <h3 className={`text-3xl font-bold ${isLoading ? "text-slate-200" : "text-slate-900"}`}>{isLoading ? "0" : stats.onLeave}</h3>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight hover:bg-red-200 transition-colors">Manage</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-bold text-slate-900">Attendance Log</h2>
              {filter !== "all" && <button onClick={() => setFilter("all")} className="text-xs font-bold text-blue-600 hover:underline">Clear Filter</button>}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search faculty..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-48 md:w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto flex-grow">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr><th className="px-6 py-4">Employee</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Time In</th><th className="px-6 py-4">Status</th></tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="4" className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{log.name}</td>
                      <td className="px-6 py-4 text-slate-500">{log.department}</td>
                      <td className="px-6 py-4 font-mono text-blue-600">{log.timeIn}</td>
                      <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${log.status === "Present" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{log.status}</span></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="px-6 py-20 text-center flex flex-col items-center justify-center opacity-40"><Image src="/Logo.png" alt="Watermark" width={180} height={70} className="mb-4 grayscale" /><p className="text-slate-600 font-semibold text-lg">No {filter !== "all" ? filter : ""} records found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-4 w-full px-8 flex justify-between items-center text-[11px] md:text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5"><UserCheck size={14} />Secure Face Recognition System v1.0</div>
        <div>© 2026 Khalsa College Patiala</div>
      </footer>
    </div>
  );
}