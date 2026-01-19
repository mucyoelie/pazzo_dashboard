import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import OpenUpsList from "./components/list/openupsList";
//import CcsList from "./components/list/ccsList";
import CcsList from "./components/list/CcsList";
import LogsList from "./components/list/LogsList";
function App() {
  return (
    <div className="dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900  bg-slate-50  ">
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="open-ups-list" element={<OpenUpsList />} />
          <Route path="ccs-product-list" element={<CcsList/>}/>
          <Route path="logs-product-list" element={<LogsList/>}/>
        </Route>
      </Routes>
    </Router>
    </div>
  );
}

export default App;


