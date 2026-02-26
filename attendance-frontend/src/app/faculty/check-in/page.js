"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera, CheckCircle2, ShieldAlert, ScanFace, Loader2, Fingerprint } from "lucide-react";

export default function FacultyCheckIn() {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // --- AI States ---
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle"); // idle, scanning, success, failed
  const [extractedData, setExtractedData] = useState(null);

  // --- Initialize Camera and AI on Page Load ---
  useEffect(() => {
    let streamReference = null;

    const setupSystem = async () => {
      // 1. Turn on the Webcam
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          streamReference = stream;
        }
      } catch (err) {
        console.error("Webcam error:", err);
        alert("Please allow camera access to mark attendance.");
      }

      // 2. Load the AI Brain (Dynamic Import to prevent Next.js crashes!)
      try {
        const faceapi = await import('@vladmandic/face-api');
        await faceapi.tf.setBackend('webgl');
        await faceapi.tf.ready();

        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log("✅ AI Engine ready for attendance tracking!");
      } catch (err) {
        console.error("❌ Failed to load AI:", err);
      }
    };

    setupSystem();

    // Cleanup camera when leaving the page
    return () => {
      if (streamReference) {
        streamReference.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- THE REAL AI SCANNER WITH BACKEND CONNECTION ---
  const startBiometricScan = async () => {
    if (!videoRef.current || !modelsLoaded) return;
    
    setScanStatus("scanning");

    try {
      const faceapi = await import('@vladmandic/face-api');
      
      // Remind the AI to use the graphics card!
      await faceapi.tf.setBackend('webgl');
      await faceapi.tf.ready();
      
      // 🧠 Run the AI math extraction
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        // Success! We got the 128-point math array
        const descriptorArray = Array.from(detection.descriptor);
        setExtractedData(descriptorArray);
        
        // --- SEND TO BACKEND TO MATCH THE FACE ---
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ faceDescriptor: descriptorArray }),
          });

          const data = await response.json();

          if (response.ok) {
            setScanStatus("success");
            console.log("Match found!", data);
          } else {
            setScanStatus("failed");
            console.log("No match found.");
          }
        } catch (error) {
          console.error("Backend error:", error);
          setScanStatus("failed");
        }

      } else {
        // AI couldn't see a face clearly
        setScanStatus("failed");
      }
    } catch (error) {
      console.error("Scanning Error:", error);
      setScanStatus("failed");
    }
  };

  const retryScan = () => {
    setScanStatus("idle");
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col relative overflow-hidden">
      
      {/* 1. Dark Header */}
      <header className="w-full bg-[#1e293b] px-6 md:px-10 py-4 shadow-md flex justify-between items-center z-10 border-b border-slate-700">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/Logo.png" 
              alt="Khalsa College Logo" 
              width={200} 
              height={50} 
              className="h-10 w-auto object-contain bg-white/90 p-1.5 rounded-lg"
              priority 
            />
          </Link>
        </div>
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors bg-slate-800 px-4 py-2 rounded-xl">
          <ArrowLeft size={18} /> Home
        </Link>
      </header>

      {/* 2. Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <Fingerprint className="text-blue-500" size={32} />
            Secure Biometric Gateway
          </h1>
          <p className="text-slate-400 mt-2 max-w-md mx-auto">
            Position your face clearly within the frame to verify your identity and mark today's attendance.
          </p>
        </div>

        {/* 3. The Camera Viewport */}
        <div className="relative w-full max-w-2xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-700">
          
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className={`w-full h-full object-cover transition-opacity duration-500 ${cameraActive && scanStatus !== "success" ? "opacity-100" : "opacity-30"}`}
          />

          {/* AI Loading State */}
          {!modelsLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-20">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
              <p className="font-semibold text-lg">Initializing AI Engine...</p>
              <p className="text-sm text-slate-400 mt-1">Loading Neural Networks</p>
            </div>
          )}

          {/* Scanning Overlay (The Laser) */}
          {scanStatus === "scanning" && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              <div className="absolute inset-0 border-4 border-blue-500/30 rounded-3xl" />
            </div>
          )}

          {/* Success Overlay */}
          {scanStatus === "success" && (
            <div className="absolute inset-0 bg-green-900/90 backdrop-blur-md z-30 flex flex-col items-center justify-center animate-in zoom-in duration-300">
              <CheckCircle2 size={80} className="text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]" />
              <h2 className="text-3xl font-bold text-white mb-2">Face Recognized!</h2>
              <p className="text-green-200 text-center px-6">
                Identity verified. Your attendance for today has been recorded.
              </p>
            </div>
          )}

          {/* Failed Overlay */}
          {scanStatus === "failed" && (
            <div className="absolute inset-0 bg-red-900/90 backdrop-blur-md z-30 flex flex-col items-center justify-center animate-in zoom-in duration-300">
              <ShieldAlert size={80} className="text-red-400 mb-4 drop-shadow-[0_0_15px_rgba(248,113,113,0.5)]" />
              <h2 className="text-3xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-red-200 text-center px-6 mb-6">
                The AI could not map your face. Please ensure good lighting and look directly at the camera.
              </p>
              <button onClick={retryScan} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* 4. The Action Button */}
        <div className="mt-8 w-full max-w-2xl">
          <button 
            onClick={startBiometricScan}
            disabled={!modelsLoaded || scanStatus !== "idle"}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-3 ${
              !modelsLoaded || scanStatus !== "idle" 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25 hover:-translate-y-1"
            }`}
          >
            {scanStatus === "scanning" ? (
              <><Loader2 size={24} className="animate-spin" /> Analyzing Biometrics...</>
            ) : scanStatus === "success" ? (
              <><CheckCircle2 size={24} /> Attendance Marked</>
            ) : (
              <><ScanFace size={24} /> Start Biometric Scan</>
            )}
          </button>
        </div>

      </main>

      {/* Laser Animation Keyframes for Tailwind */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(100vh); }
          100% { transform: translateY(0); }
        }
      `}} />

    </div>
  );
}