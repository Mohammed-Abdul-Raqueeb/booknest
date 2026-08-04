import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, ArrowDownUp } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import Toast from "../components/Toast";
import API from "../api/api";

const BOOKMARKS_KEY = "bookmarkedBooks";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [bookmarkIds, setBookmarkIds] = useState(new Set());

  // keep the URL in sync so the search bar's link to /browse?q=... always works,
  // and the field reflects a new ?q= if the user searches again from another page
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  function handleQueryChange(value) {
    setQuery(value);
    setSearchParams(value ? { q: value } : {});
  }

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) setStudent(JSON.parse(stored));

    const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    if (savedBookmarks) {
      const parsed = JSON.parse(savedBookmarks);
      setBookmarkIds(new Set(parsed.map((b) => b.id)));
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await API.get("/books");
        if (!cancelled) setBooks(res.data || []);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Couldn't load the book catalog.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(books.map((b) => b.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const filtered = books.filter((b) => {
      const matchesQuery =
        !query ||
        b.title?.toLowerCase().includes(query.toLowerCase()) ||
        b.author?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "All" || b.category === category;
      return matchesQuery && matchesCategory;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "author":
        sorted.sort((a, b) => (a.author || "").localeCompare(b.author || ""));
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      case "availability":
        sorted.sort((a, b) => Number(b.available) - Number(a.available));
        break;
      case "title":
      default:
        sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
    }
    return sorted;
  }, [books, query, category, sortBy]);

  async function handleBorrow(bookId) {
    if (!student?.id) {
      setError("You need to be logged in to borrow a book.");
      return;
    }
    try {
      const book = books.find((b) => b.id === bookId);
      await API.post(`/borrow/${student.id}/${bookId}`);
      setBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, available: false } : b)));
      setToast(book ? `Borrowed "${book.title}"` : "Book borrowed successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't borrow this book. Please try again.");
    }
  }

  function handleToggleBookmark(book) {
    setBookmarkIds((prev) => {
      const next = new Set(prev);
      const saved = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");

      if (next.has(book.id)) {
        next.delete(book.id);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(saved.filter((b) => b.id !== book.id)));
      } else {
        next.add(book.id);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([...saved, book]));
      }
      return next;
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} onSearch={handleQueryChange} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Browse the catalog</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
            Search by title or author, filter by category, and borrow anything that's available.
          </p>
        </section>

        {/* Filters */}
        <section className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <SearchIcon size={16} className="shrink-0 text-ink-faint" />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search titles, authors..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <SlidersHorizontal size={15} className="hidden shrink-0 text-ink-faint sm:block" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === c
                    ? "bg-violet/20 text-violet-soft ring-1 ring-inset ring-violet/40"
                    : "bg-white/[0.03] text-ink-muted hover:bg-white/[0.06] hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <ArrowDownUp size={14} className="shrink-0 text-ink-faint" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-medium text-ink-muted focus:outline-none [&>option]:bg-surface"
            >
              <option value="title">Sort: Title</option>
              <option value="author">Sort: Author</option>
              <option value="rating">Sort: Rating</option>
              <option value="availability">Sort: Availability</option>
            </select>
          </div>
        </section>

        {error && (
          <p className="mt-6 rounded-lg bg-signal-fine/10 px-4 py-3 text-sm text-signal-fine ring-1 ring-inset ring-signal-fine/30">
            {error}
          </p>
        )}

        {/* Grid */}
        <section className="mt-6">
          <div className="mb-4 text-sm text-ink-faint">{loading ? "Loading titles…" : `${filteredBooks.length} titles`}</div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="glass-card aspect-[3/4] animate-pulse" />)
              : filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={handleBorrow}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarkIds.has(book.id)}
                  />
                ))}
          </div>

          {!loading && filteredBooks.length === 0 && (
            <div className="mt-16 flex flex-col items-center text-center">
              <p className="text-sm text-ink-muted">No books match your search.</p>
              <p className="mt-1 text-xs text-ink-faint">Try a different title, author, or category.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
