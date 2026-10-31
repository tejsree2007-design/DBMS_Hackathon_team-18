import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";

import {
  getNotifications,
  markNotificationAsRead
} from "../api/notificationApi";


function ResidentNotifications() {

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );


  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


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


    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications = async () => {

    try {

      setLoading(true);

      setError("");


      if (!currentResident) {

        setError(
          "Please login again to view notifications."
        );

        setLoading(false);

        return;
      }


      // ==========================================
      // GET NOTIFICATIONS FROM DATABASE
      // ==========================================

      const data =
        await getNotifications();


      // ==========================================
      // GET CURRENT USER ID
      // ==========================================

      const currentUserId =
        currentResident.userId ||
        currentResident.user_id;


      if (!currentUserId) {

        setError(
          "User information not found. Please login again."
        );

        setLoading(false);

        return;
      }


      // ==========================================
      // SHOW ONLY CURRENT RESIDENT'S NOTIFICATIONS
      // ==========================================

      const residentNotifications =
        data.filter(
          (notification) =>
            Number(notification.user_id) ===
            Number(currentUserId)
        );


      // ==========================================
      // NEWEST FIRST
      // ==========================================

      residentNotifications.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );


      setNotifications(
        residentNotifications
      );

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
  // LOAD WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {

    loadNotifications();

  }, []);


  // ==========================================
  // VIEW / MARK AS READ
  // ==========================================

  const handleNotification = async (
    notification
  ) => {

    try {

      // ==========================================
      // MARK AS READ
      // ==========================================

      if (!notification.is_read) {

        await markNotificationAsRead(
          notification.notification_id
        );


        // Update UI immediately

        setNotifications(
          (previousNotifications) =>
            previousNotifications.map(
              (item) =>
                item.notification_id ===
                notification.notification_id
                  ? {
                      ...item,
                      is_read: 1
                    }
                  : item
            )
        );

      }


      // ==========================================
      // SHOW NOTIFICATION
      // ==========================================

      alert(
        `${notification.title}\n\n${notification.message}\n\nDate: ${formatDate(
          notification.created_at
        )}`
      );

    } catch (error) {

      console.error(
        "Error marking notification as read:",
        error
      );

      alert(
        error.message ||
        "Failed to update notification."
      );

    }

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="dashboard-page">

      <ResidentSidebar
        activePage="notifications"
      />


      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <h1>
              Notifications
            </h1>

            <p>
              View important updates and notifications.
            </p>

          </div>

        </header>


        {/* ERROR */}

        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        {/* NOTIFICATIONS */}

        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              My Notifications
            </h2>

          </div>


          <div className="notifications-list">

            {/* LOADING */}

            {loading ? (

              <p className="no-notifications">
                Loading notifications...
              </p>

            ) : notifications.length === 0 ? (

              <p className="no-notifications">
                No notifications available.
              </p>

            ) : (

              notifications.map(
                (notification) => (

                  <div
                    className={`resident-notification-card ${
                      Number(notification.is_read) === 1
                        ? "read-notification"
                        : "unread-notification"
                    }`}
                    key={
                      notification.notification_id
                    }
                  >

                    {/* ICON */}

                    <div className="notification-icon">

                      🔔

                    </div>


                    {/* CONTENT */}

                    <div className="notification-content">

                      <h2>

                        {notification.title}

                      </h2>


                      <p>

                        {notification.message}

                      </p>


                      <span className="notification-date">

                        📅{" "}
                        {formatDate(
                          notification.created_at
                        )}

                      </span>


                      {/* READ STATUS */}

                      <span className="notification-status">

                        {Number(
                          notification.is_read
                        ) === 1
                          ? "✓ Read"
                          : "● Unread"}

                      </span>

                    </div>


                    {/* VIEW BUTTON */}

                    <button
                      type="button"
                      className="view-notification-button"
                      onClick={() =>
                        handleNotification(
                          notification
                        )
                      }
                    >

                      View

                    </button>

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


export default ResidentNotifications;