import { useEffect, useState } from "react";
import { BookMarked, Calendar, Wallet, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import API from "../api/api";

const STATUS_STYLES = {
  RETURNED: {
    badge: "bg-signal-available/15 text-signal-available ring-1 ring-inset ring-signal-available/30",
    icon: CheckCircle2,
    label: "Returned",
  },
  OVERDUE: {
    badge: "bg-signal-fine/15 text-signal-fine ring-1 ring-inset ring-signal-fine/30",
    icon: AlertTriangle,
    label: "Overdue",
  },
  BORROWED: {
    badge: "bg-signal-borrowed/15 text-signal-borrowed ring-1 ring-inset ring-signal-borrowed/30",
    icon: Clock,
    label: "Borrowed",
  },
};

export default function MyBorrowings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("student");
    const parsedStudent = stored ? JSON.parse(stored) : null;
    setStudent(parsedStudent);

    if (!parsedStudent?.id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await API.get(`/borrow/student/${parsedStudent.id}`);
        if (!cancelled) setRecords(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Couldn't load your borrowings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">My borrowings</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Every book you've borrowed, its due date, and any fines attached to it.
          </p>
        </section>

        {error && (
          <p className="mt-6 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
            {error}
          </p>
        )}

        <section className="mt-8">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card h-20 animate-pulse" />
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="glass-card flex flex-col items-center gap-2 py-16 text-center">
              <BookMarked size={28} className="text-ink-faint" />
              <p className="text-sm text-ink-muted">You haven't borrowed any books yet.</p>
              <p className="text-xs text-ink-faint">Head to Browse to find your next read.</p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              {/* Table header - desktop */}
              <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint md:grid">
                <span>Book</span>
                <span>Borrowed on</span>
                <span>Due date</span>
                <span>Status</span>
                <span>Fine</span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {records.map((r, i) => {
                  const style = STATUS_STYLES[r.status] || STATUS_STYLES.BORROWED;
                  const StatusIcon = style.icon;
                  const fine = r.fine ?? 0;

                  return (
                    <div key={r.id ?? i} className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:items-center md:gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet/30 to-violet-deep/30">
                          <BookMarked size={16} className="text-violet-soft" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ink">{r.bookTitle || "Untitled book"}</p>
                          {r.bookAuthor && <p className="truncate text-xs text-ink-faint">{r.bookAuthor}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-ink-muted md:text-sm">
                        <Calendar size={13} className="text-ink-faint" />
                        {r.borrowDate || "—"}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-ink-muted md:text-sm">
                        <Calendar size={13} className="text-ink-faint" />
                        {r.dueDate || "—"}
                      </div>

                      <span className={`badge w-fit ${style.badge}`}>
                        <StatusIcon size={11} />
                        {style.label}
                      </span>

                      <div className="flex items-center gap-1.5 font-mono text-sm text-ink">
                        <Wallet size={13} className={fine > 0 ? "text-signal-fine" : "text-ink-faint"} />
                        <span className={fine > 0 ? "text-signal-fine" : "text-ink-muted"}>₹{fine}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
