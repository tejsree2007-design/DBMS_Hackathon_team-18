import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getResidents,
  deleteResident
} from "../api/residentApi";

function AdminResidents() {

  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ==========================================
  // FETCH RESIDENTS FROM BACKEND
  // ==========================================
  useEffect(() => {

    const loadResidents = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getResidents();

        setResidents(data);

      } catch (error) {

        console.error(
          "Error loading residents:",
          error
        );

        setError(
          "Failed to load residents from the server."
        );

      } finally {

        setLoading(false);

      }
    };

    loadResidents();

  }, []);


  // ==========================================
  // DELETE RESIDENT
  // ==========================================
  const handleDeleteResident = async (resident) => {

    const confirmed = window.confirm(
      `Are you sure you want to remove ${resident.name} from the society?`
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");

      await deleteResident(resident.resident_id);

      // Remove resident from the current list
      setResidents((prevResidents) =>
        prevResidents.filter(
          (item) =>
            item.resident_id !== resident.resident_id
        )
      );

    } catch (error) {

      console.error(
        "Error deleting resident:",
        error
      );

      setError(
        "Failed to delete resident."
      );

    }
  };


  // ==========================================
  // SEARCH RESIDENTS
  // ==========================================
  const filteredResidents = residents.filter(
    (resident) =>
      resident.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      resident.flat_number
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      resident.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );


  return (
    <div className="dashboard-page">

      {/* Admin Sidebar */}
      <AdminSidebar activePage="residents" />


      {/* Main Content */}
      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <h1>
              Residents
            </h1>

            <p>
              Manage residents and their flat information.
            </p>

          </div>

        </header>


        {/* Resident List */}
        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              Resident List
            </h2>

          </div>


          {/* Search */}
          <div className="admin-search-container">

            <input
              className="admin-search"
              type="text"
              placeholder="Search by name, flat number or email"
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


          {/* Residents Table */}
          <div className="admin-table-container">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Flat Number
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="admin-empty-state"
                    >
                      Loading residents...
                    </td>

                  </tr>

                ) : filteredResidents.length > 0 ? (

                  filteredResidents.map(
                    (resident) => (

                      <tr
                        key={resident.resident_id}
                      >

                        <td>

                          <strong>
                            {resident.name}
                          </strong>

                        </td>


                        <td>
                          {resident.flat_number}
                        </td>


                        <td>
                          {resident.email}
                        </td>


                        <td>
                          {resident.phone || "Not provided"}
                        </td>


                        <td>

                          <button
                            className="admin-delete-button"
                            onClick={() =>
                              handleDeleteResident(resident)
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="admin-empty-state"
                    >
                      No residents found.
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

export default AdminResidents;