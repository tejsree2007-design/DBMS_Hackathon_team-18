import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar";

import { getResidents } from "../api/residentApi";
import { getPayments } from "../api/paymentApi";
import { getComplaints } from "../api/complaintApi";
import { getNotices } from "../api/noticeApi";


function AdminDashboard() {

  const navigate = useNavigate();


  // ==========================================
  // DATA
  // ==========================================

  const [residents, setResidents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] = useState(true);


  // ==========================================
  // ERROR
  // ==========================================

  const [error, setError] = useState("");


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setError("");


        const [
          residentsData,
          paymentsData,
          complaintsData,
          noticesData
        ] = await Promise.all([

          getResidents(),
          getPayments(),
          getComplaints(),
          getNotices()

        ]);


        setResidents(residentsData);
        setPayments(paymentsData);
        setComplaints(complaintsData);
        setNotices(noticesData);


      } catch (error) {

        console.error(
          "Error loading dashboard:",
          error
        );

        setError(
          "Failed to load dashboard data from the server."
        );


      } finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, []);


  // ==========================================
  // TOTAL RESIDENTS
  // ==========================================

  const totalResidents =
    residents.length;


  // ==========================================
  // UNIQUE FLATS
  // ==========================================

  const totalFlats =
    new Set(
      residents.map(
        (resident) =>
          resident.flat_number
      )
    ).size;


  // ==========================================
  // PENDING PAYMENT AMOUNT
  // ==========================================

  const pendingPaymentAmount =
    payments
      .filter(
        (payment) =>
          payment.payment_status === "Pending"
      )
      .reduce(
        (total, payment) =>
          total + Number(payment.amount),
        0
      );


  // ==========================================
  // OPEN COMPLAINTS
  // ==========================================

  const openComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Open"
    );


  // ==========================================
  // RECENT COMPLAINTS
  // ==========================================

  const recentComplaints =
    [...complaints]
      .sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(
            a.created_at
          )
      )
      .slice(0, 3);


  // ==========================================
  // RECENT NOTICES
  // ==========================================

  const recentNotices =
    [...notices]
      .sort(
        (a, b) =>
          new Date(
            b.created_at
          ) -
          new Date(
            a.created_at
          )
      )
      .slice(0, 3);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  };


  return (

    <div className="dashboard-page">


      {/* ADMIN SIDEBAR */}

      <AdminSidebar
        activePage="dashboard"
      />


      {/* MAIN CONTENT */}

      <main className="dashboard-main">


        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Welcome back! Here's an overview of your society.
            </p>

          </div>


          <div className="profile-area">

            <div className="profile-icon">
              👨‍💼
            </div>

            <div>

              <strong>
                Admin
              </strong>

              <small>
                Administrator
              </small>

            </div>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        {/* DASHBOARD STATISTICS */}

        <section className="dashboard-stats">


          {/* TOTAL RESIDENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <h3>

                {loading
                  ? "..."
                  : totalResidents}

              </h3>

              <p>
                Total Residents
              </p>

            </div>

          </div>


          {/* TOTAL FLATS */}

          <div className="stat-card">

            <div className="stat-icon">
              🏠
            </div>

            <div>

              <h3>

                {loading
                  ? "..."
                  : totalFlats}

              </h3>

              <p>
                Occupied Flats
              </p>

            </div>

          </div>


          {/* PENDING PAYMENTS */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>

            <div>

              <h3>

                {loading
                  ? "..."
                  : `₹${pendingPaymentAmount.toLocaleString(
                      "en-IN"
                    )}`}

              </h3>

              <p>
                Pending Payments
              </p>

            </div>

          </div>


          {/* OPEN COMPLAINTS */}

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>

            <div>

              <h3>

                {loading
                  ? "..."
                  : openComplaints.length}

              </h3>

              <p>
                Open Complaints
              </p>

            </div>

          </div>


        </section>


        {/* RECENT INFORMATION */}

        <section className="dashboard-grid">


          {/* RECENT COMPLAINTS */}

          <div className="dashboard-card">


            <div className="card-header">

              <h2>
                Recent Complaints
              </h2>

              <button
                onClick={() =>
                  navigate(
                    "/admin-complaints"
                  )
                }
              >
                View All
              </button>

            </div>


            {loading ? (

              <p>
                Loading complaints...
              </p>

            ) : recentComplaints.length > 0 ? (

              recentComplaints.map(
                (complaint) => (

                  <div
                    className="notice-item"
                    key={
                      complaint.complaint_id
                    }
                  >

                    <div>

                      <strong>
                        {complaint.title ||
                          "Complaint"}
                      </strong>

                      <p>
                        {complaint.description ||
                          "No description available."}
                      </p>

                    </div>

                    <span>
                      {formatDate(
                        complaint.created_at
                      )}
                    </span>

                  </div>

                )
              )

            ) : (

              <p>
                No complaints found.
              </p>

            )}

          </div>


          {/* RECENT NOTICES */}

          <div className="dashboard-card">


            <div className="card-header">

              <h2>
                Recent Notices
              </h2>

              <button
                onClick={() =>
                  navigate(
                    "/admin-notices"
                  )
                }
              >
                View All
              </button>

            </div>


            {loading ? (

              <p>
                Loading notices...
              </p>

            ) : recentNotices.length > 0 ? (

              recentNotices.map(
                (notice) => (

                  <div
                    className="notice-item"
                    key={
                      notice.notice_id
                    }
                  >

                    <div>

                      <strong>
                        {notice.title ||
                          "Notice"}
                      </strong>

                      <p>
                        {notice.message ||
                          notice.description ||
                          "No message available."}
                      </p>

                    </div>

                    <span>
                      {formatDate(
                        notice.created_at
                      )}
                    </span>

                  </div>

                )
              )

            ) : (

              <p>
                No notices found.
              </p>

            )}

          </div>


        </section>


        {/* QUICK ACTIONS */}

        <section className="dashboard-card">


          <div className="card-header">

            <h2>
              Quick Actions
            </h2>

          </div>


          <div className="quick-actions">


            <button
              onClick={() =>
                navigate(
                  "/admin-residents"
                )
              }
            >

              👥

              <span>
                Manage Residents
              </span>

            </button>


            <button
              onClick={() =>
                navigate(
                  "/admin-payments"
                )
              }
            >

              💰

              <span>
                View Payments
              </span>

            </button>


            <button
              onClick={() =>
                navigate(
                  "/admin-complaints"
                )
              }
            >

              📝

              <span>
                Manage Complaints
              </span>

            </button>


            <button
              onClick={() =>
                navigate(
                  "/admin-notices"
                )
              }
            >

              📢

              <span>
                Create Notice
              </span>

            </button>


          </div>


        </section>


      </main>

    </div>

  );

}


export default AdminDashboard;