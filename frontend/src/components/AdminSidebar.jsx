import { useNavigate } from "react-router-dom";

function AdminSidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-logo">
        🏢
        <span>Society Portal</span>
      </div>


      <nav>

        <a
          className={activePage === "dashboard" ? "active" : ""}
          onClick={() => navigate("/admin-dashboard")}
        >
          🏠 Dashboard
        </a>


        <a
          className={activePage === "residents" ? "active" : ""}
          onClick={() => navigate("/admin-residents")}
        >
          👥 Residents
        </a>


        <a
          className={activePage === "payments" ? "active" : ""}
          onClick={() => navigate("/admin-payments")}
        >
          💰 Payments
        </a>


        <a
          className={activePage === "visitors" ? "active" : ""}
          onClick={() => navigate("/admin-visitors")}
        >
          🚗 Visitors
        </a>


        <a
          className={activePage === "complaints" ? "active" : ""}
          onClick={() => navigate("/admin-complaints")}
        >
          📝 Complaints
        </a>


        <a
          className={activePage === "amenities" ? "active" : ""}
          onClick={() => navigate("/admin-amenities")}
        >
          🏊 Amenities
        </a>


        <a
          className={activePage === "notices" ? "active" : ""}
          onClick={() => navigate("/admin-notices")}
        >
          📢 Notices
        </a>


        <a
          className={activePage === "polls" ? "active" : ""}
          onClick={() => navigate("/admin-polls")}
        >
          🗳️ Polls
        </a>


        <a
          className={activePage === "notifications" ? "active" : ""}
          onClick={() => navigate("/admin-notifications")}
        >
          🔔 Notifications
        </a>

      </nav>


      <button
        className="logout-button"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}

export default AdminSidebar;