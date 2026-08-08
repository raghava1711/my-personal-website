"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatBytes, formatDate } from "@/lib/utils";

type Folder = { id: string; name: string };
type DocumentItem = { id: string; name: string; originalName: string; extension: string; mimeType: string; sizeBytes: number; folderId: string | null; createdAt: string; isResume: boolean };

export function DocumentsManager() {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [storage, setStorage] = useState({ usedBytes: 0, limitBytes: 10 * 1024 * 1024 * 1024 });
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState("Loading documents...");

  async function load() {
    const response = await fetch("/api/documents");
    if (response.ok) {
      const data = (await response.json()) as { items: DocumentItem[]; folders: Folder[]; storage: typeof storage };
      setItems(data.items || []);
      setFolders(data.folders || []);
      setStorage(data.storage || storage);
      setStatus("");
    } else setStatus("Unable to load documents.");
  }
  useEffect(() => { void load(); }, []);

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Uploading...");
    const response = await fetch("/api/documents", { method: "POST", body: new FormData(event.currentTarget) });
    if (response.ok) {
      event.currentTarget.reset();
      await load();
    } else {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(data.error || "Upload failed.");
    }
  }

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/documents", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name") }) });
    if (response.ok) {
      event.currentTarget.reset();
      await load();
    }
  }

  async function rename(doc: DocumentItem) {
    const name = prompt("New file name", doc.name);
    if (!name) return;
    await fetch("/api/documents", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: doc.id, name, folderId: doc.folderId, isResume: doc.isResume }) });
    await load();
  }

  async function markResume(doc: DocumentItem) {
    await fetch("/api/documents", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: doc.id, name: doc.name, folderId: doc.folderId, isResume: true }) });
    await load();
  }

  async function remove(doc: DocumentItem) {
    if (!confirm(`Delete ${doc.name}?`)) return;
    await fetch("/api/documents", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: doc.id }) });
    await load();
  }

  const filtered = useMemo(() => items.filter((item) => (folder === "all" || item.folderId === folder) && `${item.name} ${item.originalName} ${item.extension}`.toLowerCase().includes(query.toLowerCase())), [items, folder, query]);
  const usedPercent = Math.min(100, Math.round((storage.usedBytes / storage.limitBytes) * 100));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Private cloud</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Document Manager</h1><p className="mt-2 max-w-3xl text-[var(--muted)]">Upload and organize private PDFs, Office files, text, images, and ZIP archives. Files are stored outside the public folder and served only through authenticated routes.</p></div><div className="glass min-w-72 rounded-2xl p-4"><div className="flex justify-between text-sm"><span>Storage Used</span><strong>{formatBytes(storage.usedBytes)} / {formatBytes(storage.limitBytes)}</strong></div><div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${usedPercent}%` }} /></div></div></div>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <form onSubmit={upload} className="glass grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2"><label className="grid gap-2 text-sm font-medium">File<input required name="file" type="file" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" /></label><label className="grid gap-2 text-sm font-medium">Folder<select name="folderId" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm"><option value="">No folder</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label><label className="grid gap-2 text-sm font-medium">Display name<input name="name" className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" placeholder="Optional custom name" /></label><label className="flex items-center gap-3 self-end rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-medium"><input name="isResume" value="true" type="checkbox" /> Mark as resume</label><button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white md:col-span-2">Upload File</button></form>
        <form onSubmit={createFolder} className="glass grid content-start gap-4 rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Create Folder</h2><input required name="name" placeholder="Resume, Certificates, College..." className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" /><button className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold">Create Folder</button></form>
      </div>
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-[var(--line)] bg-[var(--card)] p-4 lg:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search documents..." className="flex-1 rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" /><select value={folder} onChange={(event) => setFolder(event.target.value)} className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm"><option value="all">All folders</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select><button onClick={() => setView(view === "grid" ? "list" : "grid")} className="rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-semibold">{view === "grid" ? "List View" : "Grid View"}</button></div>
      {status && <p className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">{status}</p>}
      {!status && filtered.length === 0 && <p className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">No documents found.</p>}
      <div className={view === "grid" ? "grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "grid gap-3"}>{filtered.map((doc) => <article key={doc.id} className="glass rounded-[1.5rem] p-5"><div className="flex justify-between gap-4"><div><h2 className="font-semibold">{doc.name}</h2><p className="mt-1 text-sm text-[var(--muted)]">{doc.extension.toUpperCase()} · {formatBytes(doc.sizeBytes)} · {formatDate(doc.createdAt)}</p></div>{doc.isResume && <span className="h-fit rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600">Resume</span>}</div><p className="mt-3 text-xs text-[var(--muted)]">Folder: {folders.find((folder) => folder.id === doc.folderId)?.name || 'None'}</p><div className="mt-5 flex flex-wrap gap-2"><a href={`/api/documents/${doc.id}/download?preview=1`} target="_blank" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">Preview</a><a href={`/api/documents/${doc.id}/download`} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Download</a><button onClick={() => rename(doc)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">Rename</button><button onClick={() => markResume(doc)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">Use as Resume</button><button onClick={() => remove(doc)} className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500">Delete</button></div></article>)}</div>
    </div>
  );
}
