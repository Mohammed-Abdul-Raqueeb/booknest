import { Link } from "react-router-dom";
import { LibraryBig, Mail, Globe } from "lucide-react";

const EXPLORE_LINKS = [
  { label: "Home", to: "/student" },
  { label: "Browse Books", to: "/browse" },
  { label: "My Borrowings", to: "/borrowings" },
  { label: "Bookmarks", to: "/bookmarks" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Contact Us", to: "/contact" },
];

const SOCIAL_LINKS = [
  {
    label: "Website",
    href: "https://example.com",
    icon: Globe,
  },
  {
    label: "Email",
    href: "mailto:hello@library.system",
    icon: Mail,
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.06]">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">

            <Link
              to="/student"
              className="flex items-center gap-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet to-violet-deep">
                <LibraryBig size={15} className="text-white" />
              </span>

              <span className="font-display text-sm font-semibold text-ink">
                Library System
              </span>
            </Link>


            <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-ink-faint">
              Every book you need, in one place.
            </p>

          </div>


          {/* Explore */}
          <div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Explore
            </h3>

            <ul className="mt-3 space-y-2">

              {EXPLORE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-faint transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>

          </div>


          {/* Legal */}
          <div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Legal
            </h3>

            <ul className="mt-3 space-y-2">

              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-faint transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

            </ul>

          </div>


          {/* Social */}
          <div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Connect
            </h3>


            <div className="mt-3 flex gap-2">

              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => {

                const isMail = href.startsWith("mailto:");

                return (
                  <a
                    key={label}
                    href={href}
                    {...(!isMail && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ink-faint transition-colors hover:border-violet/40 hover:text-ink"
                  >
                    <Icon size={15} />
                  </a>
                );

              })}

            </div>

          </div>

        </div>


        <div className="mt-10 border-t border-white/[0.06] pt-6 text-center text-xs text-ink-faint sm:text-left">
          © {new Date().getFullYear()} Library System. Built for readers.
        </div>


      </div>
    </footer>
  );
}