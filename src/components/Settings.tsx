// Settings.tsx
import React, { useState } from "react";
import axios from "axios";

const Settings: React.FC = () => {
  const [email, setEmail] = useState("developerfrontend84@gmail.com"); // admin email
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post("/api/admin/reset-password", {
        email,
        newPassword,
      });
      setMessage(res.data.message);
      setNewPassword("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled // optional: admin email fixed
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading || !newPassword}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
};

export default Settings;
