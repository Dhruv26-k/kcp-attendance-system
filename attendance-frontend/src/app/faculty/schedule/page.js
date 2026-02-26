"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Calendar, Settings, Bell, User, 
  Clock, Plus, MapPin, BookOpen, Trash2, AlertCircle, Menu, Loader2, Inbox
} from "lucide-react";

export default function FacultySchedule() {
  // --- DATABASE & PROFILE STATES ---
  const [schedule, setSchedule] = useState([]);
  const [facultyData, setFacultyData] = useState(null); // Added for dynamic name
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for adding a new lecture
  const [newSubject, setNewSubject] = useState("");
  const [newDay, setNewDay] = useState("Monday");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newRoom, setNewRoom] = useState("");

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = localStorage.getItem("loggedInFacultyId") || "temp-id-123";

        // --- MOCK BYPASS LOGIC ---
        if (userId === "KCP-MOCK-123") {
          setFacultyData({ name: "Prof. Arshdeep Singh", department: "Computer Science" });
          setSchedule([]); // Start with empty schedule for mock
          setIsLoading(false);
          return;
        }

        // --- REAL BACKEND FETCH ---
        // Fetch Profile for Header
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/profile/${userId}`);
        if (profileRes.ok) {
          const profile = await profileRes.json();
          setFacultyData(profile);
        }

        // Fetch Schedule for Table
        const scheduleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/schedule/${userId}`);
        if (scheduleRes.ok) {
          const scheduleData = await scheduleRes.json();
          setSchedule(scheduleData);
        }
      } catch (error) {
        console.error("Data sync error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- 2. ADD LECTURE TO DATABASE ---
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!newSubject || !newStartTime || !newEndTime || !newRoom) return;

    setIsSubmitting(true);
    const userId = localStorage.getItem("loggedInFacultyId");

    const newClass = {
      userId,
      subject: newSubject,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/schedule/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });

      if (response.ok) {
        const addedClass = await response.json();
        setSchedule([...schedule, addedClass]);
        setNewSubject("");
        setNewStartTime("");
        setNewEndTime("");
        setNewRoom("");
      }
    } catch (error) {
      alert("Error syncing to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. DELETE LECTURE ---
  const deleteLecture = async (id) => {
    if (!confirm("Remove this lecture?")) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/schedule/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSchedule(schedule.filter(lecture => lecture._id !== id));
      }
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans text-slate-800 overflow-hidden">
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold uppercase shadow-sm">
              {facultyData ? facultyData.name.charAt(0) : <User size={20} />}
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Faculty Portal</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/faculty/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/faculty/schedule" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold shadow-sm">
            <Calendar size={18} /> My Schedule
          </Link>
          <Link href="/faculty/settings" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Header with Dynamic Teacher Name */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between md:justify-end px-6 md:px-10 z-10">
          <button className="md:hidden text-slate-500"><Menu size={24} /></button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-sm font-bold uppercase ring-2 ring-white ring-offset-2">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : facultyData ? facultyData.name.charAt(0) : "?"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {isLoading ? "Loading..." : facultyData ? facultyData.name : "Guest User"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">
                  {facultyData ? facultyData.department : "Syncing..."}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 pb-24">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
               <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lecture Schedule</h1>
                  <p className="text-slate-500 mt-1 text-sm font-medium">Hello {facultyData ? facultyData.name.split(' ')[0] : "Professor"}, manage your classes here.</p>
               </div>
               <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Academic Year 2026
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Timetable Display */}
              <div className="lg:col-span-2 space-y-6">
                {isLoading ? (
                  <div className="py-20 text-center flex flex-col items-center">
                    <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-400 font-medium tracking-tight">Syncing your timetable with database...</p>
                  </div>
                ) : schedule.length > 0 ? (
                  daysOfWeek.map(day => {
                    const dayClasses = schedule.filter(c => c.day === day);
                    if (dayClasses.length === 0) return null;

                    return (
                      <div key={day} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
                          <h3 className="font-bold text-slate-700 text-[10px] uppercase tracking-widest">{day}</h3>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {dayClasses.map(lecture => (
                            <div key={lecture._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-start gap-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                                  <BookOpen size={20} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-base leading-tight">{lecture.subject}</h4>
                                  <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> {lecture.startTime} - {lecture.endTime}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-orange-500" /> {lecture.room}</span>
                                  </div>
                                </div>
                              </div>
                              <button onClick={() => deleteLecture(lecture._id)} className="text-slate-300 hover:text-red-500 transition-all p-2 bg-slate-50 rounded-lg">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white rounded-[40px] p-20 border border-dashed border-slate-200 text-center flex flex-col items-center">
                    <Inbox size={48} className="text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold">No Lectures Found</p>
                    <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-widest font-black">Sync your first class using the right panel</p>
                  </div>
                )}
              </div>

              {/* Right Column: Add New Class Form */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm h-fit sticky top-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Plus size={20} className="text-blue-600" /> Add New Class
                </h2>
                
                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject Title</label>
                    <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Mobile Computing" className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Weekday</label>
                    <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium appearance-none">
                      {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                      <input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                      <input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room / Lab</label>
                    <input type="text" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} placeholder="e.g. Block B-204" className="w-full px-5 py-3.5 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50/50 font-medium" required />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 mt-2 shadow-lg shadow-blue-200">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={18} /> Sync to Database</>}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>

        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-around items-center z-50 rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <Link href="/faculty/dashboard" className="flex flex-col items-center gap-1 text-slate-400"><LayoutDashboard size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Home</span></Link>
          <Link href="/faculty/schedule" className="flex flex-col items-center gap-1 text-blue-600"><Calendar size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Schedule</span></Link>
          <Link href="/faculty/settings" className="flex flex-col items-center gap-1 text-slate-400"><Settings size={20} /><span className="text-[10px] font-bold uppercase tracking-tight">Account</span></Link>
        </div>
      </div>
    </div>
  );
}