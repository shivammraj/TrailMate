'use client';

import React, { useRef, useState, useEffect } from 'react';

export default function CameraCapture({ onCapture, onError }: { onCapture: (file: File) => void, onError: (err: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        onError('Camera not available or permission denied.');
      }
    }
    setupCamera();

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onCapture(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden border-2 border-white/10">
        {stream ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-500">
            Camera unavailable
          </div>
        )}
        
        {/* Reticle UI */}
        <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/50 rounded-lg pointer-events-none" />
      </div>

      <div className="flex gap-4 w-full mt-4">
        <button 
          onClick={takePhoto}
          className="flex-1 py-4 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform"
        >
          📷 Take Photo
        </button>
        <label className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-center cursor-pointer active:scale-95 transition-transform">
          📁 Upload
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>
    </div>
  );
}
