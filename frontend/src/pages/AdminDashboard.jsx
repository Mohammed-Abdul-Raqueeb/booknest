import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LibraryBig,
  LayoutGrid,
  BookOpen,
  Users,
  BookMarked,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  RotateCcw,
  GraduationCap,
} from "lucide-react";

import StatCard from "../components/StatCard";
import API from "../api/api";

const TABS = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "books", label: "Manage books", icon: BookOpen },
  { key: "students", label: "Manage students", icon: Users },
  { key: "borrowing", label: "Borrow management", icon: BookMarked },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("student");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar nav */}
      <aside className="glass-panel sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-y-0 border-l-0 lg:flex">
        <div className="flex items-center gap-2 px-5 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-deep shadow-glow-sm">
            <LibraryBig size={18} className="text-white" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold text-ink">BookNest</p>
            <p className="text-xs text-ink-faint">Admin console</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-violet/15 text-ink ring-1 ring-inset ring-violet/30"
                  : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mx-3 mb-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-signal-fine transition-colors hover:bg-signal-fine/10"
        >
          <LogOut size={17} /> Log out
        </button>
      </aside>

      {/* Mobile tab bar */}
      <div className="glass-panel fixed inset-x-0 top-0 z-40 flex items-center gap-1 overflow-x-auto border-x-0 border-t-0 px-3 py-2 lg:hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === key ? "bg-violet/20 text-violet-soft" : "text-ink-muted"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
        <button onClick={handleLogout} className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-signal-fine">
          <LogOut size={14} /> Log out
        </button>
      </div>

      {/* Content */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-20 sm:px-6 lg:px-10 lg:pt-10">
        {tab === "overview" && <OverviewTab />}
        {tab === "books" && <BooksTab />}
        {tab === "students" && <StudentsTab />}
        {tab === "borrowing" && <BorrowingTab />}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                             */
/* ------------------------------------------------------------------ */

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await API.get("/api/admin/statistics");

        if (!cancelled) setStats(res.data);

      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message || "Couldn't load statistics.");
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
    <section className="animate-fade-in-up">

      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Welcome back, Admin 👋
      </h1>

      <p className="mt-2 text-sm text-ink-muted">
        Here's what's happening in your library today.
      </p>


      {error && (
        <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine">
          {error}
        </p>
      )}


      {/* Statistics */}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <StatCard
          icon={BookOpen}
          label="Total books"
          value={loading ? "—" : stats?.totalBooks ?? 0}
          tone="violet"
        />

        <StatCard
          icon={CheckCircle2}
          label="Available books"
          value={loading ? "—" : stats?.availableBooks ?? 0}
          tone="available"
        />

        <StatCard
          icon={BookMarked}
          label="Borrowed books"
          value={loading ? "—" : stats?.borrowedBooks ?? 0}
          tone="borrowed"
        />

        <StatCard
          icon={GraduationCap}
          label="Total students"
          value={loading ? "—" : stats?.totalStudents ?? 0}
          tone="violet"
        />

        <StatCard
          icon={Clock}
          label="Active borrows"
          value={loading ? "—" : stats?.activeBorrows ?? 0}
          tone="borrowed"
        />

        <StatCard
          icon={AlertTriangle}
          label="Overdue books"
          value={loading ? "—" : stats?.overdueBorrows ?? 0}
          tone="fine"
        />

      </div>


      {/* Quick actions */}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="glass-card p-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            📚 Manage Books
          </h3>

          <p className="mt-2 text-sm text-ink-muted">
            Add, edit and remove books from your catalog.
          </p>
        </div>


        <div className="glass-card p-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            👥 Manage Students
          </h3>

          <p className="mt-2 text-sm text-ink-muted">
            View registered student accounts.
          </p>
        </div>


        <div className="glass-card p-5">
          <h3 className="font-display text-lg font-semibold text-ink">
            🔄 Borrow Records
          </h3>

          <p className="mt-2 text-sm text-ink-muted">
            Track borrowed and returned books.
          </p>
        </div>

      </div>


    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Books                                                                */
/* ------------------------------------------------------------------ */

const EMPTY_BOOK_FORM = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  description: "",
  coverImage: "",
  rating: "",
  available: true,
};

