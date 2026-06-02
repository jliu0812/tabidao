"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateItineraryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/itinerary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title.trim(), destination: destination.trim() || null }),
    });

    if (res.ok) {
      const { id } = await res.json();
      router.push(`/itinerary/${id}`);
    } else {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
      >
        + New Itinerary
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 w-full max-w-sm"
    >
      <h2 className="font-medium text-sm">New Itinerary</h2>
      <input
        type="text"
        placeholder="Title (e.g. Tokyo 2025)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
        className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
      />
      <input
        type="text"
        placeholder="Destination (optional)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="flex-1 rounded-md bg-gray-900 px-3 py-2 text-sm text-white disabled:opacity-50 hover:bg-gray-700 transition-colors"
        >
          {loading ? "Creating…" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
