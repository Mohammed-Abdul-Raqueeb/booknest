import { useEffect, useState } from "react";
import { BookOpen, BookMarked, Wallet } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import BookCard from "../components/BookCard";
import Toast from "../components/Toast";
import API from "../api/api";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // set by Login.jsx after /students/login or /students/register
    const stored = localStorage.getItem("student");
    const parsedStudent = stored ? JSON.parse(stored) : null;
    setStudent(parsedStudent);

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const requests = [API.get("/books")];
        if (parsedStudent?.id) {
          requests.push(API.get(`/borrow/student/${parsedStudent.id}`));
        }
        const [booksRes, borrowRes] = await Promise.all(requests);
        if (!cancelled) {
          setBooks(booksRes.data || []);
          if (borrowRes) setBorrowRecords(borrowRes.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Couldn't load your dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleBorrow(bookId) {
    if (!student?.id) {
      setError("You need to be logged in to borrow a book.");
      return;
    }
    try {
      const book = books.find((b) => b.id === bookId);
      await API.post(`/borrow/${student.id}/${bookId}`);
      // reflect the change immediately without a full refetch
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, available: false } : b)));
      setToast(book ? `Borrowed "${book.title}"` : "Book borrowed successfully");

      // refresh this student's real borrow history so the stat card and
      // My Borrowings stay accurate
      try {
        const res = await API.get(`/borrow/student/${student.id}`);
        setBorrowRecords(res.data || []);
      } catch {
        // non-fatal — the borrow itself succeeded, just couldn't refresh the count
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't borrow this book. Please try again.");
    }
  }

  const availableCount = books.filter((b) => b.available).length;
  const activeBorrows = borrowRecords.filter((r) => !r.returned);
  const totalFine = borrowRecords.reduce((sum, r) => sum + (r.fine ?? 0), 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        user={{ name: student?.name || "Student" }}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Welcome back, {student?.name || "reader"} 👋
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Here's what's available, what you're currently reading, and where things stand on your account.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={BookOpen}
            label="Available Books"
            value={loading ? "—" : availableCount}
            tone="available"
          />
          <StatCard
            icon={BookMarked}
            label="Borrowed Books"
            value={loading ? "—" : activeBorrows.length}
            tone="borrowed"
            hint={!loading && borrowRecords.length > 0 ? `${borrowRecords.length} total, all-time` : undefined}
          />
          <StatCard
            icon={Wallet}
            label="Total Fine"
            value={loading ? "—" : `₹${totalFine}`}
            tone="fine"
            hint={!loading && totalFine > 0 ? "Return overdue books to stop it growing" : undefined}
          />
        </section>

        {/* Books */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Browse the catalog</h2>
            <span className="text-sm text-ink-faint">{books.length} titles</span>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
              {error}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="glass-card aspect-[3/4] animate-pulse" />
                ))
              : books.map((book) => (
                  <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
                ))}
          </div>

          {!loading && books.length === 0 && !error && (
            <p className="mt-10 text-center text-sm text-ink-faint">
              No books in the catalog yet — check back soon.
            </p>
          )}
        </section>
      </main>

      <Footer />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
