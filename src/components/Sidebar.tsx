import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CreditCard,
  ScrollText,
  Settings,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
}

interface SidebarProps {
  onToggle3D?: () => void;
}

const navItems: NavItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
  { name: "Open Ups", icon: <FolderOpen size={20} />, href: "/dashboard/open-ups-list" },
  { name: "CC Products", icon: <CreditCard size={20} />, href: "/dashboard/projects" },
  { name: "Logs Products", icon: <ScrollText size={20} />, href: "/dashboard/skills" },
  { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/experiences" },
  { name: "Contact", icon: <MessageSquare size={20} />, href: "/dashboard/contact" },
];

const Sidebar: React.FC<SidebarProps> = ({ onToggle3D }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Dashboard default

  const navigate = useNavigate();
  const location = useLocation();

  // Compute active tab safely (no warnings)
  const activeRouteIndex = React.useMemo(() => {
    const index = navItems.findIndex((item) => item.href === location.pathname);
    return index !== -1 ? index : 0; // Default Dashboard
  }, [location.pathname]);

  // Update activeIndex when URL changes
  useEffect(() => {
    setActiveIndex(activeRouteIndex);
  }, [activeRouteIndex]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setIsOpen(false);
  };

  const handleNavClick = (href: string, index: number) => {
    navigate(href);
    setActiveIndex(index);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X size={24} className="text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu size={24} className="text-gray-700 dark:text-gray-200" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 
        bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
        w-56 flex flex-col shadow-2xl border-r border-gray-200 dark:border-slate-700
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 p-0.5 overflow-hidden">
                  <img
                    src="/logo.jpeg"
                    alt="Admin Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-slate-800 shadow-md"></div>
            </div>

            <h2 className="font-bold text-xl text-gray-900 dark:text-white text-center leading-tight">
              Mufasa Admin
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1.5">
              <User size={14} />
              Administrator
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item, index) => {
            const isActive = index === activeIndex;
            const isHovered = index === hoveredIndex;

            return (
              <button
                key={item.name}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleNavClick(item.href, index)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${
                    isActive && !isHovered
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-400/30"
                      : isHovered
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-400/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white"
                  }
                `}
              >
                <span className={`transition-all duration-200 ${isHovered ? "scale-110" : ""}`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 space-y-2">
          {onToggle3D && (
            <button
              onClick={onToggle3D}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                bg-gradient-to-r from-purple-500 to-indigo-600 text-white
                hover:from-purple-600 hover:to-indigo-700 
                transition-all duration-200 shadow-lg shadow-purple-500/30 hover:shadow-xl
                font-medium text-sm"
            >
              <Sparkles size={18} />
              Toggle 3D
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              bg-gray-100 dark:bg-slate-800 text-red-600 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md
              transition-all duration-200 font-medium text-sm border border-transparent
              hover:border-red-200 dark:hover:border-red-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
