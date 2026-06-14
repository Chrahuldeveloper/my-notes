"use client";

import { useEffect } from "react";

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

interface ImagePreviewProps {
  url: string;
  onClose: () => void;
}

export default function ImagePreview({ url, onClose }: ImagePreviewProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-6 animate-in fade-in duration-200"
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-end gap-2 p-4 z-10">
        <a
          href={url}
          download
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl px-3.5 py-2 transition-colors"
        >
          <DownloadIcon />
          Download
        </a>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl p-2 transition-colors"
        >
          <XIcon />
        </button>
      </div>

      <img
        src={url}
        alt="Note preview"
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
      />
    </div>
  );
}