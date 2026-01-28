import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

interface LoginResponse {
  token?: string;
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://pazzo-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

    navigate("/dashboard");
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-8">
              <div
                   className="w-10 h-10 rounded-lg bg-cover bg-center bg-[url('/logo.jpeg')]"
               ></div>
              <span className="text-white text-xl font-bold">MufasaopenUps&Logs</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
              Admin Login
            </h1>
            <p className="text-gray-400 text-lg">
              Enter your admin credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 placeholder-gray-500"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-500 placeholder-gray-500"
                  placeholder="Enter admin password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 group shadow-lg shadow-cyan-500/20"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center">
              Admin access only — Unauthorized use prohibited
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Visual */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center bg-[url('/logo.jpeg')] items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Secure Admin Access
          </h2>
          <p className="text-xl text-white/90 leading-relaxed">
            High-security authentication system for system administrators.
          </p>

          <div className="space-y-4 mt-12 text-gray-900">
            {[
              "Admin-only restricted access",
              "Protected authentication gateway",
              "Encrypted session handling",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-gray-900 font-bold text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
