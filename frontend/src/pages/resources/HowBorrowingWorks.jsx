import { useEffect, useState } from "react";
import { BookOpen, Clock, CheckCircle2, RotateCcw } from "lucide-react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const STEPS = [
  {
    icon: BookOpen,
    title: "Find a book",
    body: "Search or filter the catalog in Browse. Books marked \"Available\" are ready to borrow right away.",
  },
  {
    icon: CheckCircle2,
    title: "Borrow it",
    body: "Press Borrow on any available book. It's added to your account instantly and marked unavailable for other students.",
  },
  {
    icon: Clock,
    title: "Track it",
    body: "Check My Borrowings any time to see what you currently have, when you borrowed it, and whether a fine applies.",
  },
  {
    icon: RotateCcw,
    title: "Return it",
    body: "Return the physical copy at the front desk. Your librarian marks it returned and it becomes available again.",
  },
];

export default function HowBorrowingWorks() {
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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How borrowing works
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            Four simple steps from finding a title to returning it.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          {STEPS.map((step, i) => (
            <div key={step.title} className="glass-card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-deep shadow-glow-sm">
                <step.icon size={18} className="text-white" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-violet-soft">Step {i + 1}</p>
                <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">{step.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
