import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./Layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import OpenUpsList from "./components/list/openupsList";
import CcsList from "./components/list/ccsList";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Dashboard Layout with nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="open-ups-list" element={<OpenUpsList />} />
          <Route path="ccs-product-list" element={<CcsList/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


