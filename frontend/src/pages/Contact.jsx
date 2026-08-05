import { useEffect, useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Contact() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      const parsed = JSON.parse(stored);
      setStudent(parsed);
      setForm((f) => ({ ...f, name: parsed.name || "", email: parsed.email || "" }));
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // NOTE: there's no backend contact endpoint yet, so this only confirms
    // locally. Wire this to a real endpoint (e.g. POST /contact) once one exists.
    setSent(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="animate-fade-in-up font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Contact us
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
          Questions, issues, or feedback about the BookNest — send it over.
        </p>

        <div className="glass-card mt-8 p-6 sm:p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 size={28} className="text-signal-available" />
              <p className="font-display text-lg font-semibold text-ink">Message received</p>
              <p className="text-sm text-ink-muted">We'll get back to you at {form.email || "your email"}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send size={15} /> Send message
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-ink-faint">
                <Mail size={12} /> Or email the library desk directly.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
