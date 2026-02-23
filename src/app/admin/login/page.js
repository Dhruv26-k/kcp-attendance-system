"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { ShieldCheck, User, Lock, EyeOff, Eye, Shield } from "lucide-react";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col relative font-sans text-slate-800">
      
      {/* 1. Full-Width Header Bar (Now identical to the Home Page) */}
      <header className="w-full bg-white px-8 py-3 shadow-sm border-b border-slate-200 flex items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/Logo.png" 
            alt="Khalsa College Patiala Logo" 
            width={400} 
            height={90} 
            className="h-16 w-auto object-contain hover:opacity-80 transition-opacity cursor-pointer [clip-path:inset(3px_0_0_0)]"
            priority 
          />
        </Link>
      </header>

      {/* 2. Main Login Area */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 pb-20">
        
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Admin Portal Badge & Title */}
          <div className="flex flex-col items-center mb-8"> 
            <div className="bg-blue-600 text-white p-3.5 rounded-2xl mb-4 shadow-md">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 text-sm mt-2">Sign in to manage faculty and attendance</p>
          </div>

          {/* Login Card & Form */}
          <div className="bg-white w-full rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            <form className="space-y-6">
              
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Admin Username" 
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50/50 focus:bg-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                    defaultChecked 
                  />
                  Remember me
                </label>
                <Link href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Link href="/admin/dashboard" className="block w-full pt-2">
                <button 
                  type="button" 
                  className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Sign In
                </button>
              </Link>

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