function BooksTab() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null); // null = creating
  const [form, setForm] = useState(EMPTY_BOOK_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function loadBooks() {
    try {
      setLoading(true);
      const res = await API.get("/api/books");
      setBooks(res.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function openCreate() {
    setEditingBook(null);
    setForm(EMPTY_BOOK_FORM);
    setActionError("");
    setFormOpen(true);
  }

  function openEdit(book) {
    setEditingBook(book);
    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      isbn: book.isbn || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      rating: book.rating ?? "",
      available: !!book.available,
    });
    setActionError("");
    setFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setActionError("");
    try {
      const payload = {
        ...form,
        rating: form.rating === "" ? null : Number(form.rating),
      };
      if (editingBook) {
        await API.put(`/api/books/${editingBook.id}`, payload);
      } else {
        await API.post("/api/books", payload);
      }
      setFormOpen(false);
      await loadBooks();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Something went wrong while saving this book.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(book) {
    setDeletingId(book.id);
    setActionError("");
    try {
      await API.delete(`/api/books/${book.id}`);
      await loadBooks();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Couldn't delete this book.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Manage books</h1>
          <p className="mt-2 text-sm text-ink-muted">Full catalog, pulled from the live books API.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={15} /> Add book
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
          {error}
        </p>
      )}

      {actionError && (
        <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
          {actionError}
        </p>
      )}

      {formOpen && (
        <BookForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          saving={saving}
          isEditing={!!editingBook}
        />
      )}

      <div className="glass-card mt-6 overflow-hidden">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint md:grid">
          <span>Title</span>
          <span>Author</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 animate-pulse px-5 py-4" />)
          ) : books.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink-faint">No books in the catalog.</p>
          ) : (
            books.map((b) => (
              <div
                key={b.id}
                className="grid grid-cols-1 gap-2 px-5 py-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4"
              >
                <span className="truncate text-sm font-medium text-ink">{b.title}</span>
                <span className="truncate text-sm text-ink-muted">{b.author || "—"}</span>
                <span className="truncate text-sm text-ink-muted">{b.category || "—"}</span>
                <span
                  className={`badge w-fit ${
                    b.available
                      ? "bg-signal-available/15 text-signal-available ring-1 ring-inset ring-signal-available/30"
                      : "bg-signal-fine/15 text-signal-fine ring-1 ring-inset ring-signal-fine/30"
                  }`}
                >
                  {b.available ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                  {b.available ? "Available" : "Borrowed"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(b)}
                    aria-label="Edit book"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b)}
                    disabled={deletingId === b.id}
                    aria-label="Delete book"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-signal-fine transition-colors hover:bg-signal-fine/10 disabled:opacity-50"
                  >
                    {deletingId === b.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function BookForm({ form, setForm, onSubmit, onCancel, saving, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="glass-card mt-4 space-y-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">{isEditing ? "Edit book" : "Add a new book"}</h2>
        <button type="button" onClick={onCancel} aria-label="Close form" className="text-ink-faint hover:text-ink">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Author</label>
          <input
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Category</label>
          <input
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">ISBN</label>
          <input
            value={form.isbn}
            onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Cover image URL</label>
          <input
            value={form.coverImage}
            onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
            placeholder="https://…"
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Rating (0–5)</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
            className="input-field"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-faint">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="input-field resize-none"
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet"
            />
            Available to borrow
          </label>
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
        {isEditing ? "Save changes" : "Add book"}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Students                                                             */
/* ------------------------------------------------------------------ */

function StudentsTab() {
  const [students, setStudents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await API.get("/api/students");
        if (!cancelled) setStudents(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Couldn't load students.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalStudents = useMemo(() => (students || []).filter((s) => s.role !== "ADMIN").length, [students]);

  return (
    <section className="animate-fade-in-up">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Manage students</h1>
          <p className="mt-2 text-sm text-ink-muted">Registered students and their accounts.</p>
        </div>
        {!loading && students && <span className="text-sm text-ink-faint">{totalStudents} students</span>}
      </div>

      {loading ? (
        <div className="glass-card mt-8 h-40 animate-pulse" />
      ) : error ? (
        <div className="glass-card mt-8 flex flex-col items-center gap-2 py-16 text-center">
          <Users size={28} className="text-ink-faint" />
          <p className="text-sm text-ink-muted">{error}</p>
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card mt-8 flex flex-col items-center gap-2 py-16 text-center">
          <Users size={28} className="text-ink-faint" />
          <p className="text-sm text-ink-muted">No registered students yet.</p>
        </div>
      ) : (
        <div className="glass-card mt-8 overflow-hidden">
          <div className="hidden grid-cols-[2fr_1.5fr_2fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint md:grid">
            <span>Name</span>
            <span>Username</span>
            <span>Email</span>
            <span>Role</span>
            <span>ID</span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {students.map((s) => (
              <div key={s.id} className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-[2fr_1.5fr_2fr_1fr_1fr] md:items-center md:gap-4">
                <span className="truncate text-sm font-medium text-ink">{s.fullName}</span>
                <span className="truncate text-sm text-ink-muted">{s.username}</span>
                <span className="truncate text-sm text-ink-muted">{s.email}</span>
                <span
                  className={`badge w-fit ${
                    s.role === "ADMIN"
                      ? "bg-violet/15 text-violet-soft ring-1 ring-inset ring-violet/30"
                      : "bg-white/[0.05] text-ink-muted ring-1 ring-inset ring-white/10"
                  }`}
                >
                  {s.role}
                </span>
                <span className="font-mono text-sm text-ink-faint">#{s.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Borrow management                                                    */
/* ------------------------------------------------------------------ */

const BORROW_STATUS_STYLES = {
  RETURNED: "bg-signal-available/15 text-signal-available ring-1 ring-inset ring-signal-available/30",
  OVERDUE: "bg-signal-fine/15 text-signal-fine ring-1 ring-inset ring-signal-fine/30",
  BORROWED: "bg-signal-borrowed/15 text-signal-borrowed ring-1 ring-inset ring-signal-borrowed/30",
};

function BorrowingTab() {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [returningId, setReturningId] = useState(null);
  const [actionError, setActionError] = useState("");

  async function loadRecords() {
    try {
      setLoading(true);
      const res = await API.get("/api/borrow");
      setRecords(res.data || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't load borrow records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function handleMarkReturned(record) {
    setReturningId(record.id);
    setActionError("");
    try {
      await API.put(`/api/borrow/return/${record.id}`);
      await loadRecords();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Couldn't mark this book as returned.");
    } finally {
      setReturningId(null);
    }
  }

  return (
    <section className="animate-fade-in-up">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">Borrow management</h1>
      <p className="mt-2 text-sm text-ink-muted">Every borrow record across the library, most recent first.</p>

      {actionError && (
        <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="glass-card mt-8 h-40 animate-pulse" />
      ) : error ? (
        <div className="glass-card mt-8 flex flex-col items-center gap-2 py-16 text-center">
          <BookMarked size={28} className="text-ink-faint" />
          <p className="text-sm text-ink-muted">{error}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="glass-card mt-8 flex flex-col items-center gap-2 py-16 text-center">
          <BookMarked size={28} className="text-ink-faint" />
          <p className="text-sm text-ink-muted">No borrow records yet.</p>
        </div>
      ) : (
        <div className="glass-card mt-8 overflow-hidden">
          <div className="hidden grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-faint md:grid">
            <span>Student</span>
            <span>Book</span>
            <span>Borrowed on</span>
            <span>Due</span>
            <span>Status</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {[...records].reverse().map((r) => (
              <div key={r.id} className="grid grid-cols-1 gap-1 px-5 py-3 md:grid-cols-[1.5fr_1.5fr_1fr_1fr_1fr_auto] md:items-center md:gap-4">
                <span className="truncate text-sm font-medium text-ink">{r.studentName}</span>
                <span className="truncate text-sm text-ink-muted">{r.bookTitle}</span>
                <span className="truncate text-sm text-ink-muted">{r.borrowDate || "—"}</span>
                <span className="truncate text-sm text-ink-muted">{r.dueDate || "—"}</span>
                <span className={`badge w-fit ${BORROW_STATUS_STYLES[r.status] || BORROW_STATUS_STYLES.BORROWED}`}>
                  {r.status}
                  {r.fine > 0 ? ` · ₹${r.fine}` : ""}
                </span>
                <div>
                  {!r.returned && (
                    <button
                      onClick={() => handleMarkReturned(r)}
                      disabled={returningId === r.id}
                      className="btn-secondary !py-1.5 !px-3 text-xs disabled:opacity-50"
                    >
                      {returningId === r.id ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        <RotateCcw size={12} />
                      )}
                      Mark returned
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
