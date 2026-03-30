import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ToastError, ToastSuccess } from "../components/toastify";
import { verifyOtpAPI } from "../../services/allAPI";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      ToastError("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const result = await verifyOtpAPI({ email, otp });

      if (result.status === 200) {
        ToastSuccess("OTP verified");
        sessionStorage.setItem("resetEmail", email);
        navigate("/reset-password");
      } else {
        ToastError(result?.data?.message || "Invalid OTP");
      }
    } catch (err) {
      ToastError(err.response?.data?.message || "Verification failed");
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
            <span className="text-white font-bold">OTP</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Ticketing Portal</h1>
          <p className="text-xs text-slate-400 mt-1">
            Enter OTP sent to your email
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-sm font-bold text-white">Verify OTP</h2>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-5">

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center tracking-widest border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
            />

            <button
              disabled={loading}
              className={`bg-blue-600 text-white py-2.5 rounded-lg ${
                loading ? "opacity-60" : "hover:bg-blue-700"
              }`}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <p className="text-center text-xs">
              <Link to="/forgot-password" className="text-blue-600">
                Change Email
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}