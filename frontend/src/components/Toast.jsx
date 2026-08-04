import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

/**
 * Small auto-dismissing toast, used for "Borrowed successfully" style feedback.
 *
 * Props:
 * - message: string | null   -> toast is hidden when null/empty
 * - tone?: "success" | "error"
 * - onDone: () => void       -> called when the toast finishes (dismiss + auto-timeout)
 * - duration?: number        -> ms before auto-dismiss (default 3000)
 */
export default function Toast({ message, tone = "success", onDone, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onDone, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone]);

  if (!message) return null;

  const isSuccess = tone === "success";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div
        className={`glass-card pointer-events-auto flex items-center gap-2.5 px-4 py-3 shadow-glow-lg animate-fade-in-up ${
          isSuccess ? "ring-1 ring-inset ring-signal-available/30" : "ring-1 ring-inset ring-signal-fine/30"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={18} className="shrink-0 text-signal-available" />
        ) : (
          <XCircle size={18} className="shrink-0 text-signal-fine" />
        )}
        <span className="text-sm font-medium text-ink">{message}</span>
      </div>
    </div>
  );
}
