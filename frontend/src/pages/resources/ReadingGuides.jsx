import { useEffect, useState } from "react";
import { Compass, Clock3, Flame, BookMarked } from "lucide-react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const GUIDES = [
  {
    icon: Compass,
    title: "Where to start",
    body: "New here? Browse by category first, then narrow with search once you know what you're after.",
  },
  {
    icon: Clock3,
    title: "Building a reading habit",
    body: "Borrow one book at a time and finish it before picking up the next — it keeps your fines at zero and your shelf honest.",
  },
  {
    icon: Flame,
    title: "Popular categories",
    body: "Categories shown in Browse reflect what's actually in the catalog right now, so the filter list changes as new titles arrive.",
  },
  {
    icon: BookMarked,
    title: "Using bookmarks well",
    body: "Bookmark anything you're curious about but not ready to borrow yet — it's saved on this device under Bookmarks.",
  },
];

export default function ReadingGuides() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) setStudent(JSON.parse(stored));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(true)} user={{ name: student?.name || "Student" }} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="animate-fade-in-up">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Reading guides</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            A few pointers for getting the most out of the catalog.
          </p>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <div key={g.title} className="glass-card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/15 ring-1 ring-inset ring-violet/30">
                <g.icon size={17} className="text-violet-soft" />
              </span>
              <h2 className="mt-3 font-display text-base font-semibold text-ink">{g.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{g.body}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
