import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64 overflow-auto">
        {/* This will render the currently selected route */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
