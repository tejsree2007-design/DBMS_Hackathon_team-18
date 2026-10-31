import { useNavigate } from "react-router-dom";

function ResidentSidebar({ activePage }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentResident");
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
          onClick={() => navigate("/resident-dashboard")}
        >
          🏠 Dashboard
        </a>

        <a
          className={activePage === "profile" ? "active" : ""}
          onClick={() => navigate("/resident-profile")}
        >
          👤 Profile
        </a>

        <a
          className={activePage === "payments" ? "active" : ""}
          onClick={() => navigate("/resident-payments")}
        >
          💰 Payments
        </a>

        <a
          className={activePage === "visitors" ? "active" : ""}
          onClick={() => navigate("/resident-visitors")}
        >
          🚗 Visitors
        </a>

        <a
          className={activePage === "complaints" ? "active" : ""}
          onClick={() => navigate("/resident-complaints")}
        >
          📝 Complaints
        </a>

         <a
            className={activePage === "amenities" ? "active" : ""}
            onClick={() => navigate("/resident-amenities")}
        >
            🏊 Amenities
        </a>
        <a
            className={activePage === "notices" ? "active" : ""}
            onClick={() => navigate("/resident-notices")}
        >
            📢 Notices
        </a>
        <a
            className={activePage === "polls" ? "active" : ""}
            onClick={() => navigate("/resident-polls")}
        >
            🗳️ Polls
        </a>
        <a
             className={activePage === "notifications" ? "active" : ""}
             onClick={() => navigate("/resident-notifications")}
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

export default ResidentSidebar;