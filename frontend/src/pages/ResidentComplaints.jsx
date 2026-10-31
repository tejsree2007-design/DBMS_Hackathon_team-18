import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import {
  getComplaints,
  createComplaint,
  deleteComplaint
} from "../api/complaintApi";

function ResidentComplaints() {

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );

  const [complaints, setComplaints] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  // ==========================================
  // LOAD MY COMPLAINTS
  // ==========================================

  const loadComplaints = async () => {

    if (!currentResident?.residentId) {
      setLoading(false);
      return;
    }

    try {

      setLoading(true);

      const data = await getComplaints();

      const myComplaints = data.filter(
        (complaint) =>
          Number(complaint.resident_id) ===
          Number(currentResident.residentId)
      );

      setComplaints(myComplaints);

    } catch (error) {

      console.error(
        "Error loading complaints:",
        error
      );

      alert(
        "Failed to load complaints."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadComplaints();

  }, []);


  // ==========================================
  // SUBMIT COMPLAINT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!currentResident?.residentId) {
      alert("Resident information not found.");
      return;
    }

    try {

      setSubmitting(true);

      await createComplaint({
        resident_id:
          currentResident.residentId,

        title: title,

        description: description
      });

      setTitle("");
      setDescription("");

      await loadComplaints();

      alert(
        "Complaint submitted successfully!"
      );

    } catch (error) {

      console.error(
        "Error submitting complaint:",
        error
      );

      alert(
        error.message ||
        "Failed to submit complaint."
      );

    } finally {

      setSubmitting(false);

    }
  };


  // ==========================================
  // DELETE COMPLAINT
  // ==========================================

  const handleDelete = async (id) => {

    try {

      await deleteComplaint(id);

      await loadComplaints();

    } catch (error) {

      console.error(
        "Error deleting complaint:",
        error
      );

      alert(
        error.message ||
        "Failed to delete complaint."
      );

    }
  };


  return (
    <div className="dashboard-page">

      <ResidentSidebar activePage="complaints" />


      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <h1>Complaints</h1>

            <p>
              Raise and manage your society complaints.
            </p>

          </div>

        </header>


        {/* Raise Complaint */}

        <section className="dashboard-card">

          <div className="card-header">

            <h2>Raise a Complaint</h2>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>
                Complaint Title
              </label>

              <input
                type="text"
                placeholder="Example: Lift not working"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
              />

            </div>


            <div className="input-group">

              <label>
                Complaint Description
              </label>

              <textarea
                placeholder="Describe your complaint"
                rows="5"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                required
              ></textarea>

            </div>


            <button
              type="submit"
              className="auth-button"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "📝 Submit Complaint"}
            </button>

          </form>

        </section>


        {/* My Complaints */}

        <section className="dashboard-card activity-card">

          <div className="card-header">

            <h2>My Complaints</h2>

          </div>


          {loading ? (

            <p>
              Loading complaints...
            </p>

          ) : complaints.length > 0 ? (

            complaints.map((complaint) => (

              <div
                className="activity-item"
                key={complaint.complaint_id}
              >

                <span>📝</span>


                <div>

                  <strong>
                    {complaint.title}
                  </strong>

                  <p>
                    {complaint.description}
                  </p>

                  <small>
                    Status:{" "}
                    {complaint.status}{" "}
                    • Submitted:{" "}
                    {complaint.created_at
                      ? new Date(
                          complaint.created_at
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "-"}
                  </small>

                </div>


                <button
                  onClick={() =>
                    handleDelete(
                      complaint.complaint_id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            ))

          ) : (

            <p>
              No complaints submitted yet.
            </p>

          )}

        </section>

      </main>

    </div>
  );
}

export default ResidentComplaints;