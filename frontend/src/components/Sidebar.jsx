import { Link, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Compass,
  BookMarked,
  Bookmark,
  User,
  LibraryBig,
  HelpCircle,
} from "lucide-react";

const LINKS = [
  { label: "Home", to: "/student", icon: Home },
  { label: "Browse", to: "/browse", icon: Compass },
  { label: "My borrowings", to: "/borrowings", icon: BookMarked },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Help center", to: "/resources/help", icon: HelpCircle },
];

/**
 * Slide-in mobile navigation drawer, driven by the Navbar hamburger button.
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */
export default function Sidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col glass-panel border-y-0 border-l-0
          shadow-glow-lg transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-deep shadow-glow-sm">
              <LibraryBig size={18} className="text-white" />
            </span>
            <span className="font-display text-lg font-semibold text-ink">Library System</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {LINKS.map(({ label, to, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-violet/15 text-ink ring-1 ring-inset ring-violet/30"
                    : "text-ink-muted hover:bg-white/[0.06] hover:text-ink"
                }`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-5 text-xs text-ink-faint">
          © {new Date().getFullYear()} Library System
        </div>
      </aside>
    </>
  );
}
