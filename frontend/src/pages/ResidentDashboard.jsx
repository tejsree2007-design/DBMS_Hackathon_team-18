import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResidentSidebar from "../components/ResidentSidebar";

import { getResidentPayments } from "../api/paymentApi";
import { getNotices } from "../api/noticeApi";
import { getVisitors } from "../api/visitorApi";
import { getComplaints } from "../api/complaintApi";


function ResidentDashboard() {

  const navigate = useNavigate();

  const resident = JSON.parse(
    localStorage.getItem("currentResident")
  );


  // ==========================================
  // DASHBOARD STATES
  // ==========================================

  const [pendingMaintenance, setPendingMaintenance] =
    useState(0);

  const [todayVisitors, setTodayVisitors] =
    useState(0);

  const [openComplaints, setOpenComplaints] =
    useState(0);

  const [notices, setNotices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    const loadDashboardData = async () => {

      try {

        setLoading(true);
        setError("");


        // ------------------------------------------
        // CHECK RESIDENT
        // ------------------------------------------

        if (!resident?.residentId) {

          setError(
            "Resident information not found."
          );

          return;
        }


        // ------------------------------------------
        // GET PAYMENTS
        // ------------------------------------------

        const paymentData =
          await getResidentPayments(
            resident.residentId
          );


        // Calculate total pending amount

        const pendingAmount =
          paymentData
            .filter(
              payment =>
                payment.payment_status === "Pending"
            )
            .reduce(
              (total, payment) =>
                total + Number(payment.amount || 0),
              0
            );


        setPendingMaintenance(
          pendingAmount
        );


        // ------------------------------------------
        // GET VISITORS
        // ------------------------------------------

        const visitorData =
          await getVisitors();


        const today =
          new Date()
            .toISOString()
            .split("T")[0];


        const residentVisitors =
          visitorData.filter(
            visitor =>
              Number(visitor.resident_id) ===
              Number(resident.residentId)
          );


        const todayVisitorCount =
          residentVisitors.filter(
            visitor => {

              const visitorDate =
                visitor.visit_date ||
                visitor.date;

              if (!visitorDate) {
                return false;
              }

              return String(visitorDate).startsWith(
                today
              );
            }
          ).length;


        setTodayVisitors(
          todayVisitorCount
        );


        // ------------------------------------------
        // GET COMPLAINTS
        // ------------------------------------------

        const complaintData =
          await getComplaints();


        const residentComplaints =
          complaintData.filter(
            complaint =>
              Number(complaint.resident_id) ===
              Number(resident.residentId)
          );


        const openComplaintCount =
          residentComplaints.filter(
            complaint => {

              const status =
                String(
                  complaint.status || ""
                ).toLowerCase();

              return (
                status === "open" ||
                status === "pending"
              );
            }
          ).length;


        setOpenComplaints(
          openComplaintCount
        );


        // ------------------------------------------
        // GET NOTICES
        // ------------------------------------------

        const noticeData =
          await getNotices();


        // Sort newest notices first

        const sortedNotices =
          [...noticeData].sort(
            (a, b) => {

              const dateA =
                new Date(
                  a.created_at || 0
                );

              const dateB =
                new Date(
                  b.created_at || 0
                );

              return dateB - dateA;
            }
          );


        setNotices(
          sortedNotices
        );

      } catch (error) {

        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          error.message ||
          "Failed to load dashboard data."
        );

      } finally {

        setLoading(false);

      }

    };


    loadDashboardData();

  }, [resident?.residentId]);


  // ==========================================
  // FORMAT NOTICE DATE
  // ==========================================

  const formatNoticeDate = (date) => {

    if (!date) {
      return "";
    }


    const noticeDate =
      new Date(date);

    const today =
      new Date();


    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );


    if (
      noticeDate.toDateString() ===
      today.toDateString()
    ) {
      return "Today";
    }


    if (
      noticeDate.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Yesterday";
    }


    const difference =
      Math.floor(
        (
          today - noticeDate
        ) /
        (1000 * 60 * 60 * 24)
      );


    if (
      difference >= 0 &&
      difference < 7
    ) {
      return `${difference} days ago`;
    }


    return noticeDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // RECENT NOTICES
  // ==========================================

  const recentNotices =
    notices.slice(0, 3);


  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="dashboard-page">

      <ResidentSidebar
        activePage="dashboard"
      />


      <main className="dashboard-main">

        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="dashboard-header">

          <div>

            <h1>
              Resident Dashboard
            </h1>

            <p>
              Welcome back! Here's what's happening
              in your society.
            </p>

          </div>


          <div className="profile-area">

            <div className="profile-icon">
              👤
            </div>


            <div>

              <strong>
                {resident?.name || "Resident"}
              </strong>

              <small>
                Flat{" "}
                {resident?.flatNumber ||
                  "Not available"}
              </small>

            </div>

          </div>

        </header>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div
            style={{
              padding: "12px",
              marginBottom: "20px",
              color: "#b91c1c",
              backgroundColor: "#fee2e2",
              borderRadius: "8px"
            }}
          >
            {error}
          </div>

        )}


        {/* ==========================================
            DASHBOARD STATS
        ========================================== */}

        <section className="dashboard-stats">


          {/* Pending Maintenance */}

          <div className="stat-card">

            <div className="stat-icon">
              💰
            </div>


            <div>

              <h3>
                {loading
                  ? "..."
                  : `₹${pendingMaintenance.toLocaleString(
                      "en-IN"
                    )}`}
              </h3>

              <p>
                Pending Maintenance
              </p>

            </div>

          </div>


          {/* Today's Visitors */}

          <div className="stat-card">

            <div className="stat-icon">
              🚗
            </div>


            <div>

              <h3>
                {loading
                  ? "..."
                  : todayVisitors}
              </h3>

              <p>
                Today's Visitors
              </p>

            </div>

          </div>


          {/* Open Complaints */}

          <div className="stat-card">

            <div className="stat-icon">
              📝
            </div>


            <div>

              <h3>
                {loading
                  ? "..."
                  : openComplaints}
              </h3>

              <p>
                Open Complaints
              </p>

            </div>

          </div>


          {/* New Notices */}

          <div className="stat-card">

            <div className="stat-icon">
              📢
            </div>


            <div>

              <h3>
                {loading
                  ? "..."
                  : notices.length}
              </h3>

              <p>
                New Notices
              </p>

            </div>

          </div>

        </section>


        {/* ==========================================
            DASHBOARD GRID
        ========================================== */}

        <section className="dashboard-grid">


          {/* ==========================================
              RECENT NOTICES
          ========================================== */}

          <div className="dashboard-card">


            <div className="card-header">

              <h2>
                Recent Notices
              </h2>


              <button
                onClick={() =>
                  navigate("/resident-notices")
                }
              >
                View All
              </button>

            </div>


            {loading ? (

              <p>
                Loading notices...
              </p>

            ) : recentNotices.length === 0 ? (

              <p>
                No recent notices.
              </p>

            ) : (

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
                        {notice.title}
                      </strong>


                      <p>
                        {notice.message}
                      </p>

                    </div>


                    <span>
                      {formatNoticeDate(
                        notice.created_at
                      )}
                    </span>

                  </div>

                )
              )

            )}

          </div>


          {/* ==========================================
              QUICK ACTIONS
          ========================================== */}

          <div className="dashboard-card">

            <div className="card-header">

              <h2>
                Quick Actions
              </h2>

            </div>


            <div className="quick-actions">


              <button
                onClick={() =>
                  navigate(
                    "/resident-complaints"
                  )
                }
              >

                📝

                <span>
                  Raise Complaint
                </span>

              </button>


              <button
                onClick={() =>
                  navigate(
                    "/resident-visitors"
                  )
                }
              >

                🚗

                <span>
                  Add Visitor
                </span>

              </button>


              <button
                onClick={() =>
                  navigate(
                    "/resident-amenities"
                  )
                }
              >

                🏊

                <span>
                  Book Amenity
                </span>

              </button>


              <button
                onClick={() =>
                  navigate(
                    "/resident-payments"
                  )
                }
              >

                💰

                <span>
                  Pay Maintenance
                </span>

              </button>

            </div>

          </div>

        </section>


        {/* ==========================================
            RECENT ACTIVITY
        ========================================== */}

        <section className="dashboard-card activity-card">


          <div className="card-header">

            <h2>
              Recent Activity
            </h2>


            <button
              onClick={() =>
                navigate(
                  "/resident-notifications"
                )
              }
            >
              View All
            </button>

          </div>


          <div className="activity-item">

            <span>
              📢
            </span>


            <div>

              <strong>
                Society Updates
              </strong>

              <p>
                Check the latest society notices
                and notifications.
              </p>

            </div>

          </div>


          <div className="activity-item">

            <span>
              💰
            </span>


            <div>

              <strong>
                Maintenance
              </strong>

              <p>
                View your latest maintenance
                payment details.
              </p>

            </div>

          </div>


          <div className="activity-item">

            <span>
              🔔
            </span>


            <div>

              <strong>
                Notifications
              </strong>

              <p>
                Check your latest society
                notifications.
              </p>

            </div>

          </div>


        </section>

      </main>

    </div>
  );
}


export default ResidentDashboard;