import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User2, Mail, AtSign, BookMarked, Pencil, Save, X, LogOut, Shield, KeyRound } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import API from "../api/api";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "", email: "" });
  const [borrowedCount, setBorrowedCount] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) return;

    const parsed = JSON.parse(stored);
    setStudent(parsed);
    setForm({
      fullName: parsed.name || "",
      username: parsed.username || "",
      email: parsed.email || "",
    });

    if (parsed.id) {
      API.get(`/borrow/student/${parsed.id}`)
        .then((res) => setBorrowedCount((res.data || []).filter((r) => !r.returned).length))
        .catch(() => setBorrowedCount(null));
    }
  }, []);

  async function handleSave() {
    if (!student?.id) return;
    setSaving(true);
    setError("");
    try {
      const res = await API.put(`/students/${student.id}`, {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
      });

      const updated = {
        ...student,
        name: res.data.fullName,
        username: res.data.username,
        email: res.data.email,
      };
      setStudent(updated);
      localStorage.setItem("student", JSON.stringify(updated));
      setEditing(false);
      setToast("Profile updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    setPasswordSaving(true);
    try {
      await API.put(`/students/${student.id}`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setChangingPassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setToast("Password changed");
    } catch (err) {
      setPasswordError(err?.response?.data?.message || "Couldn't change your password. Please try again.");
    } finally {
      setPasswordSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("student");
    navigate("/");
  }

  const initials = (student?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} onLogout={handleLogout} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Profile</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">Your account details.</p>
        </section>

        <section className="glass-card relative mt-8 overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet/10 blur-3xl" />

          <div className="relative flex flex-wrap items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet to-violet-deep text-xl font-semibold text-white shadow-glow-sm">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-xl font-semibold text-ink">{student?.name || "Student"}</h2>
              <p className="flex items-center gap-1.5 truncate text-sm text-ink-muted">
                <Shield size={13} className="text-violet-soft" />
                {student?.role === "ADMIN" ? "Admin account" : "Student account"}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
              <BookMarked size={16} className="text-violet-soft" />
              <div>
                <p className="font-mono text-lg font-semibold leading-none text-ink">
                  {borrowedCount === null ? "—" : borrowedCount}
                </p>
                <p className="text-[11px] text-ink-faint">Books borrowed</p>
              </div>
            </div>
          </div>

          {error && (
            <p className="relative mt-6 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
              {error}
            </p>
          )}

          <div className="relative mt-8 space-y-4">
            <Field
              icon={User2}
              label="Full name"
              value={form.fullName}
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, fullName: v }))}
            />
            <Field
              icon={AtSign}
              label="Username"
              value={form.username}
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, username: v.trim() }))}
            />
            <Field
              icon={Mail}
              label="Email address"
              value={form.email}
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
            />
          </div>

          <div className="relative mt-8 flex flex-wrap gap-3">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  <Save size={15} /> {saving ? "Saving…" : "Save changes"}
                </button>
                <button
                  onClick={() => {
                    setForm({ fullName: student?.name || "", username: student?.username || "", email: student?.email || "" });
                    setEditing(false);
                    setError("");
                  }}
                  className="btn-secondary"
                >
                  <X size={15} /> Cancel
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="btn-secondary">
                  <Pencil size={15} /> Edit profile
                </button>
                <button onClick={() => setChangingPassword((v) => !v)} className="btn-secondary">
                  <KeyRound size={15} /> Change password
                </button>
              </>
            )}

            <button onClick={handleLogout} className="btn-danger ml-auto">
              <LogOut size={15} /> Log out
            </button>
          </div>

          {changingPassword && (
            <form onSubmit={handleChangePassword} className="relative mt-6 space-y-4 border-t border-white/10 pt-6">
              <h3 className="font-display text-base font-semibold text-ink">Change password</h3>

              <PasswordField
                label="Current password"
                value={passwordForm.currentPassword}
                onChange={(v) => setPasswordForm((f) => ({ ...f, currentPassword: v }))}
              />
              <PasswordField
                label="New password"
                value={passwordForm.newPassword}
                onChange={(v) => setPasswordForm((f) => ({ ...f, newPassword: v }))}
              />
              <PasswordField
                label="Confirm new password"
                value={passwordForm.confirmPassword}
                onChange={(v) => setPasswordForm((f) => ({ ...f, confirmPassword: v }))}
              />

              {passwordError && (
                <p className="rounded-lg bg-signal-fine/10 px-3 py-2 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
                  {passwordError}
                </p>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={passwordSaving} className="btn-primary">
                  {passwordSaving ? "Updating…" : "Update password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPasswordError("");
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <Footer />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function Field({ icon: Icon, label, value, editing, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</label>
      {editing ? (
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-violet/50">
          <Icon size={16} className="shrink-0 text-ink-faint" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <Icon size={16} className="shrink-0 text-ink-faint" />
          <span className="text-sm text-ink">{value || "—"}</span>
        </div>
      )}
    </div>
  );
}

function PasswordField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</label>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 focus-within:border-violet/50">
        <KeyRound size={16} className="shrink-0 text-ink-faint" />
        <input
          type="password"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
    </div>
  );
}
