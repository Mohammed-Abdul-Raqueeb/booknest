import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function Terms() {
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
          Terms of service
        </h1>
        <p className="mt-2 text-sm text-ink-faint">Last updated {new Date().toLocaleDateString()}</p>

        <div className="glass-card mt-8 space-y-6 p-6 sm:p-8">
          <PolicySection title="Your account">
            You're responsible for keeping your login credentials to yourself and for activity on your account,
            including books borrowed under it.
          </PolicySection>
          <PolicySection title="Borrowing">
            Borrowing a book reserves the physical copy under your name. Return it on time — late returns may carry
            a fine, shown on your dashboard.
          </PolicySection>
          <PolicySection title="Fair use">
            The catalog is shared by every student. Please don't attempt to borrow on another student's behalf or
            interfere with another student's access to a title.
          </PolicySection>
          <PolicySection title="Changes">
            These terms may be updated from time to time. Continued use of the system means you accept the current
            version.
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
