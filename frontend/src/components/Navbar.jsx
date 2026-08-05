import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bookmark,
  ChevronDown,
  User,
  LogOut,
  BookMarked,
  LibraryBig,
} from "lucide-react";

/**
 * Site navbar.
 *
 * Props:
 * - onMenuClick: () => void        -> toggles the Sidebar drawer (hamburger button)
 * - user: { name: string }         -> currently logged-in student, shown in the profile section
 * - bookmarkCount?: number         -> badge count on the bookmarks button
 * - onSearch?: (query: string) => void  -> called in addition to navigating, useful when already on /browse
 * - onLogout?: () => void
 */
export default function Navbar({ onMenuClick, user, bookmarkCount = 0, onSearch, onLogout }) {
  const [query, setQuery] = useState("");
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const resourcesRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    onSearch?.(trimmed);
    // works from any page: search always lands on Browse with the term applied
    navigate(trimmed ? `/browse?q=${encodeURIComponent(trimmed)}` : "/browse");
    setMobileSearchOpen(false);
  }

  function handleLogout() {
    setProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("student");
      navigate("/");
    }
  }

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full">
      <nav className="glass-panel border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-3 sm:px-4 lg:px-6">
          {/* Left zone: hamburger + logo + branding */}
          <div className="flex min-w-0 items-center gap-2">
            <button
              onClick={() => {
                console.log("MENU CLICKED");
                onMenuClick();
              }}
              aria-label="Toggle menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-ink-muted
                transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <Menu size={20} />
            </button>

            <Link
              to="/student"
              className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 transition-opacity hover:opacity-85"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-deep shadow-glow-sm">
                <LibraryBig size={18} className="text-white" />
              </span>
              <span className="hidden truncate font-display text-lg font-semibold tracking-tight text-ink sm:block">
                BookNest
              </span>
            </Link>
          </div>

          {/* Center zone: primary nav (collapses away below lg, use Sidebar on mobile) */}
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            <Link
              to="/student"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              Browse
            </Link>

            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setResourcesOpen((v) => !v)}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted
                  transition-colors hover:bg-white/[0.06] hover:text-ink"
                aria-expanded={resourcesOpen}
              >
                Resources
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                />
              </button>

              {resourcesOpen && (
                <div
                  className="glass-card absolute left-1/2 top-[calc(100%+8px)] w-56 -translate-x-1/2 overflow-hidden
                    p-1.5 shadow-glow-sm animate-fade-in-up"
                >
                  {[
                    { label: "How borrowing works", to: "/resources/how-borrowing-works" },
                    { label: "Reading guides", to: "/resources/reading-guides" },
                    { label: "Help center", to: "/resources/help" },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setResourcesOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right zone: search + bookmarks + profile */}
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {/* Desktop search */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 md:flex"
            >
              <Search size={16} className="shrink-0 text-ink-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, authors..."
                className="w-40 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none lg:w-56"
              />
            </form>

            {/* Mobile search toggle */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink md:hidden"
            >
              <Search size={18} />
            </button>

            <Link
              to="/bookmarks"
              aria-label="Bookmarks"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
            >
              <Bookmark size={18} />
              {bookmarkCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet px-1 text-[10px] font-semibold text-white">
                  {bookmarkCount > 9 ? "9+" : bookmarkCount}
                </span>
              )}
            </Link>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-2.5
                  transition-colors hover:border-violet/40"
                aria-expanded={profileOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-deep text-xs font-semibold text-white">
                  {initials}
                </span>
                <span className="hidden max-w-[9rem] truncate text-sm font-medium text-ink sm:block">
                  {user?.name || "Student"}
                </span>
                <ChevronDown
                  size={14}
                  className={`hidden text-ink-faint transition-transform duration-200 sm:block ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {profileOpen && (
                <div className="glass-card absolute right-0 top-[calc(100%+8px)] w-48 overflow-hidden p-1.5 shadow-glow-sm animate-fade-in-up">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <Link
                    to="/borrowings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
                  >
                    <BookMarked size={15} /> My borrowed books
                  </Link>
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-signal-fine transition-colors hover:bg-signal-fine/10"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search row */}
        {mobileSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 border-t border-white/10 px-3 py-3 md:hidden"
          >
            <Search size={16} className="shrink-0 text-ink-faint" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, authors..."
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </form>
        )}
      </nav>
    </header>
  );
}
