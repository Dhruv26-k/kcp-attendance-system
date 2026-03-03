"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Send, Loader2,
  LayoutDashboard, Calendar,
  Menu, X, Inbox, LogOut
} from "lucide-react";

export default function LeaveManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [facultyData, setFacultyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedInFacultyId");
    window.location.href = "/faculty/login";
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem("loggedInFacultyId") || "temp-id-123";

        if (userId === "KCP-MOCK-123") {
          setFacultyData({ 
            name: "Prof. Arshdeep Singh", 
            department: "Computer Science"
          });
          setLeaveHistory([]);
          setIsLoading(false);
          return;
        }

        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/profile/${userId}`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setFacultyData(profile);
        }
      } catch (error) {
        console.error("Data sync error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
    <div className="flex h-screen bg-[#f8f9fb] font-sans text-slate-800 overflow-hidden relative">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 md:flex`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Image src="/Logo.png" alt="Logo" width={35} height={35} className="object-contain" priority />
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
          <Link href="/faculty/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/faculty/schedule" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Calendar size={18} /> My Schedule
          </Link>
          <Link href="/faculty/leaves" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold">
            <Inbox size={18} /> Leave Requests
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors mt-auto">
            <LogOut size={18} /> Sign Out
          </button>
        </nav>
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

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto relative"></div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Management</h1>
                  <p className="text-slate-500 mt-1 text-sm font-medium">Apply for leaves and track your approval status.</p>
               </div>
               <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Academic Year 2026
               </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="w-full">
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col p-10 min-h-[300px]">
                  <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                     <Inbox size={18} className="text-blue-600" /> Leave History
                  </h2>
                  {isLoading ? (
                    <div className="text-center flex flex-col items-center justify-center py-10">
                      <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                      <p className="text-slate-400 font-medium tracking-tight">Loading history...</p>
                    </div>
                  ) : leaveHistory.length === 0 ? (
                    <div className="text-center text-slate-300 flex flex-col items-center justify-center py-10">
                      <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                      <h3 className="font-bold text-slate-500 mb-1">No Leave Records</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest">You have not applied for any leaves yet</p>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                       <table className="w-full text-sm text-left whitespace-nowrap">
                          <thead className="text-[10px] text-slate-400 bg-slate-50 uppercase tracking-widest border-b border-slate-100">
                            <tr>
                              <th className="px-8 py-4">Duration</th>
                              <th className="px-8 py-4">Type</th>
                              <th className="px-8 py-4">Status</th>
                              <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {leaveHistory.map((leave, index) => (
                              <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-4 font-semibold text-slate-900">{leave.startDate} - {leave.endDate}</td>
                                <td className="px-8 py-4 text-slate-500 font-medium">{leave.type}</td>
                                <td className="px-8 py-4">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    leave.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                  }`}>{leave.status || 'Pending'}</span>
                                </td>
                                <td className="px-8 py-4 text-right">
                                  <button className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all">
                                    <X size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full max-w-2xl bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Send size={18} className="text-blue-600" /> New Application
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Leave Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium appearance-none">
                      <option>Casual Leave</option>
                      <option>Medical Leave</option>
                      <option>Duty Leave</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                      <input type="date" required onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-[13px] outline-none bg-slate-50/50 font-medium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                      <input type="date" required onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-[13px] outline-none bg-slate-50/50 font-medium" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Reason</label>
                    <textarea required placeholder="Mention the purpose of leave..." onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm outline-none bg-slate-50/50 h-24 resize-none font-medium focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-2 shadow-lg shadow-blue-200">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Application"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-around items-center z-50 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link href="/faculty/dashboard" className="flex flex-col items-center gap-1 text-slate-400"><LayoutDashboard size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Home</span></Link>
          <Link href="/faculty/schedule" className="flex flex-col items-center gap-1 text-slate-400"><Calendar size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Schedule</span></Link>
          <Link href="/faculty/leaves" className="flex flex-col items-center gap-1 text-blue-600"><Inbox size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Leaves</span></Link>
        </div>
      </div>
    </div>
  );
}