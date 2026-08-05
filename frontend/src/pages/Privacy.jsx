import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Privacy() {
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

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="animate-fade-in-up font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Privacy policy
        </h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated {new Date().toLocaleDateString()}</p>

        <div className="glass-card mt-8 space-y-6 p-6 sm:p-8">
          <PolicySection title="What we store">
            Your name, email, and student ID are stored by the BookNest to run your account — sign you in,
            show your borrowing history, and let you reserve books.
          </PolicySection>
          <PolicySection title="Bookmarks stay local">
            Bookmarked books are saved only in this browser's local storage. They're never sent to the library
            server and clearing your browser data removes them.
          </PolicySection>
          <PolicySection title="Who can see your borrowing history">
            Only you and library staff can see which books you've borrowed and any fines on your account.
          </PolicySection>
          <PolicySection title="Questions">
            Reach out through the Contact page for anything not covered here.
          </PolicySection>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PolicySection({ title, children }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{children}</p>
    </div>
  );
}
