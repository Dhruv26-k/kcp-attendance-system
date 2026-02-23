"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, CheckCircle2, ShieldAlert, ScanFace, Loader2 } from "lucide-react";

export default function FacultyCheckIn() {
  const videoRef = useRef(null);
  
  // States to manage the scanning process
  const [cameraActive, setCameraActive] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, success, failed
  const [scanProgress, setScanProgress] = useState(0);

  // Turn on the webcam when the page loads
  useEffect(() => {
    startWebcam();
    return () => stopWebcam(); // Cleanup when leaving the page
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Webcam error:", err);
      alert("Please allow camera access to mark attendance.");
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // This simulates the AI Face-API scanning process for your UI presentation!
  const startBiometricScan = () => {
    setScanStatus("scanning");
    setScanProgress(0);

    // Simulate the 128-point face descriptor extraction taking a few seconds
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanStatus("success");
          stopWebcam(); // Turn off camera on success
          return 100;
        }
        return prev + 5;
      });
    }, 150); // Updates every 150ms
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col relative overflow-hidden">
      
      {/* 1. Header (Dark Mode for Scanner) */}
      <header className="w-full bg-[#1e293b] px-6 md:px-10 py-4 shadow-md border-b border-slate-700 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <ScanFace className="text-blue-400" size={28} />
          <span className="font-bold text-lg text-white tracking-wide">Secure Biometric Gateway</span>
        </div>
        <Link href="/faculty/dashboard">
          <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800 px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500">
            <ArrowLeft size={18} /> Cancel
          </button>
        </Link>
      </header>

      {/* 2. Main Scanner Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 relative">
        
        {/* Background glow effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-md w-full flex flex-col items-center z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Face Authentication</h1>
            <p className="text-slate-400 text-sm">Align your face within the frame to mark today's attendance.</p>
          </div>

          {/* Camera Viewport with Tech UI Overlays */}
          <div className="relative w-full aspect-[3/4] md:aspect-square bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
            
            {/* The actual video feed */}
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${cameraActive && scanStatus !== "success" ? "opacity-100" : "opacity-0"}`}
            />

            {/* SCANNING OVERLAY UI */}
            {cameraActive && scanStatus !== "success" && (
              <>
                {/* 4 Corner Targeting Brackets */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-xl opacity-70"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-xl opacity-70"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-xl opacity-70"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-xl opacity-70"></div>

                {/* Animated Scanning Laser Line */}
                {scanStatus === "scanning" && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_#4ade80] animate-[scan_2s_ease-in-out_infinite]"></div>
                )}
              </>
            )}

            {/* Success State Overlay */}
            {scanStatus === "success" && (
              <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="bg-green-500 rounded-full p-4 mb-4 shadow-[0_0_30px_#22c55e] animate-bounce">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-1">Identity Verified</h2>
                <p className="text-green-200 text-sm font-medium mb-6">Attendance marked for Prof. John Doe</p>
                <Link href="/faculty/dashboard">
                  <button className="bg-white text-green-700 px-6 py-2.5 rounded-xl font-bold hover:bg-green-50 transition-colors shadow-lg">
                    Return to Dashboard
                  </button>
                </Link>
              </div>
            )}

            {/* Offline/Error State */}
            {!cameraActive && scanStatus === "idle" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-900">
                <Camera size={48} className="mb-4 opacity-50" />
                <p className="font-medium">Initializing Hardware...</p>
              </div>
            )}
          </div>

          {/* Controls & Progress Bar */}
          <div className="w-full mt-8">
            {scanStatus === "idle" && (
              <button 
                onClick={startBiometricScan}
                disabled={!cameraActive}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${cameraActive ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
              >
                <ScanFace size={24} /> Initialize AI Scan
              </button>
            )}

            {scanStatus === "scanning" && (
              <div className="w-full bg-slate-800 p-5 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-2 text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin text-blue-400" /> Analyzing 68 Facial Landmarks...</span>
                  <span className="text-blue-400">{scanProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full transition-all duration-150 ease-out relative"
                    style={{ width: `${scanProgress}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/40 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 flex items-start gap-3 text-xs text-slate-500 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <ShieldAlert size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
            <p>Your biometric data is mathematically encrypted. Khalsa College does not store raw images, only mathematically hashed face descriptors.</p>
          </div>

        </div>
      </main>

      {/* Global CSS for the Laser Animation (Next.js specific way to inject a tiny bit of CSS) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />

    </div>
  );
}