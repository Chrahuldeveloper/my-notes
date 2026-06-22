"use client";

import { useEffect, useState } from "react";
import { X, Copy, Download, Share2, Image, Folder, Plus, ArrowLeft, Upload } from "lucide-react";
import CollectionModel from "./components/CollectionModel";
import ImagePreview from "./components/ImagePreview";
import { db } from '../Firebase'
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";



const Spinner = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={`animate-spin ${className}`}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

const SkeletonCard = () => (
  <div className="w-[160px] aspect-[3/4] bg-[#161616] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col animate-pulse">
    <div className="flex-1 bg-white/[0.04]" />
    <div className="px-3 py-2.5 border-t border-white/[0.06]">
      <div className="h-2.5 w-3/4 bg-white/[0.07] rounded-full" />
    </div>
  </div>
);


interface Folder {
  id: string;
  name: string;
  images: string[];
}

interface CollectionEntry {
  id: string;
  name: string;
  notesImages: string[];
  folders: Folder[];
}


function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const fakeUrl = "https://id-preview-32d89814-4658-4104-8ffd-1538bac0397a.lovable.app";
  const handleCopy = () => {
    navigator.clipboard.writeText(fakeUrl).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold text-base">Share collection</h2>
            <p className="text-white/35 text-xs mt-0.5">Notes · Jun 13, 2026</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <X size={14} />
          </button>
        </div>
        <div className="bg-white rounded-xl p-5 mb-4 flex items-center justify-center">
          <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
            <rect width="160" height="160" fill="white" />
            <rect x="10" y="10" width="40" height="40" fill="black" /><rect x="15" y="15" width="30" height="30" fill="white" /><rect x="20" y="20" width="20" height="20" fill="black" />
            <rect x="110" y="10" width="40" height="40" fill="black" /><rect x="115" y="15" width="30" height="30" fill="white" /><rect x="120" y="20" width="20" height="20" fill="black" />
            <rect x="10" y="110" width="40" height="40" fill="black" /><rect x="15" y="115" width="30" height="30" fill="white" /><rect x="20" y="120" width="20" height="20" fill="black" />
          </svg>
        </div>
        <div className="flex items-center gap-2 bg-[#111] border border-white/[0.08] rounded-xl px-3 py-2.5 mb-4">
          <span className="text-white/35 text-xs truncate flex-1 font-mono">{fakeUrl.slice(0, 42)}…</span>
          <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors shrink-0">
            <Copy size={13} />{copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="flex gap-2.5">
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 text-xs font-medium rounded-xl py-2.5 transition-colors">
            <Download size={13} />Download QR
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/70 text-xs font-medium rounded-xl py-2.5 transition-colors">
            <Share2 size={13} />Share…
          </button>
        </div>
      </div>
    </div>
  );
}


function NewFolderModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-xs shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-sm">New folder</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={14} />
          </button>
        </div>
        <input
          autoFocus
          type="text"
          placeholder="Folder name…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); onClose(); } }}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/25 outline-none focus:border-white/25 mb-4"
        />
        <button
          disabled={!name.trim()}
          onClick={() => { if (name.trim()) { onCreate(name.trim()); onClose(); } }}
          className="w-full bg-white text-black text-xs font-semibold rounded-xl py-2.5 hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Create folder
        </button>
      </div>
    </div>
  );
}


