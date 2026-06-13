import  { useState } from "react";

interface NewCollectionModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CollectionModel({ onClose, onCreate }: NewCollectionModalProps) {
  const [name, setName] = useState("");


  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-white font-semibold text-base">New collection</h2>
        </div>

        <div className="mb-6">
          <label className="text-white/40 text-xs font-medium mb-2 block uppercase tracking-wider">
            Collection name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Maths Chapter 4"
            className="w-full bg-[#111] border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 outline-none transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-sm font-medium rounded-xl py-2.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 bg-white text-black text-sm font-semibold rounded-xl py-2.5 transition-opacity disabled:opacity-30 hover:opacity-90"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}