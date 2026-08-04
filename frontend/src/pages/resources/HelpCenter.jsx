import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Mail } from "lucide-react";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const FAQS = [
  {
    q: "How many books can I borrow at once?",
    a: "That's controlled by the library's backend policy, not this app — check My Borrowings to see everything currently on your account.",
  },
  {
    q: "Why is a book showing as unavailable?",
    a: "Another student currently has it borrowed. It'll flip back to available as soon as it's returned.",
  },
  {
    q: "Where do bookmarks get saved?",
    a: "On this device, in your browser's local storage. Clearing your browser data will clear them too.",
  },
  {
    q: "I forgot my password — what do I do?",
    a: "Reach out through Contact and a librarian can help reset your account.",
  },
];

export default function HelpCenter() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

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
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Help center</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
            Answers to the questions we hear most.
          </p>
        </section>

        <section className="mt-10 space-y-2">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-ink">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-ink-faint transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-muted">{item.a}</p>}
              </div>
            );
          })}
        </section>

        <section className="glass-card mt-8 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">Still stuck?</h2>
            <p className="mt-1 text-sm text-ink-muted">Send us a message and a librarian will follow up.</p>
          </div>
          <button onClick={() => navigate("/contact")} className="btn-primary shrink-0">
            <Mail size={15} /> Contact us
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
