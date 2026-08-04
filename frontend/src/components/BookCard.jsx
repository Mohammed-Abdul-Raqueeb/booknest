import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Bookmark, Loader2, CheckCircle2, XCircle, Star } from "lucide-react";

/**
 * Professional book card used on the Dashboard, Browse, and Bookmarks pages.
 *
 * Props:
 * - book: { id, title, author, category, available, coverImage?, rating? }
 * - onBorrow?: (bookId) => Promise<void> | void
 * - onToggleBookmark?: (book) => void
 * - isBookmarked?: boolean
 */
export default function BookCard({ book, onBorrow, onToggleBookmark, isBookmarked = false }) {
  const [borrowing, setBorrowing] = useState(false);
  const { id, title, author, category, available, coverImage, rating } = book;

  async function handleBorrow() {
    if (!onBorrow || borrowing || !available) return;
    try {
      setBorrowing(true);
      await onBorrow(id);
    } finally {
      setBorrowing(false);
    }
  }

  // deterministic placeholder gradient so covers without an image still look distinct
  const hue = ((title || "?").split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 37) % 360;

  return (
    <div className="group glass-card relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-violet/30 hover:shadow-glow-sm">
      {/* Cover */}
      <Link to={`/books/${id}`} className="relative block aspect-[3/4] w-full overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, hsl(${hue} 60% 22%), hsl(${(hue + 40) % 360} 55% 12%))`,
            }}
          >
            <BookOpen size={28} className="text-white/70" />
          </div>
        )}

        {onToggleBookmark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleBookmark(book);
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
              isBookmarked
                ? "bg-violet text-white"
                : "bg-black/40 text-white/80 hover:bg-black/60"
            }`}
          >
            <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
        )}

        <span
          className={`badge absolute left-2 top-2 backdrop-blur-md ${
            available
              ? "bg-signal-available/15 text-signal-available ring-1 ring-inset ring-signal-available/30"
              : "bg-signal-fine/15 text-signal-fine ring-1 ring-inset ring-signal-fine/30"
          }`}
        >
          {available ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
          {available ? "Available" : "Checked out"}
        </span>

        {typeof rating === "number" && (
          <span className="badge absolute bottom-2 right-2 bg-black/50 text-white backdrop-blur-md">
            <Star size={10} className="fill-signal-borrowed text-signal-borrowed" />
            {rating.toFixed(1)}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        {category && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-violet-soft">
            {category}
          </span>
        )}
        <Link to={`/books/${id}`} className="line-clamp-2 font-display text-sm font-semibold leading-snug text-ink hover:text-violet-soft">
          {title}
        </Link>
        {author && <p className="truncate text-xs text-ink-faint">{author}</p>}

        <button
          onClick={handleBorrow}
          disabled={!available || borrowing}
          className="btn-primary mt-2 w-full !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {borrowing ? (
            <Loader2 size={14} className="animate-spin" />
          ) : available ? (
            "Borrow"
          ) : (
            "Checked out"
          )}
        </button>
      </div>
    </div>
  );
}
