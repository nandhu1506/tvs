import { useEffect, useState, useRef } from "react";
import { IconBell, IconMenu } from "./Icons";
import { useNavigate } from "react-router-dom";
import { changePasswordAPI } from "../../services/allAPI";
import { ToastSuccess, ToastWarning, ToastError } from "./toastify";

export default function Header({ toogleSidebar }) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (sessionStorage.getItem("token") && sessionStorage.getItem("user")) {
      setToken(sessionStorage.getItem("token"));
      setUser(JSON.parse(sessionStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
      if (passwordModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setPasswordModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, passwordModal]);

  const handleLogout = () => {
    sessionStorage.clear();
    setToken("");
    setOpenDropdown(false);
    navigate("/");
    ToastSuccess("Logged out successfully");  
  };

  const handleChangePassword = async () => {  
    if (!oldPassword || !newPassword) {
      ToastWarning("Please enter both old and new passwords");
      return;
    }

    if (!user?.id) {
      ToastWarning("User not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePasswordAPI({
        userId: user.id,
        oldPassword,
        newPassword,
      });

      if (response?.data?.success) {
        ToastSuccess("Password changed successfully!");
        setPasswordModal(false);
        setOpenDropdown(false);
        setOldPassword("");
        setNewPassword("");
      } else {
        ToastError(response?.data?.message || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      ToastError("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="h-14 bg-blue-700 flex w-full items-center justify-between px-5 shadow-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={toogleSidebar}
          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <IconMenu />
        </button>
        <span className="text-white font-semibold tracking-wide text-sm">TVS</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-white hover:text-blue-200 transition-colors">
          <IconBell />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full border border-blue-700" />
        </button>

        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 text-white cursor-pointer"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-sm font-medium hidden sm:block"> {user?.username||"user"} </span>
          </div>
      

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 text-gray-800">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => setPasswordModal(true)}
              >
                Change Password
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {passwordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-4 rounded-md w-80" ref={modalRef}>
              <h2 className="font-bold mb-2">Change Password</h2>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border p-2 w-full mb-2 rounded-2xl"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 w-full mb-2 rounded-2xl"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setPasswordModal(false);
                    setOpenDropdown(false);
                  }}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}