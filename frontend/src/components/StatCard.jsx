/**
 * Reusable dashboard stat card.
 *
 * Props:
 * - icon: React component (e.g. from lucide-react)
 * - label: string        -> e.g. "Available Books"
 * - value: string|number -> e.g. 128 or "₹45"
 * - tone?: "violet" | "available" | "borrowed" | "fine"  -> accent color
 * - hint?: string         -> small supporting line, optional
 */
const TONES = {
  violet: {
    ring: "from-violet to-violet-deep",
    glow: "shadow-glow-sm group-hover:shadow-glow",
    text: "text-violet-soft",
  },
  available: {
    ring: "from-signal-available to-emerald-700",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.18)] group-hover:shadow-[0_0_40px_rgba(52,211,153,0.28)]",
    text: "text-signal-available",
  },
  borrowed: {
    ring: "from-signal-borrowed to-amber-700",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.18)] group-hover:shadow-[0_0_40px_rgba(251,191,36,0.28)]",
    text: "text-signal-borrowed",
  },
  fine: {
    ring: "from-signal-fine to-rose-700",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.18)] group-hover:shadow-[0_0_40px_rgba(251,113,133,0.28)]",
    text: "text-signal-fine",
  },
};

export default function StatCard({ icon: Icon, label, value, tone = "violet", hint }) {
  const t = TONES[tone] ?? TONES.violet;

  return (
    <div
      className="group glass-card relative overflow-hidden p-5 transition-all duration-300
        hover:-translate-y-1 hover:border-violet/30"
    >
      {/* ambient corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet/10 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-muted">{label}</p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-ink">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.ring} ${t.glow} transition-shadow duration-300`}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}
