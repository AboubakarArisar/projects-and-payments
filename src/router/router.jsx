import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";
import PageNotFound from "../Pages/PageNotFound";
import React, { Suspense } from "react";
import Loader from "../components/tailwindLoader";
import Layout from "../layouts/Layout";
import Home from "../Pages/Home";
import Techs from "../Pages/Techs";
import OwnerLogin from "../Pages/OwnerLogin";
import Register from "../Pages/Register";
import ProtectedRoute from "../Auth/ProtectedRoute";
import GuestRoute from "../Auth/GuestRoute";
const Dashboard = React.lazy(() => import("../Pages/Dashboard"));
const TeamDashboard = React.lazy(() => import("../Pages/TeamDashboard"));
const TRXEntry = React.lazy(() => import("../Pages/TRXEntry"));
const IncomingPayments = React.lazy(() => import("../Pages/IncomingPayments"));
const OutgoingPayments = React.lazy(() => import("../Pages/OutgoingPayments"));
const TotalPayments = React.lazy(() => import("../Pages/TotalPayments"));
const ProjectStatusBoard = React.lazy(() =>
  import("../Pages/ProjectStatusBoard")
);
const ProjectDetail = React.lazy(() => import("../Pages/ProjectDetail"));
const ProjectEntry = React.lazy(() => import("../Pages/ProjectEntry"));
const MemberEntry = React.lazy(() => import("../Pages/MemberEntry"));
const AiAssistant = React.lazy(() => import("../Pages/AiAssistant"));

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public — but a signed-in user is redirected to the app */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/techs" element={<Techs />} />

        {/* Protected app — redirects to /login when not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<AppLayout />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

const AppLayout = () => {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/teams" element={<TeamDashboard />} />
            <Route path="/transactionEntry" element={<TRXEntry />} />
            <Route path="/incomingPayments" element={<IncomingPayments />} />
            <Route path="/outgoingPayments" element={<OutgoingPayments />} />
            <Route path="/totalPayments" element={<TotalPayments />} />
            <Route path="/projects" element={<ProjectStatusBoard />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/prEntry" element={<ProjectEntry />} />
            <Route path="/addMember" element={<MemberEntry />} />
            <Route path="/ai" element={<AiAssistant />} />
          </Route>
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default AppRoutes;
