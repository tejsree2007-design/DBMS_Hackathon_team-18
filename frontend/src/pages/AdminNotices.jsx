import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getNotices,
  createNotice
} from "../api/noticeApi";

function AdminNotices() {

  const [notices, setNotices] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD NOTICES FROM BACKEND
  // ==========================================

  useEffect(() => {

    const loadNotices = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getNotices();

        setNotices(data);

      } catch (error) {

        console.error(
          "Error loading notices:",
          error
        );

        setError(
          "Failed to load notices from the server."
        );

      } finally {

        setLoading(false);

      }

    };


    loadNotices();

  }, []);


  // ==========================================
  // ADD NOTICE
  // ==========================================

  const handleAddNotice = async (e) => {

    e.preventDefault();


    if (!title || !description) {

      alert(
        "Please fill all fields."
      );

      return;

    }


    try {

      const newNotice = await createNotice({
        title: title,
        description: description,
        
      });


      alert(
        "Notice added successfully!"
      );


      // Reload notices from backend
      const updatedNotices =
        await getNotices();

      setNotices(updatedNotices);


      setTitle("");

      setDescription("");

      setShowForm(false);


    } catch (error) {

      console.error(
        "Error creating notice:",
        error
      );

      alert(
        "Failed to add notice."
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

      <AdminSidebar activePage="notices" />


      <main className="dashboard-main">


        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              Notices
            </h1>

            <p>
              Manage society notices and announcements.
            </p>

          </div>


          <button
            className="add-notice-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >

            {showForm
              ? "✕ Close"
              : "＋ Add Notice"}

          </button>

        </header>


        {/* Error */}

        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        {/* Add Notice Form */}

        {showForm && (

          <section className="dashboard-card admin-notice-form">

            <div className="card-header">

              <h2>
                Create New Notice
              </h2>

            </div>


            <form onSubmit={handleAddNotice}>

              <div className="notice-form-grid">


                {/* Title */}

                <div className="input-group">

                  <label>
                    Notice Title
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Water Supply Maintenance"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />

                </div>


                {/* Description */}

                <div className="input-group notice-description-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    placeholder="Enter notice details..."
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  ></textarea>

                </div>


              </div>


              <button
                type="submit"
                className="confirm-notice-button"
              >
                Add Notice
              </button>

            </form>

          </section>

        )}


        {/* Notices */}

        <section className="dashboard-card admin-notices-card">


          <div className="card-header">

            <h2>
              Society Notices
            </h2>

          </div>


          <div className="notices-list">


            {/* Loading */}

            {loading ? (

              <p className="admin-notices-empty">
                Loading notices...
              </p>


            ) : notices.length === 0 ? (

              <p className="admin-notices-empty">
                No notices available.
              </p>


            ) : (

              notices.map((notice) => (

                <div
                  className="admin-notice-item"
                  key={notice.notice_id}
                >


                  <div className="admin-notice-icon">
                    📢
                  </div>


                  <div className="admin-notice-content">


                    <div className="admin-notice-title-row">

                      <h3>
                        {notice.title}
                      </h3>


                      <span>
                        {formatDate(
                          notice.created_at
                        )}
                      </span>

                    </div>


                    <p>
                      {notice.description}
                    </p>


                  </div>


                </div>

              ))

            )}

          </div>

        </section>


      </main>

    </div>

  );

}


export default AdminNotices;