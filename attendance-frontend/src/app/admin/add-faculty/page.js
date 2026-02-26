"use client";

import { useState, useRef, useEffect } from "react";
// ❌ REMOVED the global faceapi import from here!
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Camera, Save, User, Hash, Building, Mail, Phone, 
  CheckCircle2, Shield, UploadCloud, Image as ImageIcon
} from "lucide-react";

export default function AddFaculty() {
  // --- Tracking the Form Data ---
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Capture Mode & Camera States ---
  const [captureMode, setCaptureMode] = useState("webcam");
  const [cameraActive, setCameraActive] = useState(false);
  const [faceCaptured, setFaceCaptured] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // --- AI States ---
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDescriptor, setFaceDescriptor] = useState(null);

  // --- Refs ---
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- Check if form is unlocked ---
  const isFormComplete = 
    formData.name !== "" &&
    formData.employeeId !== "" &&
    formData.department !== "" &&
    formData.email !== "" &&
    formData.phone !== "" &&
    faceCaptured === true &&
    faceDescriptor !== null;

  // --- LOAD AI MODELS ON PAGE LOAD ---
  useEffect(() => {
    const loadModels = async () => {
      // ✅ DYNAMIC IMPORT: Only loads in the browser!
      const faceapi = await import('@vladmandic/face-api');
      
      const MODEL_URL = '/models'; 
      try {
        await faceapi.tf.setBackend('webgl'); 
        await faceapi.tf.ready(); 

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log("✅ AI Face Models Loaded successfully!");
      } catch (err) {
        console.error("❌ Error loading AI models:", err);
      }
    };
    loadModels();
  }, []);

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
    setFaceDescriptor(null);
    setUploadedImage(null);
  };

  // ---------------- WEBCAM LOGIC ----------------
  const startCamera = async () => {
    setCameraActive(true);
    setFaceCaptured(false);
    setFaceDescriptor(null);
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

  const captureFaceFromWebcam = async () => {
    if (!videoRef.current) return;
    
    // ✅ DYNAMIC IMPORT
    const faceapi = await import('@vladmandic/face-api');
    
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      const descriptorArray = Array.from(detection.descriptor);
      setFaceDescriptor(descriptorArray);
      setFaceCaptured(true);
      stopCamera();
    } else {
      alert("❌ No face detected! Please look directly at the camera with good lighting.");
    }
  };

  // ---------------- UPLOAD LOGIC ----------------
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);

      const img = document.createElement('img');
      img.src = imageUrl;
      
      img.onload = async () => {
        // ✅ DYNAMIC IMPORT
        const faceapi = await import('@vladmandic/face-api');
        
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          const descriptorArray = Array.from(detection.descriptor);
          setFaceDescriptor(descriptorArray);
          setFaceCaptured(true);
        } else {
          alert("❌ No face detected in this photo. Please upload a clear, forward-facing image.");
          setUploadedImage(null);
        }
      };
    }
  };

  // --- Sending Data to the Backend ---
  const handleSaveToDB = async () => {
    setIsSubmitting(true);

    try {
      // 1. Temporary Bypass so you can test it locally without your friend's backend running!
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("🚀 READY TO SEND THIS MATH TO DATABASE:");
      console.log({
        name: formData.name,
        employeeId: formData.employeeId,
        faceDescriptor: faceDescriptor // The massive array of AI math
      });

      alert(`✅ Success! ${formData.name}'s face was mapped by the AI.`);
      
      setFormData({ name: "", employeeId: "", department: "", email: "", phone: "" });
      setFaceCaptured(false);
      setFaceDescriptor(null);
      setUploadedImage(null);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans text-slate-800 pb-20 relative">
      
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-8">
        
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Faculty</h1>
            <p className="text-slate-500 text-sm mt-1">Add details and provide a face scan/photo to create a secure profile.</p>
          </div>
          {/* AI Status Indicator */}
          <div className="text-xs font-semibold px-3 py-1.5 rounded-full border bg-white shadow-sm">
            {modelsLoaded ? (
              <span className="text-green-600 flex items-center gap-1">● AI Engine Ready</span>
            ) : (
              <span className="text-amber-500 flex items-center gap-1 animate-pulse">● Loading AI Engine...</span>
            )}
          </div>
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
                    <input 
                      type="text" 
                      placeholder="Dr. Manjit Singh" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Employee ID</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="KCP-2026-04" 
                      value={formData.employeeId}
                      onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Department</label>
                <div className="relative">
                  <Building size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all appearance-none text-slate-600"
                  >
                    <option value="">Select Department...</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      placeholder="faculty@khalsacollege.edu.in" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all" 
                    />
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
              
              {/* Success Overlay */}
              {faceCaptured ? (
                <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center text-green-600 p-6 text-center animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 size={48} className="mb-3" />
                  <p className="font-bold text-lg">Face Data Mapped!</p>
                  <p className="text-xs text-slate-500 mt-1">128-point math array generated.</p>
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
                      <p className="text-xs mt-1 max-w-[200px]">Upload a clear, forward-facing photo.</p>
                    </div>
                  )}
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

            {/* Action Buttons */}
            {!faceCaptured && (
              captureMode === "webcam" ? (
                cameraActive ? (
                  <button 
                    onClick={captureFaceFromWebcam} 
                    disabled={!modelsLoaded}
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex justify-center items-center gap-2 shadow-sm"
                  >
                    <Camera size={18} /> {modelsLoaded ? "Capture & Map Face" : "Loading AI..."}
                  </button>
                ) : (
                  <button onClick={startCamera} className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 transition-colors flex justify-center items-center gap-2 shadow-sm">
                    <Camera size={18} /> Turn On Webcam
                  </button>
                )
              ) : (
                <button 
                  onClick={() => fileInputRef.current.click()} 
                  disabled={!modelsLoaded}
                  className="w-full bg-slate-800 text-white font-semibold py-3 rounded-xl hover:bg-slate-900 disabled:bg-slate-400 transition-colors flex justify-center items-center gap-2 shadow-sm"
                >
                  <UploadCloud size={18} /> {modelsLoaded ? "Browse photo" : "Loading AI..."}
                </button>
              )
            )}
          </div>
        </div>

        {/* Global Submit Button */}
        <div className="mt-8 flex justify-end mb-10">
          <button 
            onClick={handleSaveToDB}
            disabled={!isFormComplete || isSubmitting} 
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md ${
              isFormComplete && !isSubmitting
                ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Save size={18} /> 
            {isSubmitting ? "Saving to Database..." : "Complete Registration & Save to DB"}
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