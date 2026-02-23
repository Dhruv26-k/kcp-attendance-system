import Link from "next/link";
import Image from "next/image";
import { 
  Home, LayoutDashboard, LogOut, UserPlus, Calendar, Download, 
  Users, UserCheck, Clock, UserX, Search, ChevronLeft, ChevronRight, BellOff 
} from "lucide-react";

export default function AdminDashboard() {
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
        
        {/* Top Action Bar */}
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
            <div className="relative hidden md:block opacity-50 pointer-events-none">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="date" disabled className="pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400" />
            </div>
            <button disabled className="border border-slate-200 text-slate-400 px-4 py-2 rounded-xl text-sm font-medium bg-slate-50 whitespace-nowrap opacity-70 cursor-not-allowed flex items-center gap-2">
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* 3. Stats Grid (Zeroed out) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 text-sm font-medium">Total Faculty</p>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-full"><Users size={18} /></div>
            </div>
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold text-slate-300">0</h3>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">-</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 text-sm font-medium">Present Today</p>
              <div className="p-2 bg-green-50 text-green-600 rounded-full"><UserCheck size={18} /></div>
            </div>
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold text-slate-300">0</h3>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">0%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 text-sm font-medium">Late Arrivals</p>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-full"><Clock size={18} /></div>
            </div>
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold text-slate-300">0</h3>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">-</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
            <div className="flex justify-between items-start mb-4">
              <p className="text-slate-500 text-sm font-medium">On Leave</p>
              <div className="p-2 bg-red-50 text-red-600 rounded-full"><UserX size={18} /></div>
            </div>
            <div className="flex justify-between items-end">
              <h3 className="text-3xl font-bold text-slate-300">0</h3>
              <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">0%</span>
            </div>
          </div>
        </div>

        {/* 4. Bottom Grid (Table & Alerts Empty States) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Empty Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col min-h-[400px]">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-slate-900">Faculty Attendance Log</h2>
              <div className="relative opacity-50 pointer-events-none">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input type="text" disabled placeholder="Search faculty..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-48 md:w-64 bg-slate-50" />
              </div>
            </div>

            <div className="overflow-x-auto flex-grow flex flex-col">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time In</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                {/* Empty State Body with College Logo */}
                <tbody>
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40 hover:opacity-60 transition-opacity">
                        <Image 
                          src="/Logo.png" 
                          alt="Khalsa College Watermark" 
                          width={200} 
                          height={80} 
                          className="mb-4 grayscale opacity-60 pointer-events-none" 
                        />
                        <p className="text-slate-600 font-semibold text-lg">No Faculty Records Found</p>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm">
                          Your database is currently empty. Click the "Add Faculty" button above to register new staff members.
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Pagination (Disabled) */}
            <div className="p-4 border-t border-slate-100 flex items-center gap-2 text-slate-300 bg-slate-50 mt-auto pointer-events-none">
              <button className="p-1 rounded"><ChevronLeft size={18}/></button>
              <button className="w-8 h-8 rounded border border-slate-200 bg-white text-slate-400 font-semibold text-sm flex items-center justify-center">0</button>
              <button className="p-1 rounded"><ChevronRight size={18}/></button>
            </div>

          </div>

          {/* Right Column: Empty Alerts */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 h-fit min-h-[400px] flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Department Alerts</h2>
            
            <div className="flex-grow flex flex-col items-center justify-center opacity-50">
              <BellOff size={40} className="text-slate-400 mb-3" />
              <p className="text-slate-600 font-semibold">All Clear</p>
              <p className="text-xs text-slate-500 mt-1 text-center">
                No recent alerts or notifications to display at this time.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <div className="absolute bottom-4 w-full px-8 flex justify-between items-center text-[11px] md:text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <UserCheck size={14} />
          Secure Face Recognition System v1.0
        </div>
        <div>
          © 2026 Khalsa College Patiala
        </div>
      </div>

    </div>
  );
}