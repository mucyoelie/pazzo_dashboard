import React, { useState } from "react";
import {
  Home,
  Monitor,
  Box,
  GitBranch,
  Mail,
  Star,
  Menu,
  X,
  Sparkles,
  LogOut
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  onToggle3D?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle3D }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { name: "Dashboard", icon: <Home size={20} />, href: "/dashboard" },
    { name: "About", icon: <Monitor size={20} />, href: "/dashboard/about" },
    { name: "Projects", icon: <Box size={20} />, href: "/dashboard/projects" },
    { name: "Skills", icon: <GitBranch size={20} />, href: "/dashboard/skills" },
    { name: "Experience", icon: <Star size={20} />, href: "/dashboard/experiences" },
    { name: "Contact", icon: <Mail size={20} />, href: "/dashboard/contact" },
  ];

  const handleLogout = () => {
    // Clear token or auth info (if stored)
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-200 dark:bg-slate-700/50 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 bg-slate-50 dark:text-white
        w-64 lg:w-64 flex flex-col shadow-2xl
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-slate-300 dark:border-slate-500">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg ring-4 ring-slate-300 dark:ring-slate-700 overflow-hidden">
              <img
                src="/logo.jpeg"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-bold text-lg text-center">MufasaopenUpsandLogs</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
              Admin
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive ? "bg-gradient-to-r from-orange-600 to-orange-500 shadow-lg text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700/50"}`
              }
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Controls */}
        <div className="flex flex-col gap-2 py-4 px-4 border-t border-slate-300 dark:border-slate-700">
          {onToggle3D && (
            <button
              onClick={onToggle3D}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-gray-600 transition-all duration-200 mb-2"
            >
              <Sparkles size={22} />
            </button>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-600 transition-all duration-200 text-red-600 dark:text-red-400 dark:hover:bg-red-700 font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
