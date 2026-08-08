"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "date" | "checkbox" | "select" | "tags" | "url";
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

type Item = Record<string, unknown> & { id: string; title?: string; name?: string; createdAt?: string; updatedAt?: string; progress?: number };

export function CrudManager({ title, description, endpoint, fields, empty = "No records found.", primaryKey = "title", secondaryKey, kanbanStatuses }: {
  title: string;
  description: string;
  endpoint: string;
  fields: Field[];
  empty?: string;
  primaryKey?: string;
  secondaryKey?: string;
  kanbanStatuses?: string[];
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState("");

  async function load() {
    setStatus("Loading...");
    const response = await fetch(endpoint);
    if (response.ok) {
      const data = (await response.json()) as { items: Item[] };
      setItems(data.items || []);
      setStatus("");
    } else {
      setStatus("Unable to load records.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = editing ? { id: editing.id } : {};
    fields.forEach((field) => {
      if (field.type === "checkbox") payload[field.key] = form.get(field.key) === "on";
      else payload[field.key] = form.get(field.key)?.toString() || "";
    });
    const response = await fetch(endpoint, { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Unable to save record.");
      return;
    }
    event.currentTarget.reset();
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    const response = await fetch(endpoint, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (response.ok) await load();
  }

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(term));
  }, [items, query]);

  const groups = kanbanStatuses ? kanbanStatuses.map((statusName) => ({ status: statusName, items: filtered.filter((item) => item.status === statusName) })) : [];

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{title}</h1><p className="mt-2 max-w-3xl text-[var(--muted)]">{description}</p></div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search and filter..." className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm" />
      </div>
      <form key={editing?.id ?? "new-record"} onSubmit={submit} className="glass grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => <FieldInput key={field.key} field={field} value={editing?.[field.key]} />)}
        <div className="flex items-end gap-3"><button className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white">{editing ? "Save Changes" : "Create"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold">Cancel</button>}</div>
        {error && <p className="md:col-span-2 xl:col-span-3 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}
      </form>
      {status && <p className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">{status}</p>}
      {!status && filtered.length === 0 && <p className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-[var(--muted)]">{empty}</p>}
      {kanbanStatuses ? <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">{groups.map((group) => <div key={group.status} className="glass min-h-56 rounded-[1.5rem] p-4"><h2 className="font-semibold">{group.status}</h2><div className="mt-4 grid gap-3">{group.items.map((item) => <ItemCard key={item.id} item={item} primaryKey={primaryKey} secondaryKey={secondaryKey} fields={fields} onEdit={setEditing} onDelete={remove} />)}</div></div>)}</div> : <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">{filtered.map((item) => <ItemCard key={item.id} item={item} primaryKey={primaryKey} secondaryKey={secondaryKey} fields={fields} onEdit={setEditing} onDelete={remove} />)}</div>}
    </div>
  );
}

function FieldInput({ field, value }: { field: Field; value: unknown }) {
  const common = "rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm";
  const defaultValue = Array.isArray(value) ? value.join(", ") : value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === "string" ? (field.type === "date" && value ? value.slice(0, 10) : value) : typeof value === "number" ? String(value) : "";
  if (field.type === "textarea") return <label className="grid gap-2 text-sm font-medium md:col-span-2 xl:col-span-3">{field.label}<textarea name={field.key} required={field.required} defaultValue={defaultValue} rows={4} placeholder={field.placeholder} className={common} /></label>;
  if (field.type === "select") return <label className="grid gap-2 text-sm font-medium">{field.label}<select name={field.key} required={field.required} defaultValue={defaultValue} className={common}>{field.options?.map((option) => <option key={option}>{option}</option>)}</select></label>;
  if (field.type === "checkbox") return <label className="flex items-center gap-3 self-end rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-medium"><input name={field.key} type="checkbox" defaultChecked={Boolean(value)} />{field.label}</label>;
  return <label className="grid gap-2 text-sm font-medium">{field.label}<input name={field.key} required={field.required} type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "url" ? "url" : "text"} min={field.type === "number" ? 0 : undefined} max={field.key === "progress" ? 100 : undefined} defaultValue={defaultValue} placeholder={field.placeholder || (field.type === "tags" ? "Comma separated" : undefined)} className={common} /></label>;
}

function ItemCard({ item, primaryKey, secondaryKey, fields, onEdit, onDelete }: { item: Item; primaryKey: string; secondaryKey?: string; fields: Field[]; onEdit: (item: Item) => void; onDelete: (id: string) => void }) {
  const primary = String(item[primaryKey] || item.title || item.name || "Untitled");
  const secondary = secondaryKey ? String(item[secondaryKey] || "") : "";
  return <article className="glass rounded-[1.5rem] p-5"><div className="flex justify-between gap-4"><div><h2 className="font-semibold">{primary}</h2>{secondary && <p className="mt-1 text-sm text-[var(--muted)]">{secondary}</p>}</div>{Boolean(item.sample) && <span className="h-fit rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-600">Sample</span>}</div>{typeof item.progress === "number" && <div className="mt-4"><div className="flex justify-between text-xs text-[var(--muted)]"><span>Progress</span><span>{item.progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${item.progress}%` }} /></div></div>}<dl className="mt-4 grid gap-2 text-sm text-[var(--muted)]">{fields.slice(0, 5).map((field) => field.key !== primaryKey && <div key={field.key} className="flex justify-between gap-3 border-t border-[var(--line)] pt-2"><dt>{field.label}</dt><dd className="max-w-[60%] truncate text-right">{renderValue(item[field.key])}</dd></div>)}</dl><p className="mt-4 text-xs text-[var(--muted)]">Updated {formatDate((item.updatedAt || item.createdAt) as string)}</p><div className="mt-5 flex gap-2"><button onClick={() => onEdit(item)} className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-semibold">Edit</button><button onClick={() => onDelete(item.id)} className="rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-500">Delete</button></div></article>;
}

function renderValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDate(value);
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}