function CollectionCard({ name, thumbnail, onClick }: { name: string; thumbnail?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-[160px] aspect-[3/4] bg-[#161616] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-200 hover:scale-[1.02] flex flex-col"
    >
      <div className="flex-1 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15 group-hover:text-white/30 transition-colors">
            <Image size={28} />
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 border-t border-white/[0.06] text-left bg-[#161616]">
        <p className="text-white/60 text-xs font-medium truncate">{name}</p>
      </div>
    </button>
  );
}

function FolderCard({ folder, onClick }: { folder: Folder; onClick: () => void }) {
  const thumb = folder.images[0];
  return (
    <button
      onClick={onClick}
      className="group relative w-[160px] aspect-[3/4] bg-[#161616] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-200 hover:scale-[1.02] flex flex-col"
    >
      <div className="flex-1 overflow-hidden relative">
        {thumb ? (
          <img src={thumb} alt={folder.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/15 group-hover:text-white/30 transition-colors">
            <Folder size={28} />
          </div>
        )}
        {folder.images.length > 0 && (
          <span className="absolute top-2 right-2 bg-black/60 text-white/70 text-[10px] font-medium px-1.5 py-0.5 rounded-full backdrop-blur-sm">
            {folder.images.length}
          </span>
        )}
      </div>
      <div className="px-3 py-2.5 border-t border-white/[0.06] text-left bg-[#161616] flex items-center gap-1.5">
        <span className="text-white/30"><Folder size={14} /></span>
        <p className="text-white/60 text-xs font-medium truncate">{folder.name}</p>
      </div>
    </button>
  );
}

function UploadingPill({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 bg-[#1f1f1f] border border-white/10 rounded-full px-4 py-2.5 shadow-xl">
      <Spinner size={14} className="text-white/60" />
      <span className="text-white/70 text-xs font-medium">
        Uploading {count} {count === 1 ? "image" : "images"}…
      </span>
    </div>
  );
}


export default function Home() {
  const [toggleCollection, settoggleCollection] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [collections, setCollections] = useState<CollectionEntry[]>([]);
  const [activeCollection, setActiveCollection] = useState<CollectionEntry | null>(null);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);

  const [loadingCollections, setLoadingCollections] = useState(true);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const code = process.env.NEXT_PUBLIC_PASS;

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    Array.from(e.dataTransfer.files).forEach(uploadImage);
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!activeCollection || !activeFolder) return;
    const pass = prompt("Please enter pass: ");
    if (pass !== code) return;

    setUploadingCount(c => c + 1);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const fileBase64 = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileBase64 }),
        });
        const data = await res.json();
        if (!data.url) return;

        const colRef = doc(db, "users", activeCollection.id);

        const updatedFolders = activeCollection.folders.map(f =>
          f.id === activeFolder.id
            ? { ...f, images: [...f.images, data.url] }
            : f
        );

        await updateDoc(colRef, { folders: updatedFolders });

        setCollections(prev =>
          prev.map(col =>
            col.id === activeCollection.id ? { ...col, folders: updatedFolders } : col
          )
        );
        setActiveCollection(prev => prev ? { ...prev, folders: updatedFolders } : prev);
        setActiveFolder(prev => prev ? { ...prev, images: [...prev.images, data.url] } : prev);
      } finally {
        setUploadingCount(c => c - 1);
      }
    };
  };

  const handleCreateCollection = async (name: string) => {
    const pass = prompt("Please enter pass: ");
    if (pass !== code) { alert("Wrong password"); return; }
    try {
      const docRef = await addDoc(collection(db, "users"), { name, notesImages: [], folders: [] });
      const newEntry: CollectionEntry = { id: docRef.id, name, notesImages: [], folders: [] };
      setCollections(prev => [...prev, newEntry]);
      setActiveCollection(newEntry);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!activeCollection) return;
    const pass = prompt("Please enter pass: ");
    if (pass !== code) { alert("Wrong password"); return; }

    const newFolder: Folder = { id: crypto.randomUUID(), name, images: [] };
    const updatedFolders = [...activeCollection.folders, newFolder];

    try {
      await updateDoc(doc(db, "users", activeCollection.id), { folders: updatedFolders });
      setCollections(prev =>
        prev.map(col => col.id === activeCollection.id ? { ...col, folders: updatedFolders } : col)
      );
      setActiveCollection(prev => prev ? { ...prev, folders: updatedFolders } : prev);
    } catch (e) {
      console.error("Error creating folder: ", e);
    }
  };

  useEffect(() => { fetchCollections(); }, []);

  const fetchCollections = async () => {
    setLoadingCollections(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const fetched: CollectionEntry[] = snapshot.docs.map(d => ({
        id: d.id,
        name: d.data().name,
        notesImages: d.data().notesImages ?? [],
        folders: d.data().folders ?? [],
      }));
      setCollections(fetched);
    } catch (e) {
      console.error("Error fetching collections: ", e);
    } finally {
      setLoadingCollections(false);
    }
  };

  const level = activeFolder ? 2 : activeCollection ? 1 : 0;

  const goBack = () => {
    if (level === 2) { setActiveFolder(null); }
    else if (level === 1) { setActiveCollection(null); }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans">

      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] sticky top-0 bg-[#0d0d0d]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          {level > 0 && (
            <button onClick={goBack} className="mr-1 text-white/30 hover:text-white/70 transition-colors p-1">
              <ArrowLeft size={16} />
            </button>
          )}
          <span className="font-semibold text-white text-sm tracking-tight">MyNotes</span>
          {activeCollection && (
            <>
              <span className="text-white/20 text-sm">/</span>
              <button
                onClick={() => { if (level === 2) setActiveFolder(null); }}
                className={`text-sm truncate max-w-[120px] transition-colors ${level === 2 ? "text-white/40 hover:text-white/60" : "text-white/50"}`}
              >
                {activeCollection.name}
              </button>
            </>
          )}
          {activeFolder && (
            <>
              <span className="text-white/20 text-sm">/</span>
              <span className="text-white/50 text-sm truncate max-w-[120px]">{activeFolder.name}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {level === 1 && (
            <button
              onClick={() => setShowNewFolder(true)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-xl px-3.5 py-2 transition-all hover:bg-white/5"
            >
              <Plus size={13} />
              New folder
            </button>
          )}
          <button
            onClick={() => settoggleCollection(true)}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded-xl px-3.5 py-2 transition-all hover:bg-white/5"
          >
            <Plus size={13} />
            New collection
          </button>
        </div>
      </nav>

      {preview && <ImagePreview url={previewUrl} onClose={() => setPreview(false)} />}

      <main className="max-w-3xl mx-auto px-4 pt-12 pb-24">

        {level === 0 && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
                Capture notes
                <span className="text-white/30"> visually.
                  Keep them organized, instantly.</span>
              </h1>
              <p className="text-white/35 text-sm leading-relaxed">
                Upload photos of your notes and organize them into collections.
                <br className="hidden sm:block" />
                A shareable link, and a QR code — no account needed.
              </p>
            </div>

            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white/80 font-medium text-sm">Your collections</h2>
                  <p className="text-white/30 text-xs mt-0.5">Click a collection to open it.</p>
                </div>
                {loadingCollections && <Spinner size={14} className="text-white/25" />}
              </div>

              <div className="flex flex-wrap gap-4">
                {loadingCollections && [0, 1, 2].map(i => <SkeletonCard key={i} />)}

                {!loadingCollections && collections.map(col => {
                  const thumb = col.folders[0]?.images[0] ?? col.notesImages[0];
                  return (
                    <CollectionCard key={col.id} name={col.name} thumbnail={thumb} onClick={() => setActiveCollection(col)} />
                  );
                })}

                {!loadingCollections && collections.length === 0 && (
                  <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.06] rounded-2xl">
                    <div className="text-white/15 mb-3"><Image size={28} /></div>
                    <p className="text-white/25 text-xs">No collections yet</p>
                    <button
                      onClick={() => settoggleCollection(true)}
                      className="mt-3 text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
                    >
                      Create your first one
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {level === 1 && activeCollection && (
          <div>
            <div className="flex flex-wrap gap-4">
              {activeCollection.folders.length === 0 && (
                <div className="w-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-white/[0.06] rounded-2xl">
                  <div className="text-white/15 mb-3"><Folder size={28} /></div>
                  <p className="text-white/25 text-xs">No folders yet</p>
                  <button
                    onClick={() => setShowNewFolder(true)}
                    className="mt-3 text-xs text-white/40 hover:text-white/70 underline underline-offset-2 transition-colors"
                  >
                    Create your first folder
                  </button>
                </div>
              )}

              {activeCollection.folders.map(folder => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => setActiveFolder(folder)}
                />
              ))}
            </div>
          </div>
        )}

        {level === 2 && activeFolder && (
          <div>
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center gap-2.5 w-full rounded-2xl
                border-2 border-dashed cursor-pointer py-10 mb-8 transition-all duration-200
                ${dragging ? "border-white/30 bg-white/5 scale-[1.01]" : "border-white/[0.08] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]"}
                ${uploadingCount > 0 ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/jpeg,image/png,image/heic,image/webp"
                onChange={handleFileChange}
              />
              <div className={`transition-colors ${dragging ? "text-white/50" : "text-white/20"}`}>
                {uploadingCount > 0 ? <Spinner size={28} className="text-white/30" /> : <Upload size={28} />}
              </div>
              <div className="text-center">
                <p className="text-white/50 font-medium text-xs">
                  {uploadingCount > 0 ? `Uploading ${uploadingCount} ${uploadingCount === 1 ? "image" : "images"}…` : "Drop images here or click to browse"}
                </p>
                <p className="text-white/20 text-xs mt-0.5">JPG, PNG, HEIC, WebP · up to 20MB each</p>
              </div>
            </label>

            {activeFolder.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeFolder.images.map((url, i) => (
                  <div
                    key={i}
                    onClick={() => { setPreviewUrl(url); setPreview(true); }}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#161616] border border-white/[0.07] group cursor-pointer"
                  >
                    {!loadedImages[url] && (
                      <div className="absolute inset-0 bg-[#161616] animate-pulse flex items-center justify-center">
                        <div className="text-white/10"><Image size={28} /></div>
                      </div>
                    )}
                    <img
                      src={url}
                      alt={`Note ${i + 1}`}
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [url]: true }))}
                      className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] ${loadedImages[url] ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                ))}

                {uploadingCount > 0 && Array.from({ length: uploadingCount }).map((_, i) => (
                  <div key={`uploading-${i}`} className="aspect-[3/4] rounded-xl bg-[#161616] border border-white/[0.07] animate-pulse flex flex-col items-center justify-center gap-2">
                    <Spinner size={18} className="text-white/25" />
                    <span className="text-white/20 text-[10px]">Uploading…</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                {uploadingCount > 0 ? (
                  <div className="flex flex-col items-center gap-3">
                    <Spinner size={22} className="text-white/30" />
                    <p className="text-white/30 text-xs">Uploading your images…</p>
                  </div>
                ) : (
                  <p className="text-white/20 text-xs">No images yet — upload some above</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <UploadingPill count={uploadingCount} />

      {toggleCollection && (
        <CollectionModel
          onClose={() => settoggleCollection(false)}
          onCreate={(name) => { handleCreateCollection(name); settoggleCollection(false); }}
        />
      )}

      {showNewFolder && (
        <NewFolderModal
          onClose={() => setShowNewFolder(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {showModal && <ShareModal onClose={() => setShowModal(false)} />}
    </div>
  );
}