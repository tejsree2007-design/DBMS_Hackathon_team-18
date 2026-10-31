import { BrowserRouter, Routes, Route } from "react-router-dom";

import RSelection from "./pages/RSelection";
import AdminLogin from "./pages/AdminLogin";
import ResidentLogin from "./pages/ResidentLogin";
import ResidentDashboard from "./pages/ResidentDashboard";
import ResidentProfile from "./pages/ResidentProfile";
import ResidentPayments from "./pages/ResidentPayments";
import AdminDashboard from "./pages/AdminDashboard";
import AdminResidents from "./pages/AdminResidents";
import ResidentPaymentCheckout from "./pages/ResidentPaymentCheckout";
import ResidentVisitors from "./pages/ResidentVisitors";
import ResidentComplaints from "./pages/ResidentComplaints";
import AdminPayments from "./pages/AdminPayments";
import AdminVisitors from "./pages/AdminVisitors";
import AdminComplaints from "./pages/AdminComplaints";
import ResidentAmenities from "./pages/ResidentAmenities";
import ResidentNotices from "./pages/ResidentNotices";
import ResidentPolls from "./pages/ResidentPolls";
import ResidentNotifications from "./pages/ResidentNotifications";
import AdminAmenities from "./pages/AdminAmenities";
import AdminNotices from "./pages/AdminNotices";
import AdminPolls from "./pages/AdminPolls";
import AdminNotifications from "./pages/AdminNotifications";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<RSelection />}
        />


        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        <Route
          path="/resident-login"
          element={<ResidentLogin />}
        />


        <Route
          path="/resident-dashboard"
          element={<ResidentDashboard />}
        />


        <Route
          path="/resident-profile"
          element={<ResidentProfile />}
        />


        <Route
          path="/resident-payments"
          element={<ResidentPayments />}
        />


        <Route
          path="/resident-payment-checkout"
          element={<ResidentPaymentCheckout />}
        />


        <Route
          path="/resident-visitors"
          element={<ResidentVisitors />}
        />


        <Route
          path="/resident-complaints"
          element={<ResidentComplaints />}
        />
        <Route
          path="/resident-amenities"
          element={<ResidentAmenities />}
       />
       <Route
            path="/resident-notices"
            element={<ResidentNotices />}
        />
        <Route
            path="/resident-polls"
            element={<ResidentPolls />}
        />
        <Route
          path="/resident-notifications"
          element={<ResidentNotifications />}
        />


        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />


        <Route
          path="/admin-residents"
          element={<AdminResidents />}
        />
        <Route
          path="/admin-payments"
          element={<AdminPayments />}
        />
        <Route
          path="/admin-visitors"
          element={<AdminVisitors />}
        />
        <Route
           path="/admin-complaints"
          element={<AdminComplaints />}
        />
        <Route path="/admin-amenities" element={<AdminAmenities />} />
        <Route path="/admin-notices" element={<AdminNotices />} />
        <Route path="/admin-polls" element={<AdminPolls />} />
        <Route
              path="/admin-notifications"
              element={<AdminNotifications />}
        />
        

      </Routes>

    </BrowserRouter>

  );
}


export default App;