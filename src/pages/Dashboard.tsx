import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js"; // <-- type-only import
import { TrendingUp, Package, DollarSign, Activity } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ProductItem {
  _id: string;
  name: string;
  price: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  loading: boolean;
}

// StatCard declared outside of render
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, loading }) => (
  <div
    className={` dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900  bg-slate-50  p-6 rounded-xl shadow-lg hover:shadow-2xl dark:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 `}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="bg-white bg-opacity-20 p-3 rounded-lg">
        <Icon className="w-6 h-6 dark:text-gray-100 text-gray-900" />
      </div>
      <TrendingUp className="w-5 h-5 text-white opacity-60" />
    </div>
    <h3 className="dark:text-gray-100 text-gray-900 text-opacity-90 text-sm font-medium mb-1">{title}</h3>
    {loading ? (
      <div className="h-8 bg-white bg-opacity-20 rounded animate-pulse" />
    ) : (
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
    )}
  </div>
);

const Dashboard: React.FC = () => {
  const [ccsCount, setCcsCount] = useState(0);
  const [openUpsCount, setOpenUpsCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ccsRes, openUpsRes, logRes] = await Promise.all([
          axios.get("https://pazzo-backend.onrender.com/api/ccs"),
          axios.get("https://pazzo-backend.onrender.com/api/openups"),
          axios.get("https://pazzo-backend.onrender.com/api/firewalls"),
        ]);

        const ccsData: ProductItem[] = ccsRes.data;
        const openUpsData: ProductItem[] = openUpsRes.data;
        const logData: ProductItem[] = logRes.data;

        setCcsCount(ccsData.length);
        setOpenUpsCount(openUpsData.length);
        setLogCount(logData.length);

        const revenue =
          ccsData.reduce((sum, item) => sum + item.price, 0) +
          openUpsData.reduce((sum, item) => sum + item.price, 0) +
          logData.reduce((sum, item) => sum + item.price, 0);

        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const barData = {
    labels: ["CCS", "OpenUps", "LogItem"],
    datasets: [
      {
        label: "Number of Products",
        data: [ccsCount, openUpsCount, logCount],
        backgroundColor: ["#3B82F6", "#F59E0B", "#10B981"],
        borderColor: ["#3B82F6", "#F59E0B", "#10B981"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#E5E7EB",
          font: { size: 12 },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "#F9FAFB",
        bodyColor: "#E5E7EB",
        borderColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 12 } },
      },
      y: {
        grid: { color: "rgba(75, 85, 99, 0.3)" },
        ticks: { color: "#9CA3AF", font: { size: 12 } },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 p-4 sm:p-6 lg:p-8 ">
      <div className="max-w-8xl mx-auto dark:bg-gray-900 bg-gray-100">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold dark:text-gray-100 text-gray-900 mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text  ">
            Admin Dashboard
          </h1>
          <p className="text-gray-900 dark:text-gray-100">Welcome back! Here's your overview</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="CCS Products"
            value={ccsCount}
            icon={Package}
            gradient="from-blue-500 to-blue-600"
            loading={loading}
          />
          <StatCard
            title="OpenUps Products"
            value={openUpsCount}
            icon={Activity}
            gradient="from-amber-500 to-orange-600"
            loading={loading}
          />
          <StatCard
            title="Log Items"
            value={logCount}
            icon={Package}
            gradient="from-emerald-500 to-green-600"
            loading={loading}
          />
          <StatCard
            title="Total Revenue"
            value={
              loading
                ? "..."
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "RWF",
                    maximumFractionDigits: 0,
                  }).format(totalRevenue)
            }
            icon={DollarSign}
            gradient="from-purple-500 to-pink-600"
            loading={loading}
          />
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-200 dark:bg-gray-700 bg-opacity-50 backdrop-blur-sm p-6 rounded-lg shadow-xl border dark:border-gray-700 border-gray-200">
          <div className="flex items-center justify-between mb-6 ">
            <div>
              <h2 className="text-2xl font-semibold dark:text-gray-100 text-gray-900 mb-1">Product Analytics</h2>
              <p className="text-gray-900 dark:text-gray-100 text-sm">Distribution across categories</p>
            </div>
          </div>
          {loading ? (
            <div className="h-64 dark:bg-gray-700 bg-gray-100 bg-opacity-30 rounded-lg animate-pulse" />
          ) : (
            <div className="dark:bg-gray-900 bg-gray-100  p-4 rounded-lg">
              <Bar data={barData} options={chartOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
