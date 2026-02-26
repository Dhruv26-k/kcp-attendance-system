"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Better for Next.js redirects
import { Home, ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Set login flag and store token if your backend sends one
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminUser", JSON.stringify(data.user || { email }));
        
        // 2. Redirect to dashboard
        router.push("/admin/dashboard");
      } else {
        // 3. Bypass for testing during development
        if (email === "admin@kcp.com" && password === "kcp123") {
          localStorage.setItem("isLoggedIn", "true");
          router.push("/admin/dashboard");
        } else {
          setErrorMessage(data.message || "Invalid Admin Credentials");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      // Bypass for local testing if backend is not running
      if (email === "admin@kcp.com" && password === "kcp123") {
        localStorage.setItem("isLoggedIn", "true");
        router.push("/admin/dashboard");
      } else {
        setErrorMessage("Server connection failed. Is the backend running?");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col relative overflow-hidden font-sans">
      
      {/* 1. TOP NAVIGATION BAR */}
      <nav className="z-20 w-full p-6 md:px-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block leading-none tracking-tight">Admin Portal</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Secure Access</span>
          </div>
        </div>

        <Link 
          href="/" 
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:text-blue-600 transition-all font-semibold text-sm group"
        >
          <Home size={18} />
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </nav>

      {/* 2. LOGIN MAIN SECTION */}
      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-full h-16 bg-white mb-4">
              <Image 
                src="/Logo.png" 
                alt="KCP Logo" 
                width={160} 
                height={50}
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Login</h2>
            <p className="text-slate-500 text-sm mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Admin Email</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kcp.edu"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-900 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Enter Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-900 text-sm"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all flex items-center justify-center gap-2 group mt-4 disabled:bg-blue-400"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>Secure Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 mt-8 leading-relaxed">
            By logging in, you agree to the KCP Security & <br/> Data Privacy Protocols.
          </p>
        </div>
      </div>
    </div>
  );
}