import { useNavigate } from "react-router-dom";

function RSelection() {
  const navigate = useNavigate();

  return (
    <div className="role-page">

      <div className="role-container">

        {/* Header */}
        <div className="role-header">

          <div className="role-logo">
            🏢
          </div>

          <h1>Smart Apartment Management System</h1>

          <p>
            Welcome! Please select your role to continue.
          </p>

        </div>


        {/* Role Cards */}
        <div className="role-cards">

          {/* Admin Card */}
          <div className="role-card">

            <div className="role-icon">
              👨‍💼
            </div>

            <h2>Admin</h2>

            <p>
              Manage residents, payments, visitors,
              complaints, amenities and society activities.
            </p>

            <button
              onClick={() => navigate("/admin-login")}
            >
              Admin Login
            </button>

          </div>


          {/* Resident Card */}
          <div className="role-card">

            <div className="role-icon">
              👤
            </div>

            <h2>Resident</h2>

            <p>
              View payments, visitors, complaints,
              amenities, notices and notifications.
            </p>

            <button
              onClick={() => navigate("/resident-login")}
            >
              Resident Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RSelection;