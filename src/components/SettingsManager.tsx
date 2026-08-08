"use client";

import { FormEvent, useEffect, useState } from "react";

type Profile = { name: string; email: string; phone?: string; bio?: string; profilePhotoUrl?: string; githubUrl?: string; linkedinUrl?: string };

export function SettingsManager() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/settings");
    if (response.ok) {
      const data = (await response.json()) as { item: Profile };
      setProfile(data.item);
    }
  }
  useEffect(() => { void load(); }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Saving...");
    const response = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())) });
    setMessage(response.ok ? "Profile updated successfully." : "Unable to update profile.");
    await load();
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Updating password...");
    const response = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())) });
    setMessage(response.ok ? "Password changed successfully." : "Unable to change password. Check current password and length.");
    if (response.ok) event.currentTarget.reset();
  }

  async function logoutAllSessions() {
    if (!confirm("Log out from all sessions? You will need to sign in again.")) return;
    await fetch("/api/auth/logout-all", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="grid gap-6">
      <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300">Account</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Profile Settings</h1><p className="mt-2 text-[var(--muted)]">Manage identity, contact details, public social links, resume instructions, security, and preferences.</p></div>
      {message && <p className="rounded-2xl border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p>}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <form key={profile?.email ?? "loading-profile"} onSubmit={saveProfile} className="glass grid gap-4 rounded-[1.5rem] p-5 md:grid-cols-2">
          <h2 className="text-xl font-semibold md:col-span-2">Public profile</h2>
          <Input label="Name" name="name" defaultValue={profile?.name} required />
          <Input label="Email" name="email" type="email" defaultValue={profile?.email} required />
          <Input label="Phone" name="phone" defaultValue={profile?.phone} />
          <Input label="Profile Photo URL" name="profilePhotoUrl" defaultValue={profile?.profilePhotoUrl} />
          <Input label="GitHub URL" name="githubUrl" defaultValue={profile?.githubUrl} />
          <Input label="LinkedIn URL" name="linkedinUrl" defaultValue={profile?.linkedinUrl} />
          <label className="grid gap-2 text-sm font-medium md:col-span-2">Bio<textarea name="bio" rows={5} defaultValue={profile?.bio} className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" /></label>
          <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white md:col-span-2">Save Profile</button>
        </form>
        <div className="grid gap-6">
          <form onSubmit={changePassword} className="glass grid gap-4 rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Security</h2><Input label="Current Password" name="currentPassword" type="password" required /><Input label="New Password" name="newPassword" type="password" required /><button className="rounded-2xl border border-[var(--line)] px-5 py-3 text-sm font-semibold">Change Password</button><button type="button" onClick={logoutAllSessions} className="rounded-2xl bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-500">Logout from all sessions</button></form>
          <div className="glass rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Resume</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Upload a PDF/DOC resume from Documents and choose “Use as Resume”. The public Download Resume button will serve that file. Until then, it downloads a clearly marked placeholder.</p></div>
          <div className="glass rounded-[1.5rem] p-5"><h2 className="text-xl font-semibold">Preferences</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Use the theme toggle in the top bar for light or dark mode. Notification preferences are prepared in the UI and can be extended with email or push providers.</p></div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, name, defaultValue, type = "text", required = false }: { label: string; name: string; defaultValue?: string | null; type?: string; required?: boolean }) {
  return <label className="grid gap-2 text-sm font-medium">{label}<input name={name} type={type} required={required} defaultValue={defaultValue || ""} className="rounded-2xl border border-[var(--line)] bg-[var(--card-strong)] px-4 py-3 text-sm" /></label>;
}
