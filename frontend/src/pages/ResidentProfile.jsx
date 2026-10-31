import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResidentSidebar from "../components/ResidentSidebar";
import { getResidents } from "../api/residentApi";

function ResidentProfile() {
  const navigate = useNavigate();

  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResidentProfile();
  }, []);

  const loadResidentProfile = async () => {
    try {
      const currentResident = JSON.parse(
        localStorage.getItem("currentResident")
      );

      if (!currentResident) {
        setLoading(false);
        return;
      }

      const residents = await getResidents();

      const loggedInResident = residents.find(
        (item) =>
          item.resident_id === currentResident.residentId
      );

      setResident(loggedInResident || currentResident);

    } catch (error) {
      console.error(
        "Failed to load resident profile:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">

      <ResidentSidebar activePage="profile" />

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h1>My Profile</h1>
            <p>View your resident account information.</p>
          </div>
        </header>

        <div className="dashboard-card profile-card">

          <div className="profile-large-icon">
            👤
          </div>

          {loading ? (
            <h2 className="profile-name">
              Loading...
            </h2>
          ) : (
            <>
              <h2 className="profile-name">
                {resident?.name || "Resident"}
              </h2>

              <p className="profile-role">
                Resident
              </p>

              <div className="profile-details">

                <div className="profile-detail">
                  <strong>Full Name</strong>
                  <span>
                    {resident?.name || "Not available"}
                  </span>
                </div>

                <div className="profile-detail">
                  <strong>Flat Number</strong>
                  <span>
                    {resident?.flat_number ||
                      resident?.flatNumber ||
                      "Not available"}
                  </span>
                </div>

                <div className="profile-detail profile-email">
                  <strong>Email Address</strong>
                  <span>
                    {resident?.email || "Not available"}
                  </span>
                </div>

              </div>
            </>
          )}

          <button
            className="profile-back-button"
            onClick={() => navigate("/resident-dashboard")}
          >
            ← Back to Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}

export default ResidentProfile;