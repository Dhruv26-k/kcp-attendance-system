"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ScanFace, Loader2, ShieldCheck, ShieldAlert, Fingerprint, CheckCircle2 } from "lucide-react";

export default function FacultyCheckIn() {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // --- AI States ---
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [scanStatus, setScanStatus] = useState("idle"); 
  const [extractedData, setExtractedData] = useState(null);

  // --- GEOFENCING STATES ---
  const [locationStatus, setLocationStatus] = useState("checking"); // checking, success, denied
  const [distance, setDistance] = useState(null);

  // EXACT COORDINATES FROM YOUR MAP SCREENSHOT
  const COLLEGE_LAT = 30.33319; 
  const COLLEGE_LON = 76.37679;
  const ALLOWED_RADIUS_METERS = 300; 

  useEffect(() => {
    runGeofenceCheck();
  }, []);

  // --- 1. GEOFENCING LOGIC ---
  const runGeofenceCheck = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("checking");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        const d = calculateDistance(userLat, userLon, COLLEGE_LAT, COLLEGE_LON);
        setDistance(d);

        if (d <= ALLOWED_RADIUS_METERS) {
          setLocationStatus("success");
          setupSystem(); // Only start camera/AI if location is valid
        } else {
          setLocationStatus("denied");
        }
      },
      (error) => {
        console.error("Location error:", error);
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; 
  };

  // --- 2. SYSTEM INITIALIZATION ---
  const setupSystem = async () => {
    let streamReference = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        streamReference = stream;
      }
    } catch (err) {
      alert("Please allow camera access.");
    }

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
    } catch (err) {
      console.error("AI Load error:", err);
    }
  };

  const startBiometricScan = async () => {
    if (!videoRef.current || !modelsLoaded || locationStatus !== "success") return;
    setScanStatus("scanning");

    try {
      const faceapi = await import('@vladmandic/face-api');
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptorArray = Array.from(detection.descriptor);
        setExtractedData(descriptorArray);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/faculty/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            faceDescriptor: descriptorArray,
            location: { lat: COLLEGE_LAT, lon: COLLEGE_LON } // Send location for backend verification
          }),
        });

        if (response.ok) {
          setScanStatus("success");
        } else {
          setScanStatus("failed");
        }
      } else {
        setScanStatus("failed");
      }
    } catch (error) {
      setScanStatus("failed");
    }
  };

  const retryScan = () => {
    setScanStatus("idle");
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-slate-200 flex flex-col relative overflow-hidden">
      
      <header className="w-full bg-[#1e293b] px-6 py-4 shadow-md flex justify-between items-center z-10 border-b border-slate-700">
        <Image src="/Logo.png" alt="Logo" width={200} height={50} className="h-10 w-auto bg-white/90 p-1.5 rounded-lg" priority />
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white font-medium bg-slate-800 px-4 py-2 rounded-xl">
          <ArrowLeft size={18} /> Exit
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 z-10">
        
        <div className="text-center mb-8">
          {/* GEOFENCE STATUS BADGE */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border ${
            locationStatus === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
            locationStatus === 'denied' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
            'bg-blue-500/10 text-blue-400 border-blue-500/20'
          }`}>
            {locationStatus === 'checking' && <><Loader2 size={14} className="animate-spin" /> Verifying Campus Location...</>}
            {locationStatus === 'success' && <><ShieldCheck size={14} /> Location Verified: On Campus</>}
            {locationStatus === 'denied' && <><ShieldAlert size={14} /> Access Denied: Outside Campus</>}
          </div>
          
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center justify-center gap-3">
            <Fingerprint className="text-blue-500" size={32} /> Secure Gateway
          </h1>
        </div>

        <div className="relative w-full max-w-2xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
          <video ref={videoRef} autoPlay muted className={`w-full h-full object-cover transition-opacity ${locationStatus === 'success' ? 'opacity-100' : 'opacity-10'}`} />

          {/* DENIED OVERLAY */}
          {locationStatus === 'denied' && (
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
              <div className="p-4 bg-red-500/20 rounded-full text-red-500 mb-4 border border-red-500/30">
                <MapPin size={48} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Campus Boundary Error</h2>
              <p className="text-slate-400 text-sm max-w-xs">
                You are approximately <strong>{Math.round(distance)}m</strong> away. You must be within {ALLOWED_RADIUS_METERS}m of the center to check in.
              </p>
              <button onClick={runGeofenceCheck} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all">
                Retry Location Sync
              </button>
            </div>
          )}

          {/* LOADING AI */}
          {locationStatus === 'success' && !modelsLoaded && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
              <p className="font-semibold text-lg">Initializing AI Engines...</p>
            </div>
          )}

          {/* SCANNING & SUCCESS OVERLAYS (Keep these as they were in your code) */}
          {scanStatus === "scanning" && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
            </div>
          )}
          {scanStatus === "success" && (
            <div className="absolute inset-0 bg-green-900/90 backdrop-blur-md z-30 flex flex-col items-center justify-center">
              <CheckCircle2 size={80} className="text-green-400 mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            </div>
          )}
        </div>

        <div className="mt-8 w-full max-w-2xl">
          <button 
            onClick={startBiometricScan}
            disabled={!modelsLoaded || scanStatus !== "idle" || locationStatus !== "success"}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg flex justify-center items-center gap-3 ${
              locationStatus === "success" && modelsLoaded && scanStatus === "idle"
                ? "bg-blue-600 hover:bg-blue-500 text-white" 
                : "bg-slate-800 text-slate-500 cursor-not-allowed"
            }`}
          >
            <ScanFace size={24} /> {locationStatus !== "success" ? "Location Restricted" : "Start Biometric Scan"}
          </button>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `@keyframes scan { 0% { transform: translateY(0); } 50% { transform: translateY(50vh); } 100% { transform: translateY(0); } }`}} />
    </div>
  );
}