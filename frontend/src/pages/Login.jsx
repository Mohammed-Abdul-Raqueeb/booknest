import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LibraryBig,
  Mail,
  Lock,
  User2,
  AtSign,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import API from "../api/api";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    identifier: "",
  });

  const navigate = useNavigate();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res =
        mode === "login"
          ? await API.post("/api/students/login", {
              identifier: form.identifier,
              password: form.password,
            })
          : await API.post("/api/students/register", {
              fullName: form.fullName,
              username: form.username,
              email: form.email,
              password: form.password,
            });

      const user = res.data;

      localStorage.setItem("student", JSON.stringify(user));

      navigate(user.role === "ADMIN" ? "/admin" : "/dashboard");

    } catch (err) {
      const data = err?.response?.data;

      const message =
        data?.message ||
        (data?.fieldErrors &&
          Object.values(data.fieldErrors)[0]) ||
        "Something went wrong. Please try again.";

      setError(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base px-4 py-10">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet/25 blur-[120px] animate-glow-pulse" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 h-80 rounded-full bg-violet-deep/25 blur-[120px] animate-glow-pulse" />

      <div className="glass-card relative grid w-full max-w-4xl overflow-hidden shadow-glow-lg lg:grid-cols-2">

        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-violet/15 via-transparent to-transparent p-10 lg:flex">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet to-violet-deep shadow-glow-sm">
              <LibraryBig size={20} className="text-white" />
            </span>

            <span className="font-display text-xl font-semibold text-ink">
              BookNest
            </span>
          </div>

          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink">
              Every book you
              <br />
              need, in one place.
            </h1>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
              Browse the catalog, track what you've borrowed, and pick up right where you left off.
            </p>
          </div>

          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} BookNest
          </p>
        </div>


        <div className="p-8 sm:p-10">

          <div className="mb-8 flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">

            {["login", "signup"].map((m) => (
  <button
    key={m}
    type="button"
    onClick={() => {
      setMode(m);
      setError("");

      setForm({
        fullName: "",
        username: "",
        email: "",
        password: "",
        identifier: "",
      });

      setShowPassword(false);
    }}
    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
      mode === m
        ? "bg-violet/20 text-ink"
        : "text-ink-faint hover:text-ink-muted"
    }`}
  >
    {m === "login" ? "Log in" : "Sign up"}
  </button>
))}
          </div>


          <h2 className="font-display text-2xl font-semibold text-ink">
            {mode === "login"
              ? "Welcome back"
              : "Create your account"}
          </h2>


          <p className="mt-1 text-sm text-ink-muted">
            {mode === "login"
              ? "Log in to continue to your dashboard."
              : "Join to start borrowing books."}
          </p>


          <form onSubmit={handleSubmit} className="mt-6 space-y-4">

            {mode === "signup" && (
              <>
                <Field
                  icon={User2}
                  type="text"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(v) => update("fullName", v)}
                  required
                />

                <Field
                  icon={AtSign}
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(v) => update("username", v.trim())}
                  required
                  minLength={3}
                />

                <Field
                  icon={Mail}
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  required
                />
              </>
            )}


            {mode === "login" && (
              <Field
                icon={AtSign}
                type="text"
                placeholder="Username or email"
                value={form.identifier}
                onChange={(v) => update("identifier", v)}
                required
              />
            )}


            <Field
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(v) => update("password", v)}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  className="text-ink-faint hover:text-ink-muted"
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              }
            />


            {error && (
              <p className="rounded-lg bg-signal-fine/10 px-3 py-2 text-sm text-signal-fine">
                {error}
              </p>
            )}


            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Log in"
                : "Create account"}

              {!loading && <ArrowRight size={16} />}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}


function Field({ icon: Icon, endAdornment, ...inputProps }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <Icon size={16} className="text-ink-faint" />

      <input
        {...inputProps}
        onChange={(e) =>
          inputProps.onChange(e.target.value)
        }
        className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
      />

      {endAdornment}
    </div>
  );
}