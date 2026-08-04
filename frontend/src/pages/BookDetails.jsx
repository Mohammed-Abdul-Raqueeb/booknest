import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  Star,
  CheckCircle2,
  XCircle,
  Loader2,
  Tag,
  User as UserIcon,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import API from "../api/api";

const BOOKMARKS_KEY = "bookmarkedBooks";

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [borrowing, setBorrowing] = useState(false);
  const [toast, setToast] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) setStudent(JSON.parse(stored));

    const saved = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    setIsBookmarked(saved.some((b) => String(b.id) === String(id)));

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError("");
        const res = await API.get(`/books/${id}`);
        if (!cancelled) setBook(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.response?.status === 404
              ? "This book couldn't be found."
              : err?.response?.data?.message || "Couldn't load this book."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function toggleBookmark() {
    if (!book) return;
    const saved = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
    if (isBookmarked) {
      const next = saved.filter((b) => b.id !== book.id);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      setIsBookmarked(false);
    } else {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...saved, book]));
      setIsBookmarked(true);
    }
  }

  async function handleBorrow() {
    if (!student?.id) {
      setError("You need to be logged in to borrow a book.");
      return;
    }
    if (!book?.available || borrowing) return;
    try {
      setBorrowing(true);
      await API.post(`/borrow/${student.id}/${book.id}`);
      setBook((prev) => ({ ...prev, available: false }));
      setToast(`Borrowed "${book.title}"`);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't borrow this book. Please try again.");
    } finally {
      setBorrowing(false);
    }
  }

  const hue = book ? ((book.title || "?").split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 360 : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {loading ? (
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
            <div className="glass-card aspect-[3/4] w-full animate-pulse" />
            <div className="space-y-3">
              <div className="glass-card h-8 w-2/3 animate-pulse" />
              <div className="glass-card h-4 w-1/3 animate-pulse" />
              <div className="glass-card h-24 w-full animate-pulse" />
            </div>
          </div>
        ) : error ? (
          <div className="glass-card mt-8 flex flex-col items-center gap-2 py-16 text-center">
            <BookOpen size={28} className="text-ink-faint" />
            <p className="text-sm text-ink-muted">{error}</p>
            <Link to="/browse" className="btn-secondary mt-3">
              Back to Browse
            </Link>
          </div>
        ) : book ? (
          <section className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-[280px_1fr]">
            {/* Cover */}
            <div className="glass-card relative aspect-[3/4] w-full overflow-hidden">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue} 60% 22%), hsl(${(hue + 40) % 360} 55% 12%))`,
                  }}
                >
                  <BookOpen size={40} className="text-white/70" />
                </div>
              )}
              <span
                className={`badge absolute left-3 top-3 backdrop-blur-md ${
                  book.available
                    ? "bg-signal-available/15 text-signal-available ring-1 ring-inset ring-signal-available/30"
                    : "bg-signal-fine/15 text-signal-fine ring-1 ring-inset ring-signal-fine/30"
                }`}
              >
                {book.available ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                {book.available ? "Available" : "Checked out"}
              </span>
            </div>

            {/* Info */}
            <div className="animate-fade-in-up">
              {book.category && (
                <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-violet/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-violet-soft ring-1 ring-inset ring-violet/30">
                  <Tag size={11} /> {book.category}
                </span>
              )}

              <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {book.title}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
                {book.author && (
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={14} className="text-ink-faint" /> {book.author}
                  </span>
                )}
                {typeof book.rating === "number" && (
                  <span className="flex items-center gap-1 font-mono">
                    <Star size={14} className="fill-signal-borrowed text-signal-borrowed" />
                    {book.rating.toFixed(1)} / 5
                  </span>
                )}
                {book.isbn && <span className="text-xs text-ink-faint">ISBN {book.isbn}</span>}
              </div>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-muted">
                {book.description || "No description available for this title yet."}
              </p>

              {error && (
                <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
                  {error}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBorrow}
                  disabled={!book.available || borrowing}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {borrowing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : book.available ? (
                    "Borrow this book"
                  ) : (
                    "Currently checked out"
                  )}
                </button>

                <button
                  onClick={toggleBookmark}
                  className={`btn-secondary ${isBookmarked ? "!border-violet/40 !text-violet-soft" : ""}`}
                >
                  <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
