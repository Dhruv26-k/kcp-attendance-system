"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, Calendar, Settings, Bell, User, 
  Clock, Plus, MapPin, BookOpen, Trash2, AlertCircle, Menu
} from "lucide-react";

export default function FacultySchedule() {
  // Dummy data for the schedule (Later, this will come from your MongoDB database)
  const [schedule, setSchedule] = useState([
    { id: 1, subject: "Digital Electronics", day: "Monday", startTime: "10:00", endTime: "11:00", room: "Room 304" },
    { id: 2, subject: "Data Structures", day: "Monday", startTime: "11:30", endTime: "12:30", room: "Lab 2" },
    { id: 3, subject: "Web Development", day: "Tuesday", startTime: "09:00", endTime: "10:30", room: "Lab 1" },
  ]);

  // Form states for adding a new lecture
  const [newSubject, setNewSubject] = useState("");
  const [newDay, setNewDay] = useState("Monday");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newRoom, setNewRoom] = useState("");

  const handleAddLecture = (e) => {
    e.preventDefault();
    if (!newSubject || !newStartTime || !newEndTime || !newRoom) return;

    const newClass = {
      id: schedule.length + 1,
      subject: newSubject,
      day: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
      room: newRoom,
    };
    
    setSchedule([...schedule, newClass]);
    
    // Clear form
    setNewSubject("");
    setNewStartTime("");
    setNewEndTime("");
    setNewRoom("");
  };

  const deleteLecture = (id) => {
    setSchedule(schedule.filter(lecture => lecture.id !== id));
  };

  // Group schedule by days for clean rendering
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="flex h-screen bg-[#f8f9fb] font-sans text-slate-800 overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <span className="font-bold text-lg text-slate-900">Faculty Portal</span>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/faculty/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/faculty/schedule" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium transition-colors">
            <Calendar size={18} /> My Schedule
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl font-medium transition-colors">
            <Settings size={18} /> Settings
          </Link>
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between md:justify-end px-6 md:px-10 z-10">
          <button className="md:hidden text-slate-500"><Menu size={24} /></button>
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-sm"><User size={18} /></div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900">Prof. John Doe</p>
                <p className="text-xs text-slate-500">Computer Science</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header Title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Lecture Schedule</h1>
              <p className="text-slate-500 mt-1 text-sm">Manage your weekly classes and timings.</p>
            </div>

            {/* Smart Reminder Banner (Next Lecture) */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Bell size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-100 mb-1 flex items-center gap-2">
                    <AlertCircle size={14} /> Upcoming Lecture Reminder
                  </h3>
                  <p className="text-xl font-bold">Digital Electronics</p>
                  <p className="text-sm text-blue-50 mt-1 flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> Monday, 10:00 AM</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> Room 304</span>
                  </p>
                </div>
              </div>
              <button className="bg-white text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 transition-colors">
                View Syllabus
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Timetable Display (Takes up 2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-lg font-bold text-slate-900">Weekly Timetable</h2>
                
                {daysOfWeek.map(day => {
                  const dayClasses = schedule.filter(c => c.day === day);
                  if (dayClasses.length === 0) return null; // Hide empty days

                  return (
                    <div key={day} className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700">{day}</h3>
                      </div>
                      <div className="divide-y divide-slate-50">
                        {dayClasses.map(lecture => (
                          <div key={lecture.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-start gap-4">
                              <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-lg mt-1">
                                <BookOpen size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-base">{lecture.subject}</h4>
                                <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-slate-500">
                                  <span className="flex items-center gap-1.5"><Clock size={14} /> {lecture.startTime} - {lecture.endTime}</span>
                                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {lecture.room}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteLecture(lecture.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Add New Class Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] h-fit">
                <h2 className="text-lg font-bold text-slate-900 mb-5 border-b border-slate-100 pb-3">Add New Class</h2>
                
                <form onSubmit={handleAddLecture} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Name</label>
                    <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="e.g. Compiler Design" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" required />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Day of Week</label>
                    <select value={newDay} onChange={(e) => setNewDay(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 appearance-none">
                      {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Time</label>
                      <input type="time" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">End Time</label>
                      <input type="time" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" required />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Room / Lab</label>
                    <input type="text" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} placeholder="e.g. Lab 3" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50" required />
                  </div>
                  {/* Mobile Bottom Navigation - Only visible on small screens */}
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-50">
     <Link href="/faculty/dashboard" className="flex flex-col items-center gap-1 text-slate-500 hover:text-blue-600">
    <LayoutDashboard size={20} />
    <span className="text-[10px] font-medium">Dashboard</span>
     </Link>
     <Link href="/faculty/schedule" className="flex flex-col items-center gap-1 text-blue-600 font-bold">
    <Calendar size={20} />
    <span className="text-[10px]">Schedule</span>
     </Link>
    <Link href="#" className="flex flex-col items-center gap-1 text-slate-500">
    <Settings size={20} />
    <span className="text-[10px] font-medium">Settings</span>
     </Link>
    </div>

                  <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 mt-2">
                    <Plus size={18} /> Add to Schedule
                  </button>
                </form>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}