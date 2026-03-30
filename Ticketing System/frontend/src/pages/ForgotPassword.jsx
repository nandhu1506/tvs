import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastError, ToastSuccess } from "../components/toastify";
import { forgotPasswordAPI } from "../../services/allAPI";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email) {
    ToastError("Please enter your email");
    return;
  }

  try {
    setLoading(true);

    const result = await forgotPasswordAPI({ email });

    if (result.status === 200) {
      ToastSuccess("OTP sent to email");
      navigate("/verify-otp", { state: { email } });
    } else {
      ToastError(result?.data?.message || "Failed to send OTP");
    }
  } catch (err) {
    ToastError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 text-sm">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3m-6 0a3 3 0 110-6 3 3 0 010 6zm0 0v1m6-1v1m-6 4h6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Ticketing Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter your email to reset password
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Forgot Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Reset Otp"
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </p>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-5">
          &copy; TVS Automobile Solutions Private Limited {new Date().getFullYear()} . All rights reserved.
        </p>

      </div>
    </div>
  );
}