import { useState } from "react";
import { BriefcaseBusiness, LockKeyhole, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!username.trim()) {
      setError("لطفاً نام کاربری را وارد کنید.");
      return;
    }

    if (!password) {
      setError("لطفاً رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-4"
    >
      <div className="w-full max-w-105 rounded-2xl border border-[#e8e1d7] bg-white p-6 shadow-[0_24px_80px_rgba(43,33,22,0.12)] sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-[#b48634] text-white shadow-sm">
            <BriefcaseBusiness className="size-6" />
          </div>

          <h1 className="text-lg font-extrabold text-[#3f3932]">
            ورود به دیبا بانک
          </h1>

          <p className="mt-2 text-[11px] text-[#9b948a]">
            برای ورود به پنل مدیریت ارتباطات وارد شوید
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
              نام کاربری
            </span>

            <div className="relative">
              <UserRound className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />

              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setError("");
                }}
                placeholder="نام کاربری خود را وارد کنید"
                className="field-input pr-10"
                autoComplete="username"
                style={{ paddingRight: "32px" }}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-[11px] font-semibold text-[#4d463e]">
              رمز عبور
            </span>

            <div className="relative">
              <LockKeyhole className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#a29a90]" />

              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="رمز عبور خود را وارد کنید"
                className="field-input pr-10"
                autoComplete="current-password"
                style={{ paddingRight: "32px" }}
              />
            </div>
          </label>

          {error && (
            <p className="text-[10px] font-medium text-[#c35a52]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#b48634] text-xs font-semibold text-white shadow-sm transition hover:bg-[#a4772b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود به پنل"}
          </button>
        </form>
      </div>
    </div>
  );
}
