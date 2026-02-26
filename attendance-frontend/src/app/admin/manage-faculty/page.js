"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Search, Trash2, Edit, Loader2, 
  UserCheck, Hash, Mail, Phone, UserX 
} from "lucide-react";

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. FETCH ALL REGISTERED FACULTY ---
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/all`);
        if (response.ok) {
          const data = await response.json();
          setFaculty(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  // --- 2. DELETE FACULTY LOGIC ---
  const handleDelete = async (id, name) => {
    if (!confirm(`Permanently delete ${name}? This will also remove their 128-point face math.`)) return;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/${id}`, { 
        method: "DELETE" 
      });
      if (res.ok) {
        setFaculty(faculty.filter(f => f._id !== id));
        alert("Faculty member removed successfully.");
      }
    } catch (err) {
      alert("Delete failed. Is the backend offline?");
    }
  };

  // --- 3. SEARCH FILTER ---
  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20">
      
      {/* Header */}
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

      <main className="max-w-6xl mx-auto w-full p-6 md:p-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Directory</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage and edit registered staff information</p>
          </div>
          <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            Total: {filteredFaculty.length}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or Employee ID..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all bg-white"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Faculty Grid */}
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Syncing with database...</p>
          </div>
        ) : filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((person) => (
              <div key={person._id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(person._id, person.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{person.name}</h3>
                    <p className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mt-1">{person.department}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Hash size={14} className="text-slate-300" /> <span className="font-medium">{person.employeeId}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Mail size={14} className="text-slate-300" /> <span className="truncate">{person.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <Phone size={14} className="text-slate-300" /> <span>{person.phone}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                   <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                      <UserCheck size={10} /> BIOMETRIC REGISTERED
                   </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 border border-dashed border-slate-200 text-center flex flex-col items-center">
            <UserX size={48} className="text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No faculty members found.</p>
            <p className="text-xs text-slate-300 mt-1">Try a different search or add a new member.</p>
          </div>
        )}
      </main>
    </div>
  );
}