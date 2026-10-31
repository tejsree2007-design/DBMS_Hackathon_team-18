import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getComplaints,
  updateComplaintStatus
} from "../api/complaintApi";

function AdminComplaints() {

  const [complaints, setComplaints] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD COMPLAINTS FROM BACKEND
  // ==========================================

  useEffect(() => {

    const loadComplaints = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getComplaints();

        setComplaints(data);

      } catch (error) {

        console.error(
          "Error loading complaints:",
          error
        );

        setError(
          "Failed to load complaints from the server."
        );

      } finally {

        setLoading(false);

      }

    };


    loadComplaints();

  }, []);


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredComplaints = complaints.filter(
    (complaint) =>
      complaint.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      complaint.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      complaint.resident_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      complaint.flat_number
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // ==========================================
  // COMPLAINT COUNTS
  // ==========================================

  const openCount = complaints.filter(
    (complaint) =>
      complaint.status === "Open"
  ).length;


  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === "In Progress"
  ).length;


  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === "Resolved"
  ).length;


  // ==========================================
  // UPDATE COMPLAINT STATUS
  // ==========================================

  const updateStatus = async (
    complaint,
    newStatus
  ) => {

    try {

      await updateComplaintStatus(
        complaint.complaint_id,
        newStatus
      );


      // Update UI immediately
      setComplaints((currentComplaints) =>
        currentComplaints.map(
          (item) =>
            item.complaint_id ===
            complaint.complaint_id
              ? {
                  ...item,
                  status: newStatus
                }
              : item
        )
      );

    } catch (error) {

      console.error(
        "Error updating complaint:",
        error
      );

      alert(
        "Failed to update complaint status."
      );

    }

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  return (

    <div className="dashboard-page">

      <AdminSidebar activePage="complaints" />


      <main className="dashboard-main">


        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              Complaints
            </h1>

            <p>
              Manage and track complaints submitted by residents.
            </p>

          </div>

        </header>


        {/* Error */}

        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        {/* Complaint Statistics */}

        <section className="dashboard-stats">


          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <h3>
                {complaints.length}
              </h3>

              <p>
                Total Complaints
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <h3>
                {openCount}
              </h3>

              <p>
                Open
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔄
            </div>

            <div>

              <h3>
                {inProgressCount}
              </h3>

              <p>
                In Progress
              </p>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <h3>
                {resolvedCount}
              </h3>

              <p>
                Resolved
              </p>

            </div>

          </div>


        </section>


        {/* Complaint List */}

        <section className="dashboard-card admin-complaints-card">


          <div className="card-header">

            <h2>
              Resident Complaints
            </h2>

          </div>


          {/* Search */}

          <div className="input-group">

            <label>
              Search Complaints
            </label>

            <input
              type="text"
              placeholder="Search by complaint, resident or flat number"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Loading */}

          {loading ? (

            <p>
              Loading complaints...
            </p>

          ) : filteredComplaints.length > 0 ? (


            /* Complaints */

            filteredComplaints.map(
              (complaint) => (

                <div
                  className="activity-item"
                  key={complaint.complaint_id}
                >

                  <span>
                    📝
                  </span>


                  <div>

                    <strong>
                      {complaint.title}
                    </strong>

                    <p>
                      {complaint.description}
                    </p>

                    <small>

                      Resident:{" "}
                      {complaint.resident_name}

                      {" • "}

                      Flat:{" "}
                      {complaint.flat_number}

                      {" • "}

                      Submitted:{" "}
                      {formatDate(
                        complaint.created_at
                      )}

                    </small>

                  </div>


                  <select
                    value={complaint.status}
                    onChange={(e) =>
                      updateStatus(
                        complaint,
                        e.target.value
                      )
                    }
                  >

                    <option value="Open">
                      Open
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Resolved">
                      Resolved
                    </option>

                  </select>

                </div>

              )

            )

          ) : (

            <p>
              No complaints found.
            </p>

          )}


        </section>

      </main>

    </div>

  );

}


export default AdminComplaints;