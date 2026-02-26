"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // To redirect after login
import { GraduationCap, User, Shield, Home, LogOut, Loader2 } from "lucide-react";

export default function FacultyLogin() {
  const router = useRouter();
  const [facultyId, setFacultyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- BACKEND LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!facultyId) return;

    setIsLoading(true);
    setErrorMessage("");

    // --- MOCK BYPASS BLOCK ---
    // This allows testing without a backend connection
    if (facultyId === "KCP-MOCK-123") {
      setTimeout(() => {
        localStorage.setItem("loggedInFacultyId", "KCP-MOCK-123");
        router.push("/faculty/dashboard");
        setIsLoading(false);
      }, 1000);
      return; 
    }
    // -------------------------

    try {
      // 1. Send the ID to the backend to verify if the faculty exists
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: facultyId }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Save the ID in localStorage so the Dashboard can use it to fetch data
        localStorage.setItem("loggedInFacultyId", facultyId);
        
        // 3. Success! Redirect to the dashboard
        router.push("/faculty/dashboard");
      } else {
        // Show error from backend (e.g., "Invalid Faculty ID")
        setErrorMessage(data.message || "Invalid Faculty ID. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Cannot connect to server. Check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 relative">
      
      {/* 1. Header */}
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
        
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors">
            <Home size={18} /> <span className="hidden md:inline">Home</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Login Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 pb-20 mt-8 md:mt-0">
        
        <div className="w-full max-w-md flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-8"> 
            <div className="bg-amber-500 text-white p-3.5 rounded-2xl mb-4 shadow-md">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Faculty Login</h1>
            <p className="text-slate-500 text-sm mt-2">Enter your Faculty ID to proceed to attendance</p>
          </div>

          <div className="bg-white w-full rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Faculty ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g. KCP-FAC-001" 
                    value={facultyId}
                    onChange={(e) => {
                        setFacultyId(e.target.value);
                        setErrorMessage(""); // Clear error when typing
                    }}
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{errorMessage}</p>
                )}
              </div>

              <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-xl text-blue-800 text-xs leading-relaxed">
                <span className="font-bold">Note:</span> After logging in, you will be directed to the face recognition scanner to verify your physical presence on campus.
              </div>

              <button 
                type="submit" 
                disabled={!facultyId || isLoading}
                className={`w-full font-semibold py-3.5 rounded-xl transition-all shadow-md flex justify-center items-center gap-2 ${
                    facultyId && !isLoading 
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Verifying ID...</>
                ) : (
                    "Proceed to Dashboard"
                )}
              </button>

            </form>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <div className="absolute bottom-6 w-full px-8 flex justify-between items-center text-xs text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <Shield size={14} />
          Secure Face Recognition System v1.0
        </div>
        <div>
          © 2026 Khalsa College Patiala
        </div>
      </div>

    </div>
  );
}