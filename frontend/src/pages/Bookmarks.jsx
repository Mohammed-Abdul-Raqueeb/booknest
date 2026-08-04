import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import Toast from "../components/Toast";
import API from "../api/api";

const BOOKMARKS_KEY = "bookmarkedBooks";

export default function Bookmarks() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) setStudent(JSON.parse(stored));

    const saved = localStorage.getItem(BOOKMARKS_KEY);
    setBookmarks(saved ? JSON.parse(saved) : []);
  }, []);

  function handleRemove(book) {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== book.id);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
      return next;
    });
  }

  async function handleBorrow(bookId) {
    if (!student?.id) {
      setError("You need to be logged in to borrow a book.");
      return;
    }
    try {
      const book = bookmarks.find((b) => b.id === bookId);
      await API.post(`/borrow/${student.id}/${bookId}`);
      setBookmarks((prev) => {
        const next = prev.map((b) => (b.id === bookId ? { ...b, available: false } : b));
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
        return next;
      });
      setToast(book ? `Borrowed "${book.title}"` : "Book borrowed successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't borrow this book. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} bookmarkCount={bookmarks.length} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Bookmarks</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Books you've saved for later. Stored on this device.
          </p>
        </section>

        {error && (
          <p className="mt-6 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
            {error}
          </p>
        )}

        <section className="mt-8">
          {bookmarks.length === 0 ? (
            <div className="glass-card flex flex-col items-center gap-2 py-16 text-center">
              <Bookmark size={28} className="text-ink-faint" />
              <p className="text-sm text-ink-muted">No bookmarks yet.</p>
              <p className="text-xs text-ink-faint">Tap the bookmark icon on any book in Browse to save it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {bookmarks.map((book) => (
                <BookCard key={book.id} book={book} onBorrow={handleBorrow} onToggleBookmark={handleRemove} isBookmarked />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
