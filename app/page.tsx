"use client";

import { useState } from "react";


const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/>
    <line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);

const ImageIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);


interface ShareModalProps {
  onClose: () => void;
}

function ShareModal({ onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const fakeUrl = "https://id-preview-32d89814-4658-4104-8ffd-1538bac0397a.lovable.app";

  const handleCopy = () => {
    navigator.clipboard.writeText(fakeUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-base">Share collection</h2>
            <p className="text-white/40 text-sm mt-0.5">Notes · Jun 13, 2026</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <XIcon />
          </button>
        </div>

        {/* QR placeholder */}
        <div className="bg-white rounded-xl p-4 mb-4 flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified QR-like pattern */}
            <rect width="160" height="160" fill="white"/>
            {/* Corner squares */}
            <rect x="10" y="10" width="40" height="40" fill="black"/><rect x="15" y="15" width="30" height="30" fill="white"/><rect x="20" y="20" width="20" height="20" fill="black"/>
            <rect x="110" y="10" width="40" height="40" fill="black"/><rect x="115" y="15" width="30" height="30" fill="white"/><rect x="120" y="20" width="20" height="20" fill="black"/>
            <rect x="10" y="110" width="40" height="40" fill="black"/><rect x="15" y="115" width="30" height="30" fill="white"/><rect x="20" y="120" width="20" height="20" fill="black"/>
            {/* Data dots */}
            {[60,70,80,90,100].map(x =>
              [10,20,30,40,50,60,70,80,90,100,110,120,130,140].map(y =>
                Math.random() > 0.5 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="black"/> : null
              )
            )}
          </svg>
        </div>

        <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 mb-4">
          <span className="text-white/40 text-xs truncate flex-1 font-mono">{fakeUrl.slice(0, 42)}…</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors shrink-0"
          >
            <CopyIcon />
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-medium rounded-xl py-2.5 transition-colors">
            <DownloadIcon />
            Download QR
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-sm font-medium rounded-xl py-2.5 transition-colors">
            <ShareIcon />
            Share…
          </button>
        </div>
      </div>
    </div>
  );
}


function CollectionCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-[180px] aspect-[3/4] bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-200 hover:scale-[1.02]"
    >
      <div className="absolute inset-0 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
        <ImageIcon />
      </div>
    </button>
  );
}


export default function Home() {
  const [dragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">

      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/70">
            <CameraIcon />
          </div>
          <span className="font-semibold text-white tracking-tight">SnapNotes</span>
        </div>
        <button className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/25 rounded-xl px-4 py-2 transition-all hover:bg-white/5">
          <PlusIcon />
          New collection
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
            Snap notes.{" "}
            <span className="text-white/40">Share in a tap.</span>
          </h1>
          <p className="text-white/40 text-base leading-relaxed">
            Drop in photos of your notes. We give you a beautiful gallery,
            <br className="hidden sm:block" />
            a shareable link, and a QR code — no account needed.
          </p>
        </div>

        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center gap-3 w-full rounded-2xl
            border-2 border-dashed cursor-pointer py-16 transition-all duration-200
            ${dragging
              ? "border-white/40 bg-white/5 scale-[1.01]"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }
          `}
        >
          <input type="file" className="hidden" multiple accept="image/jpeg,image/png,image/heic,image/webp" />
          <div className={`text-white/30 transition-colors ${dragging ? "text-white/60" : ""}`}>
            <UploadIcon />
          </div>
          <div className="text-center">
            <p className="text-white/70 font-medium text-sm">Drop note images here</p>
            <p className="text-white/30 text-xs mt-1">or click to browse — JPG, PNG, HEIC, WebP up to 20MB each</p>
          </div>
        </label>

        <section className="mt-12">
          <div className="mb-4">
            <h2 className="text-white font-semibold text-sm">Your collections</h2>
            <p className="text-white/35 text-xs mt-0.5">Saved on this device. Share the link to give anyone access.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <CollectionCard onClick={() => setShowModal(true)} />
          </div>
        </section>
      </main>

      {showModal && <ShareModal onClose={() => setShowModal(false)} />}
    </div>
  );
}