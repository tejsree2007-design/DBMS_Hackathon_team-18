import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { getVisitors } from "../api/visitorApi";

function AdminVisitors() {

  const [visitors, setVisitors] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD VISITORS FROM BACKEND
  // ==========================================

  useEffect(() => {

    const loadVisitors = async () => {

      try {

        setLoading(true);

        setError("");

        const data = await getVisitors();

        setVisitors(data);

      } catch (error) {

        console.error(
          "Error loading visitors:",
          error
        );

        setError(
          "Failed to load visitors from the server."
        );

      } finally {

        setLoading(false);

      }

    };

    loadVisitors();

  }, []);


  // ==========================================
  // SEARCH VISITORS
  // ==========================================

  const filteredVisitors = visitors.filter(
    (visitor) =>

      visitor.visitor_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      visitor.resident_name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      visitor.flat_number
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (visitor.purpose || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  // ==========================================
  // TODAY'S DATE
  // ==========================================

  const today =
    new Date().toISOString().split("T")[0];


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalVisitors =
    visitors.length;


  const todayVisitors =
    visitors.filter(
      (visitor) =>
        visitor.visit_date === today
    ).length;


  const registeredResidents =
    new Set(
      visitors.map(
        (visitor) => visitor.resident_id
      )
    ).size;


  const expectedVisitors =
    visitors.filter(
      (visitor) =>
        visitor.status === "Expected"
    ).length;


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN"
    );

  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (time) => {

    if (!time) {
      return "-";
    }

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit"
      }
    );

  };


  return (

    <div className="dashboard-page">


      {/* Admin Sidebar */}

      <AdminSidebar
        activePage="visitors"
      />


      <main className="dashboard-main">


        {/* Header */}

        <header className="dashboard-header">

          <div>

            <h1>
              Visitors
            </h1>

            <p>
              View and manage visitors added by residents.
            </p>

          </div>

        </header>


        {/* Visitor Statistics */}

        <section className="dashboard-stats">


          {/* Total Visitors */}

          <div className="stat-card">

            <div className="stat-icon">
              🚗
            </div>

            <div>

              <h3>
                {totalVisitors}
              </h3>

              <p>
                Total Visitors
              </p>

            </div>

          </div>


          {/* Today's Visitors */}

          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>

              <h3>
                {todayVisitors}
              </h3>

              <p>
                Today's Visitors
              </p>

            </div>

          </div>


          {/* Registered Residents */}

          <div className="stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <h3>
                {registeredResidents}
              </h3>

              <p>
                Residents With Visitors
              </p>

            </div>

          </div>


          {/* Expected Visitors */}

          <div className="stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <h3>
                {expectedVisitors}
              </h3>

              <p>
                Expected Visitors
              </p>

            </div>

          </div>

        </section>


        {/* Visitor List */}

        <section className="dashboard-card admin-visitors-card">


          <div className="card-header">

            <h2>
              Visitor List
            </h2>

          </div>


          {/* Search */}

          <div className="input-group">

            <label>
              Search Visitors
            </label>

            <input
              type="text"
              placeholder="Search by visitor name, resident, flat or purpose"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Error */}

          {error && (

            <p className="admin-error">
              {error}
            </p>

          )}


          {/* Table */}

          <div className="table-container">

            <table>

              <thead>

                <tr>

                  <th>
                    Visitor Name
                  </th>

                  <th>
                    Resident
                  </th>

                  <th>
                    Flat Number
                  </th>

                  <th>
                    Purpose
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Time
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="7"
                    >
                      Loading visitors...
                    </td>

                  </tr>

                ) : filteredVisitors.length > 0 ? (

                  filteredVisitors.map(
                    (visitor) => (

                      <tr
                        key={visitor.visitor_id}
                      >

                        <td>
                          <strong>
                            {visitor.visitor_name}
                          </strong>
                        </td>

                        <td>
                          {visitor.resident_name}
                        </td>

                        <td>
                          {visitor.flat_number}
                        </td>

                        <td>
                          {visitor.purpose || "-"}
                        </td>

                        <td>
                          {formatDate(
                            visitor.visit_date
                          )}
                        </td>

                        <td>
                          {formatTime(
                            visitor.visit_time
                          )}
                        </td>

                        <td>

                          <span
                            className={`payment-status ${
                              visitor.status
                                ? visitor.status.toLowerCase()
                                : ""
                            }`}
                          >
                            {visitor.status || "-"}
                          </span>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                    >
                      No visitors found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


        </section>

      </main>

    </div>

  );

}


export default AdminVisitors;