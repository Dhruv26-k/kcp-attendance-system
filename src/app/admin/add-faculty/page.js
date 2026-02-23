"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Camera, Save, User, Hash, Building, Mail, Phone, 
  CheckCircle2, Shield, UploadCloud, Image as ImageIcon
} from "lucide-react";

export default function AddFaculty() {
  // Capture Mode State ('webcam' or 'upload')
  const [captureMode, setCaptureMode] = useState("webcam");
  
  // Camera & Image States
  const [cameraActive, setCameraActive] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Helper to safely stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Switch between Webcam and Upload modes
  const handleModeSwitch = (mode) => {
    if (mode === "upload" && cameraActive) {
      stopCamera();
    }
    setCaptureMode(mode);
    setFaceCaptured(false);
    setUploadedImage(null);
  };

  // ---------------- WEBCAM LOGIC ----------------
  const startCamera = async () => {
    setCameraActive(true);
    setFaceCaptured(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Please allow webcam access to register faculty face.");
      setCameraActive(false);
    }
  };

  const captureFaceFromWebcam = () => {
    // In the real version, face-api.js runs here to get the descriptor!
    setFaceCaptured(true);
    stopCamera();
  };

  // ---------------- UPLOAD LOGIC ----------------
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the uploaded image
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      
      // In the real version, face-api.js will analyze this uploaded image here!
      setFaceCaptured(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20 relative">
      
      {/* 1. Header */}
      <header className="w-full bg-white px-8 py-3 shadow-sm border-b border-slate-200 flex justify-between items-center z-10">
        <div className="flex items-center">
          <Link href="/">
            <Image 
              src="/Logo.png" 
              alt="Khalsa College Logo" 
              width={400} 
              height={90} 
              className="h-16 w-auto object-contain [clip-path:inset(3px_0_0_0)]"
              priority 
            />
          </Link>
        </div>
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors border border-slate-200 px-4 py-2 rounded-xl bg-slate-50 hover:bg-white">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </header>

      {/* 2. Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Faculty</h1>
          <p className="text-slate-500 text-sm mt-1">Add details and provide a face scan/photo to create a secure profile.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Side: Registration Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal & Professional Details</h2>
            
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Dr. Manjit Singh" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Employee ID</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="KCP-2026-04" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all appearance-none text-slate-600">
                    <option value="">Select Department...</option>
                    <option value="cs">Computer Science</option>
                    <option value="physics">Physics</option>
                    <option value="commerce">Commerce</option>
                    <option value="math">Mathematics</option>
                    <option value="punjabi">Punjabi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="email" placeholder="faculty@khalsacollege.edu.in" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="tel" placeholder="+91 98765 43210" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side: Face Scanner & Upload */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-8 flex flex-col">
            
            {/* Header & Toggle Switch */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">Biometric Data</h2>
              
              {/* Custom Toggle Buttons */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => handleModeSwitch("webcam")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${captureMode === "webcam" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Camera size={14} /> Webcam
                </button>
                <button 
                  onClick={() => handleModeSwitch("upload")}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${captureMode === "upload" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <UploadCloud size={14} /> Upload
                </button>
              </div>
            </div>
            
            {/* Display Viewport */}
            <div className="flex-grow flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 relative overflow-hidden min-h-[250px] mb-6">
              
              {/* Success Overlay (Shows for both WebCam and Upload) */}
              {faceCaptured ? (
                <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center text-green-600 p-6 text-center animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={48} className="mb-3" />
                  <p className="font-bold text-lg">Face Descriptor Extracted!</p>
                  <p className="text-xs text-slate-500 mt-1">Mathematical array ready for MongoDB.</p>
                  <button onClick={() => setFaceCaptured(false)} className="mt-4 text-xs font-semibold text-blue-600 hover:underline">Recapture Data</button>
                </div>
              ) : null}

              {/* WEBCAM UI */}
              {captureMode === "webcam" && (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? "opacity-100" : "opacity-0"}`}
                  />
                  {!cameraActive && (
                    <div className="flex flex-col items-center text-slate-400 z-10 p-6 text-center">
                      <Camera size={40} className="mb-3 opacity-50" />
                      <p className="text-sm font-medium">Camera is offline</p>
                      <p className="text-xs mt-1 max-w-[200px]">Position the faculty member in front of the webcam.</p>
                    </div>
                  )}
                </>
              )}

              {/* UPLOAD UI */}
              {captureMode === "upload" && (
                <>
                  {uploadedImage ? (
                    <Image src={uploadedImage} alt="Uploaded Faculty" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 z-10 p-6 text-center">
                      <ImageIcon size={40} className="mb-3 opacity-50" />
                      <p className="text-sm font-medium">No Image Selected</p>
                      <p className="text-xs mt-1 max-w-[200px]">Upload a clear, forward-facing passport photo.</p>
                    </div>
                  )}
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </>
              )}

            </div>

            {/* Action Buttons (Changes based on mode) */}
            {!faceCaptured && (
              captureMode === "webcam" ? (
                cameraActive ? (
                  <button onClick={captureFaceFromWebcam} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm animate-pulse">
                    <Camera size={18} /> Extract Face Data
                  </button>
                ) : (
                  <button onClick={startCamera} className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 transition-colors flex justify-center items-center gap-2 shadow-sm">
                    <Camera size={18} /> Turn On Webcam
                  </button>
                )
              ) : (
                <button onClick={() => fileInputRef.current.click()} className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 transition-colors flex justify-center items-center gap-2 shadow-sm">
                  <UploadCloud size={18} /> Browse photo
                </button>
              )
            )}
          </div>

        </div>

        {/* Global Submit Button */}
        <div className="mt-8 flex justify-end mb-10">
          <button 
            disabled={!faceCaptured} 
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md ${faceCaptured ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
          >
            <Save size={18} /> Complete Registration & Save to DB
          </button>
        </div>

      </main>

      {/* Footer */}
      <div className="absolute bottom-4 w-full px-8 flex justify-between items-center text-[11px] md:text-xs text-slate-400 font-medium">
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