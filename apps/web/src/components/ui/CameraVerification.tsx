'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  CheckCircle, 
  XCircle,
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Scan, 
  Sparkles, 
  Smartphone,
  CheckCheck,
  ShieldAlert,
  ArrowRight,
  Eye,
  Sliders,
  Info
} from 'lucide-react';

export interface VerificationResult {
  verified: boolean;
  confidenceScore: number;
  auditId: string;
  detectedObject: string;
  timestamp?: string;
  inspectionChecks: { check: string; status: string; details: string }[];
  aiExplanation?: string;
  rejectionCode?: string;
  errorTitle?: string;
  errorMessage?: string;
  snapshotUrl?: string;
}

export interface CameraVerificationProps {
  productTitle: string;
  category: string;
  description: string;
  condition?: string;
  onVerificationComplete: (result: VerificationResult) => void;
  onVerificationReset?: () => void;
}

export default function CameraVerification({
  productTitle,
  category,
  description,
  condition = 'Used - Like New',
  onVerificationComplete,
  onVerificationReset,
}: CameraVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not available in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      setCameraError('Webcam feed unavailable. You can still test anti-spoofing and product matching using the interactive simulator below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreamActive(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureFrame = (): string => {
    if (videoRef.current && canvasRef.current && streamActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.85);
      }
    }

    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="%23002f34"/><text x="50%" y="50%" fill="white" font-size="20" text-anchor="middle">Live Frame Snapshot</text></svg>';
  };

  const runVerification = async (selectedScenario: 'live_webcam' | 'screen_spoof' | 'mismatch_item' | 'legit_match') => {
    setIsAnalyzing(true);
    setVerificationResult(null);

    const frameBase64 = captureFrame();

    try {
      // Step 1: Anti-Screen & Bezel Spoof Detection
      setAnalysisStep('1/3. Scanning for phone bezels, screen glare & digital photo spoofs...');
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: 3D Object Recognition
      setAnalysisStep('2/3. Classifying physical object & computing 3D depth volume...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 3: Product Mentioned vs Product Shown matching
      setAnalysisStep(`3/3. Verifying if camera object matches declared ad: "${(productTitle || 'Product').slice(0, 30)}"...`);
      await new Promise((r) => setTimeout(r, 600));

      const res = await fetch('/api/verify-camera', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: frameBase64,
          title: productTitle || 'Physical Item',
          category: category || 'mobiles',
          description: description || 'Physical product listing',
          condition,
          testScenario: selectedScenario,
        }),
      });

      const data: VerificationResult = await res.json();
      setVerificationResult(data);

      if (data.verified) {
        onVerificationComplete(data);
      } else if (onVerificationReset) {
        onVerificationReset();
      }
    } catch (err: any) {
      setCameraError(err.message || 'Verification connection failed.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm space-y-0">
      
      {/* ─── Header Banner ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#002f34] via-[#003e45] to-teal-950 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#ffce32] shrink-0 border border-white/20 shadow-inner">
            <Scan size={26} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-black text-lg tracking-tight">AI Physical Camera Verification</h3>
              <span className="bg-[#ffce32] text-[#002f34] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Anti-Spoof Defense Active
              </span>
            </div>
            <p className="text-xs text-teal-100 mt-1 max-w-xl leading-relaxed">
              <strong>Mandatory Rules:</strong> (1) The camera must show the <strong>exact product mentioned</strong> in your listing. 
              (2) You <strong>cannot show a photo on another phone</strong> or screen. Only real physical goods in hand are verified.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI ENGINE ONLINE</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ─── REJECTION ALERT (Screen Spoof or Product Mismatch) ─── */}
        {verificationResult && !verificationResult.verified && (
          <div className="bg-red-50/90 border-2 border-red-500 rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200 shadow-sm">
                  {verificationResult.rejectionCode === 'SCREEN_SPOOF_DETECTED' ? (
                    <Smartphone size={32} className="stroke-[2.5]" />
                  ) : (
                    <XCircle size={32} className="stroke-[2.5]" />
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-lg text-red-950">
                      {verificationResult.errorTitle || 'Verification Rejected'}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Badge Denied
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-900 font-medium leading-relaxed max-w-2xl">
                    {verificationResult.errorMessage}
                  </p>
                  {verificationResult.detectedObject && (
                    <div className="pt-1 text-xs text-red-800">
                      <span className="font-bold text-red-950">AI Detected in Camera:</span>{' '}
                      <code className="bg-red-100 px-2 py-0.5 rounded text-xs font-mono font-bold text-red-900">
                        {verificationResult.detectedObject}
                      </code>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerificationResult(null)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm uppercase tracking-wider"
              >
                <RefreshCw size={14} />
                <span>Retry Scan</span>
              </button>
            </div>

            {/* Checklist details showing why it failed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-3 border-t border-red-200/80">
              {verificationResult.inspectionChecks.map((chk, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/90 p-3 rounded-xl border border-red-200 shadow-2xs">
                  {chk.status === 'Passed' ? (
                    <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold text-gray-900">{chk.check}:</span>{' '}
                    <span className={chk.status === 'Passed' ? 'text-emerald-800 font-medium' : 'text-red-700 font-semibold'}>
                      {chk.details}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety policy warning */}
            <div className="bg-white p-3.5 rounded-xl border border-red-200 text-xs text-red-900 flex items-center gap-2.5">
              <ShieldAlert size={18} className="text-red-600 shrink-0" />
              <span>
                <strong>Fraud Prevention Rule:</strong> Sellers cannot verify an ad by displaying photos on a phone screen or holding an unrelated object. You must show the physical item declared in your ad.
              </span>
            </div>
          </div>
        )}

        {/* ─── SUCCESS BANNER (Real Physical Match Approved) ──────── */}
        {verificationResult && verificationResult.verified && (
          <div className="bg-emerald-50/90 border-2 border-emerald-500 rounded-2xl p-5 sm:p-6 space-y-5 animate-in fade-in duration-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
                  <CheckCircle size={32} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-lg text-emerald-950">
                      Physical Product Authenticated &amp; Verified!
                    </span>
                    <span className="bg-emerald-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                      {verificationResult.confidenceScore}% Match
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900">
                    Detected: <span className="font-bold">{verificationResult.detectedObject}</span> &bull; Audit ID: <code className="bg-emerald-100 px-1.5 py-0.5 rounded text-xs font-mono font-bold text-emerald-900">{verificationResult.auditId}</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerificationResult(null)}
                className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <RefreshCw size={13} />
                <span>Re-scan Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-3 border-t border-emerald-200">
              {verificationResult.inspectionChecks.map((chk, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/90 p-3 rounded-xl border border-emerald-200 shadow-2xs">
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-950">{chk.check}:</span>{' '}
                    <span className="text-emerald-800 text-xs font-medium">{chk.details}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-emerald-950 bg-white p-3.5 rounded-xl border border-emerald-200 italic font-medium leading-relaxed">
              &ldquo;{verificationResult.aiExplanation}&rdquo;
            </div>
          </div>
        )}

        {/* ─── Live Camera Viewfinder & HUD ───────────────────────── */}
        {!verificationResult && (
          <div className="space-y-5">
            <div className="relative aspect-video max-w-xl mx-auto rounded-2xl overflow-hidden bg-black border-2 border-[#002f34] shadow-2xl flex items-center justify-center">
              
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${streamActive ? 'block' : 'hidden'}`}
              />

              {!streamActive && (
                <div className="text-center p-6 text-gray-300 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-gray-400 border border-white/10">
                    <Camera size={32} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white">Live Camera Viewfinder</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                      Hold the actual physical product in front of the camera lens.
                    </p>
                  </div>
                </div>
              )}

              {/* HUD Reticle Overlay */}
              <div className="absolute inset-0 pointer-events-none p-4 sm:p-5 flex flex-col justify-between select-none">
                <div className="flex items-center justify-between text-[11px] text-white/90 font-mono">
                  <span className="bg-black/75 px-3 py-1 rounded-md backdrop-blur-md flex items-center gap-2 border border-white/10">
                    <span className={`w-2 h-2 rounded-full ${streamActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span>{streamActive ? 'ANTI-SPOOF HUD ACTIVE' : 'CAMERA STANDBY'}</span>
                  </span>
                  <span className="bg-black/75 px-3 py-1 rounded-md backdrop-blur-md border border-white/10 uppercase">
                    TARGET: {category}
                  </span>
                </div>

                {/* Center Target Reticle */}
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto border-2 border-teal-400/60 rounded-xl flex items-center justify-center">
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#ffce32]" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#ffce32]" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#ffce32]" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#ffce32]" />

                  {/* Laser Scanning Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#23e5db] to-transparent shadow-[0_0_12px_#23e5db] animate-scanline" />

                  <span className="text-[10px] uppercase font-mono text-white/80 tracking-widest bg-black/60 px-2.5 py-1 rounded border border-white/10 backdrop-blur-xs">
                    Show Physical Item
                  </span>
                </div>

                {/* Bottom HUD warning pill */}
                <div className="text-center">
                  <span className="bg-black/85 text-amber-300 text-[11px] font-semibold px-4 py-1.5 rounded-full backdrop-blur-md border border-amber-400/40 shadow-lg inline-flex items-center gap-1.5">
                    <span>⚠️</span>
                    <span>Displaying photos on phone screens is strictly rejected by AI</span>
                  </span>
                </div>
              </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />

            {/* Analysis in Progress */}
            {isAnalyzing && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center space-y-2 animate-pulse shadow-sm">
                <div className="flex items-center justify-center gap-2 text-teal-900 font-bold text-xs sm:text-sm">
                  <RefreshCw size={16} className="animate-spin text-teal-600" />
                  <span>{analysisStep}</span>
                </div>
                <div className="w-full bg-teal-200/80 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full w-4/5 animate-pulse" />
                </div>
              </div>
            )}

            {/* ─── Live Camera Scan Button ──────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={() => runVerification('live_webcam')}
                className="w-full sm:w-auto bg-[#002f34] hover:bg-[#001e21] text-white font-black text-sm px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wider active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={18} className="text-[#ffce32]" />
                <span>{isAnalyzing ? 'Inspecting Live Item...' : 'Scan & Verify with Camera AI'}</span>
              </button>

              {!streamActive && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-[#002f34] text-[#002f34] font-bold text-xs px-5 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Camera size={16} />
                  <span>Activate Camera Feed</span>
                </button>
              )}
            </div>

            {/* ─── Interactive Anti-Fraud Test Simulator ─────────────── */}
            <div className="border border-dashed border-gray-300 bg-gray-50/90 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-xs font-black uppercase tracking-wider text-[#002f34] flex items-center gap-2">
                  <ShieldAlert size={16} className="text-amber-600" />
                  <span>Interactive Verification Simulator</span>
                </p>
                <span className="text-[11px] text-gray-500 font-medium">
                  Test system rules and anti-spoof defenses instantly
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Fraud Test 1: Phone Photo Spoof */}
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runVerification('screen_spoof')}
                  className="p-3.5 bg-white hover:bg-red-50/80 border border-gray-200 hover:border-red-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-red-600 text-xs font-black mb-1.5">
                    <Smartphone size={15} />
                    <span>1. Test Phone Screen Spoof</span>
                  </div>
                  <p className="text-[11px] text-gray-600 group-hover:text-red-950 leading-relaxed">
                    User holds another phone displaying a downloaded photo of the item (e.g., bike picture on phone).
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                    Result: MUST REJECT ❌
                  </span>
                </button>

                {/* Fraud Test 2: Mismatch Item */}
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runVerification('mismatch_item')}
                  className="p-3.5 bg-white hover:bg-amber-50/80 border border-gray-200 hover:border-amber-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs font-black mb-1.5">
                    <AlertTriangle size={15} />
                    <span>2. Test Wrong Product Mismatch</span>
                  </div>
                  <p className="text-[11px] text-gray-600 group-hover:text-amber-950 leading-relaxed">
                    User holds an unrelated object (e.g., shoe or coffee mug when ad declares iPhone or bike).
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    Result: MUST REJECT ❌
                  </span>
                </button>

                {/* Valid Test: Real Physical Item */}
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runVerification('legit_match')}
                  className="p-3.5 bg-white hover:bg-emerald-50/80 border border-gray-200 hover:border-emerald-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-black mb-1.5">
                    <CheckCheck size={15} />
                    <span>3. Test Real Physical Match</span>
                  </div>
                  <p className="text-[11px] text-gray-600 group-hover:text-emerald-950 leading-relaxed">
                    User is in genuine physical possession of the product matching the ad title and category.
                  </p>
                  <span className="inline-block mt-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Result: VERIFY &amp; PASS ✅
                  </span>
                </button>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
