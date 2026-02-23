"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  LayoutDashboard, Calendar, Settings, Bell, User, 
  Clock, Award, TrendingUp, PlayCircle, Info, 
  Menu, X, Inbox 
} from "lucide-react";

export default function FacultyDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
              <span className="text-[10px] text-slate-500 font-medium tracking-wider">PATIALA</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/faculty/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/faculty/schedule" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Calendar size={18} /> My Schedule
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings size={18} /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-100">
           <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-200 text-slate-400 rounded-lg flex items-center justify-center font-bold text-xs underline">?</div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate tracking-tight italic">Waiting for Login...</p>
              </div>
           </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <button className="text-slate-400 hover:text-slate-600 relative p-2">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight underline">Welcome back!</h1>
              <p className="text-slate-500 mt-1 text-sm italic">Connect to the database to sync your attendance records.</p>
            </div>

            {/* Empty Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: "Total Present", value: "0", icon: <Calendar size={20}/>, color: "blue" },
                { label: "Working Hours", value: "0h", icon: <Clock size={20}/>, color: "orange" },
                { label: "Punctuality", value: "0%", icon: <Award size={20}/>, color: "purple" },
                { label: "Overtime", value: "0h", icon: <TrendingUp size={20}/>, color: "green" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm opacity-60">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">{stat.label}</p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-slate-400">{stat.value}</h3>
                    <div className={`p-2 bg-slate-50 text-slate-300 rounded-lg`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Attendance Action */}
            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center text-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                <PlayCircle size={32} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ready to start today?</h2>
                <p className="text-slate-500 text-xs mt-1">Click below to open the facial recognition gateway.</p>
              </div>
              <Link href="/faculty/check-in">
                <button className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Initialize Scan
                </button>
              </Link>
            </div>

            {/* Empty Table State */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h2 className="font-bold text-slate-900">Recent Activity</h2>
              </div>
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic">
                <Inbox size={48} className="mb-4 opacity-20" />
                <p className="text-sm">No attendance records found for this period.</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}