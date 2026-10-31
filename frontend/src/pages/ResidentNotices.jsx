import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import { getNotices } from "../api/noticeApi";

function ResidentNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getNotices();

      const formattedNotices = data.map((notice) => ({
        id: notice.notice_id,
        title: notice.title,
        description: notice.description,
        date: new Date(notice.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })
      }));

      setNotices(formattedNotices);
    } catch (error) {
      console.error("Failed to load notices:", error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNotice = (notice) => {
    alert(
      `${notice.title}\n\n${notice.description}\n\nDate: ${notice.date}`
    );
  };

  return (
    <div className="dashboard-page">
      <ResidentSidebar activePage="notices" />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Notices</h1>
            <p>
              View important society announcements and notices.
            </p>
          </div>
        </header>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Society Notices</h2>
          </div>

          <div className="notices-list">
            {loading ? (
              <p>Loading notices...</p>
            ) : notices.length === 0 ? (
              <p>No notices available.</p>
            ) : (
              notices.map((notice) => (
                <div
                  className="resident-notice-card"
                  key={notice.id}
                >
                  <div className="notice-icon">
                    📢
                  </div>

                  <div className="notice-content">
                    <h2>{notice.title}</h2>

                    <p>{notice.description}</p>

                    <span className="notice-date">
                      📅 {notice.date}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="view-notice-button"
                    onClick={() => handleViewNotice(notice)}
                  >
                    View Notice
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResidentNotices;