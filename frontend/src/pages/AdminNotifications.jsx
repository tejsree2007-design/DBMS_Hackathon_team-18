import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";

import { getResidents } from "../api/residentApi";
import { getPayments } from "../api/paymentApi";
import { getVisitors } from "../api/visitorApi";
import { getComplaints } from "../api/complaintApi";
import { getNotices } from "../api/noticeApi";
import { getPolls } from "../api/pollApi";

import {
  getNotifications,
  createNotification
} from "../api/notificationApi";

import "./AdminNotifications.css";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Residents
  const [residents, setResidents] = useState([]);

  // Send notification form
  const [showForm, setShowForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [sending, setSending] = useState(false);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (date, time) => {
    if (!date) {
      return "Recently";
    }

    const formattedDate = formatDate(date);

    if (!time) {
      return formattedDate;
    }

    return `${formattedDate} ${time}`;
  };

  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        residentsData,
        payments,
        visitors,
        complaints,
        notices,
        polls,
        databaseNotifications
      ] = await Promise.all([
        getResidents(),
        getPayments(),
        getVisitors(),
        getComplaints(),
        getNotices(),
        getPolls(),
        getNotifications()
      ]);

      setResidents(residentsData);

      // ==========================================
      // RESIDENT LOOKUP
      // ==========================================

      const residentMap = {};

      residentsData.forEach((resident) => {
        residentMap[String(resident.resident_id)] = resident;
      });

      // ==========================================
      // ALL NOTIFICATIONS
      // ==========================================

      const allNotifications = [];

      // ==========================================
      // PAYMENT NOTIFICATIONS
      // ==========================================

      payments.forEach((payment) => {
        if (payment.payment_status === "Paid") {
          const resident =
            residentMap[String(payment.resident_id)];

          const residentName =
            payment.name ||
            resident?.name ||
            "Resident";

          const flatNumber =
            payment.flat_number ||
            resident?.flat_number ||
            "";

          allNotifications.push({
            id: `payment-${payment.payment_id}`,
            icon: "💰",
            title: "Payment Received",
            message: `${residentName}${
              flatNumber ? ` (Flat ${flatNumber})` : ""
            } has paid ₹${Number(
              payment.amount || 0
            ).toLocaleString("en-IN")} for ${
              payment.payment_month || "maintenance"
            }.`,
            time: formatDate(payment.paid_at),
            timestamp: payment.paid_at
              ? new Date(payment.paid_at).getTime()
              : 0,
            type: "payment"
          });
        }
      });

      // ==========================================
      // VISITOR NOTIFICATIONS
      // ==========================================

      visitors.forEach((visitor) => {
        const resident =
          residentMap[String(visitor.resident_id)];

        const residentName =
          visitor.resident_name ||
          resident?.name ||
          "Resident";

        const flatNumber =
          visitor.flat_number ||
          resident?.flat_number ||
          "";

        allNotifications.push({
          id: `visitor-${visitor.visitor_id}`,
          icon: "🚗",
          title: "Visitor Registered",
          message: `${visitor.visitor_name} is expected to visit ${residentName}${
            flatNumber ? ` (Flat ${flatNumber})` : ""
          }${
            visitor.purpose
              ? ` for ${visitor.purpose}`
              : ""
          }.`,
          time: formatDateTime(
            visitor.visit_date,
            visitor.visit_time
          ),
          timestamp: visitor.created_at
            ? new Date(visitor.created_at).getTime()
            : visitor.visit_date
            ? new Date(visitor.visit_date).getTime()
            : 0,
          type: "visitor"
        });
      });

      // ==========================================
      // COMPLAINT NOTIFICATIONS
      // ==========================================

      complaints.forEach((complaint) => {
        const resident =
          residentMap[String(complaint.resident_id)];

        const residentName =
          complaint.resident_name ||
          resident?.name ||
          "Resident";

        let title = "Complaint Submitted";

        if (complaint.status === "In Progress") {
          title = "Complaint In Progress";
        }

        if (complaint.status === "Resolved") {
          title = "Complaint Resolved";
        }

        allNotifications.push({
          id: `complaint-${complaint.complaint_id}`,
          icon: "📝",
          title,
          message: `${residentName} submitted "${complaint.title}". Status: ${complaint.status}.`,
          time: formatDate(complaint.created_at),
          timestamp: complaint.created_at
            ? new Date(complaint.created_at).getTime()
            : 0,
          type: "complaint"
        });
      });

      // ==========================================
      // NOTICE NOTIFICATIONS
      // ==========================================

      notices.forEach((notice) => {
        allNotifications.push({
          id: `notice-${notice.notice_id}`,
          icon: "📢",
          title: "New Society Notice",
          message: notice.title,
          time: formatDate(notice.created_at),
          timestamp: notice.created_at
            ? new Date(notice.created_at).getTime()
            : 0,
          type: "notice"
        });
      });

      // ==========================================
      // POLL NOTIFICATIONS
      // ==========================================

      polls.forEach((poll) => {
        const totalVotes = (poll.options || []).reduce(
          (total, option) => {
            return total + Number(option.vote_count || 0);
          },
          0
        );

        allNotifications.push({
          id: `poll-${poll.poll_id}`,
          icon: "🗳️",
          title: "Poll Activity",
          message: `"${poll.question}" currently has ${totalVotes} vote${
            totalVotes === 1 ? "" : "s"
          }.`,
          time: formatDate(poll.created_at),
          timestamp: poll.created_at
            ? new Date(poll.created_at).getTime()
            : 0,
          type: "poll"
        });
      });

      // ==========================================
      // DATABASE NOTIFICATIONS
      // ==========================================

      databaseNotifications.forEach((notification) => {
        allNotifications.push({
          id: `database-${notification.notification_id}`,
          icon: "🔔",
          title: notification.title,
          message: notification.message,
          time: formatDate(notification.created_at),
          timestamp: notification.created_at
            ? new Date(notification.created_at).getTime()
            : 0,
          type: "database",
          isRead: notification.is_read
        });
      });

      // ==========================================
      // NEWEST FIRST
      // ==========================================

      allNotifications.sort(
        (a, b) => b.timestamp - a.timestamp
      );

      setNotifications(allNotifications);
    } catch (error) {
      console.error(
        "Error loading notifications:",
        error
      );

      setError(
        error.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SEND NOTIFICATION
  // ==========================================

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!selectedResident) {
      alert("Please select a resident.");
      return;
    }

    if (!notificationTitle.trim()) {
      alert("Please enter a notification title.");
      return;
    }

    if (!notificationMessage.trim()) {
      alert("Please enter a notification message.");
      return;
    }

    try {
      setSending(true);

      const resident = residents.find(
        (item) =>
          String(item.resident_id) ===
          String(selectedResident)
      );

      if (!resident) {
        alert("Selected resident not found.");
        return;
      }

      const userId =
        resident.user_id ||
        resident.userId;

      if (!userId) {
        alert(
          "User ID not found for this resident."
        );
        return;
      }

      await createNotification({
        user_id: Number(userId),
        title: notificationTitle.trim(),
        message: notificationMessage.trim()
      });

      alert("Notification sent successfully! 🔔");

      setSelectedResident("");
      setNotificationTitle("");
      setNotificationMessage("");

      setShowForm(false);

      await loadNotifications();
    } catch (error) {
      console.error(
        "Error sending notification:",
        error
      );

      alert(
        error.message ||
          "Failed to send notification."
      );
    } finally {
      setSending(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadNotifications();
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dashboard-page">

      <AdminSidebar activePage="notifications" />

      <main className="dashboard-main admin-notifications-page">

        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="notifications-page-header">

          <div>
            <span className="notifications-eyebrow">
              SOCIETY MANAGEMENT
            </span>

            <h1>Notifications</h1>

            <p>
              Stay updated with society activity
              and send important messages to residents.
            </p>
          </div>

          <div className="notifications-header-actions">

            <button
              className="notification-refresh-btn"
              onClick={loadNotifications}
            >
              ↻ Refresh
            </button>

            <button
              className="send-notification-header-btn"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              🔔{" "}
              {showForm
                ? "Close Form"
                : "Send Notification"}
            </button>

          </div>

        </header>

        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (
          <div className="notification-error">
            ⚠️ {error}
          </div>
        )}

        {/* ==========================================
            SEND NOTIFICATION
        ========================================== */}

        {showForm && (
          <section className="send-notification-card">

            <div className="send-notification-heading">

              <div className="send-notification-icon">
                🔔
              </div>

              <div>
                <h2>Send Notification</h2>

                <p>
                  Send a message directly to a resident.
                </p>
              </div>

            </div>

            <form
              onSubmit={handleSendNotification}
              className="notification-form"
            >

              <div className="notification-form-grid">

                {/* RESIDENT */}

                <div className="form-group">

                  <label htmlFor="resident">
                    Select Resident
                  </label>

                  <select
                    id="resident"
                    value={selectedResident}
                    onChange={(e) =>
                      setSelectedResident(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Choose a resident
                    </option>

                    {residents.map((resident) => (
                      <option
                        key={resident.resident_id}
                        value={resident.resident_id}
                      >
                        {resident.name} - Flat{" "}
                        {resident.flat_number}
                      </option>
                    ))}

                  </select>

                </div>

                {/* TITLE */}

                <div className="form-group">

                  <label htmlFor="notificationTitle">
                    Notification Title
                  </label>

                  <input
                    id="notificationTitle"
                    type="text"
                    placeholder="Example: Maintenance Reminder"
                    value={notificationTitle}
                    onChange={(e) =>
                      setNotificationTitle(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* MESSAGE */}

              <div className="form-group message-form-group">

                <label htmlFor="notificationMessage">
                  Message
                </label>

                <textarea
                  id="notificationMessage"
                  rows="5"
                  placeholder="Write your notification message here..."
                  value={notificationMessage}
                  onChange={(e) =>
                    setNotificationMessage(
                      e.target.value
                    )
                  }
                />

              </div>

              {/* BUTTONS */}

              <div className="notification-form-actions">

                <button
                  type="button"
                  className="cancel-notification-btn"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedResident("");
                    setNotificationTitle("");
                    setNotificationMessage("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-notification-btn"
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : "🔔 Send Notification"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ==========================================
            RECENT NOTIFICATIONS
        ========================================== */}

        <section className="recent-notifications-card">

          <div className="recent-notifications-header">

            <div>
              <h2>Recent Notifications</h2>

              <p>
                Latest activity from your society.
              </p>
            </div>

            <span className="notification-count">
              {notifications.length}{" "}
              {notifications.length === 1
                ? "notification"
                : "notifications"}
            </span>

          </div>

          <div className="admin-notifications-list">

            {/* LOADING */}

            {loading ? (

              <div className="notification-loading">

                <div className="loading-spinner"></div>

                <p>
                  Loading notifications...
                </p>

              </div>

            ) : notifications.length === 0 ? (

              /* EMPTY */

              <div className="notification-empty">

                <div className="empty-icon">
                  🔔
                </div>

                <h3>
                  No notifications yet
                </h3>

                <p>
                  Society activity and messages
                  will appear here.
                </p>

              </div>

            ) : (

              /* NOTIFICATION LIST */

              notifications.map(
                (notification) => (

                  <div
                    className="admin-notification-item"
                    key={notification.id}
                  >

                    {/* ICON */}

                    <div
                      className={`admin-notification-icon notification-icon-${notification.type}`}
                    >
                      {notification.icon}
                    </div>

                    {/* CONTENT */}

                    <div className="admin-notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title}
                        </h3>

                        {notification.type ===
                          "database" &&
                          !notification.isRead && (
                            <span className="unread-badge">
                              New
                            </span>
                          )}

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <span className="notification-date">
                        🕒 {notification.time}
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminNotifications;