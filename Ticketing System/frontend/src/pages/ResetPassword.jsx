import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { ToastError, ToastSuccess } from "../components/toastify";
import { resetPasswordAPI } from "../../services/allAPI";

export default function ResetPassword() {
  const location = useLocation();
  const email = location.state?.email || sessionStorage.getItem("resetEmail");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
    ToastError("Session expired. Please try again");
    navigate("/forgot-password");
    return;
  }

    if (!form.password || !form.confirmPassword) {
      ToastError("Fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      ToastError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await resetPasswordAPI({
        email,
        newPassword: form.password,
      });

      if (result.status === 200) {
        ToastSuccess("Password reset successful");
        sessionStorage.removeItem("resetEmail");
        navigate("/login");
      } else {
        ToastError(result?.data?.message);
      }
    } catch (err) {
      ToastError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
       <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 text-sm">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-md mb-3">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 4h.01M5.07 5.07a10 10 0 0113.86 0M7.05 7.05a7 7 0 019.9 0M9.03 9.03a4 4 0 015.66 0" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Ticketing Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Set your new password
          </p>
        </div>

  
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Reset Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full border border-slate-200 bg-slate-50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />
              Show Password
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg flex justify-center items-center gap-2 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75"/>
                  </svg>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
            
            <p className="text-center text-xs text-slate-500">
              Go back to{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
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
    </div>
  );
}