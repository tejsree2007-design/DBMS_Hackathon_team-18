import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getAmenities,
  createAmenity,
  deleteAmenity,
  getAmenityBookings
} from "../api/amenityApi";

function AdminAmenities() {

  const [amenities, setAmenities] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [capacity, setCapacity] = useState("");

  const [bookingFee, setBookingFee] =
    useState("");

  const [status, setStatus] =
    useState("Available");

  const [loading, setLoading] =
    useState(true);

  const [bookingsLoading, setBookingsLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD AMENITIES AND BOOKINGS
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);

        setBookingsLoading(true);

        setError("");


        // Load amenities
        const amenityData =
          await getAmenities();

        setAmenities(
          amenityData
        );


        // Load resident bookings
        const bookingData =
          await getAmenityBookings();

        setBookings(
          bookingData
        );


      } catch (error) {

        console.error(
          "Error loading amenities/bookings:",
          error
        );

        setError(
          "Failed to load amenities or bookings from the server."
        );


      } finally {

        setLoading(false);

        setBookingsLoading(false);

      }

    };


    loadData();

  }, []);


  // ==========================================
  // ADD AMENITY
  // ==========================================

  const handleAddAmenity = async (e) => {

    e.preventDefault();


    if (!name || !capacity) {

      alert(
        "Please fill the required fields."
      );

      return;

    }


    try {

      await createAmenity({

        name: name,

        description:
          description || null,

        capacity:
          Number(capacity),

        booking_fee:
          bookingFee
            ? Number(bookingFee)
            : 0,

        status: status

      });


      alert(
        "Amenity added successfully!"
      );


      // Reload amenities
      const updatedAmenities =
        await getAmenities();

      setAmenities(
        updatedAmenities
      );


      // Clear form
      setName("");

      setDescription("");

      setCapacity("");

      setBookingFee("");

      setStatus("Available");

      setShowForm(false);


    } catch (error) {

      console.error(
        "Error creating amenity:",
        error
      );

      alert(
        error.message ||
        "Failed to add amenity."
      );

    }

  };


  // ==========================================
  // DELETE AMENITY
  // ==========================================

  const handleDeleteAmenity = async (amenityId) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this amenity?"
      );


    if (!confirmed) {

      return;

    }


    try {

      await deleteAmenity(
        amenityId
      );


      alert(
        "Amenity deleted successfully!"
      );


      // Reload amenities
      const updatedAmenities =
        await getAmenities();

      setAmenities(
        updatedAmenities
      );


    } catch (error) {

      console.error(
        "Error deleting amenity:",
        error
      );


      alert(
        error.message ||
        "Failed to delete amenity."
      );

    }

  };


  return (

    <div className="dashboard-page">

      <AdminSidebar
        activePage="amenities"
      />


      <main className="dashboard-main">


        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="dashboard-header">

          <div>

            <h1>
              Amenities
            </h1>

            <p>
              Manage society amenities and facilities.
            </p>

          </div>


          <button
            className="add-amenity-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >

            {showForm
              ? "✕ Close"
              : "＋ Add Amenity"}

          </button>

        </header>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        {/* ==========================================
            ADD AMENITY FORM
        ========================================== */}

        {showForm && (

          <section className="dashboard-card admin-amenity-form">

            <div className="card-header">

              <h2>
                Add New Amenity
              </h2>

            </div>


            <form
              onSubmit={
                handleAddAmenity
              }
            >

              <div className="amenity-form-grid">


                {/* Name */}

                <div className="input-group">

                  <label>
                    Amenity Name
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Swimming Pool"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* Description */}

                <div className="input-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    placeholder="Describe the amenity..."
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  ></textarea>

                </div>


                {/* Capacity */}

                <div className="input-group">

                  <label>
                    Capacity
                  </label>

                  <input
                    type="number"
                    placeholder="Example: 30"
                    value={capacity}
                    onChange={(e) =>
                      setCapacity(
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* Booking Fee */}

                <div className="input-group">

                  <label>
                    Booking Fee
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Example: 500"
                    value={bookingFee}
                    onChange={(e) =>
                      setBookingFee(
                        e.target.value
                      )
                    }
                  />

                </div>


                {/* Status */}

                <div className="input-group">

                  <label>
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value
                      )
                    }
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>

                  </select>

                </div>


              </div>


              <button
                type="submit"
                className="confirm-amenity-button"
              >

                Add Amenity

              </button>

            </form>

          </section>

        )}


        {/* ==========================================
            SOCIETY AMENITIES
        ========================================== */}

        <section className="dashboard-card admin-amenities-card">

          <div className="card-header">

            <h2>
              Society Amenities
            </h2>

          </div>


          <div className="amenities-grid">


            {loading ? (

              <p>
                Loading amenities...
              </p>


            ) : amenities.length === 0 ? (

              <p>
                No amenities available.
              </p>


            ) : (

              amenities.map(
                (amenity) => (

                  <div
                    className="amenity-card"
                    key={
                      amenity.amenity_id
                    }
                  >


                    <div className="amenity-icon">
                      🏢
                    </div>


                    <h2>
                      {amenity.name}
                    </h2>


                    <p>

                      📝{" "}

                      <strong>
                        Description:
                      </strong>{" "}

                      {amenity.description ||
                        "No description"}

                    </p>


                    <p>

                      👥{" "}

                      <strong>
                        Capacity:
                      </strong>{" "}

                      {amenity.capacity ||
                        "Not specified"}

                    </p>


                    <p>

                      💰{" "}

                      <strong>
                        Booking Fee:
                      </strong>{" "}

                      ₹
                      {amenity.booking_fee}

                    </p>


                    <p>

                      📌{" "}

                      <strong>
                        Status:
                      </strong>{" "}

                      {amenity.status}

                    </p>


                    {/* DELETE AMENITY */}

                    <button
                      type="button"
                      className="cancel-booking-button"
                      onClick={() =>
                        handleDeleteAmenity(
                          amenity.amenity_id
                        )
                      }
                    >

                      Delete Amenity

                    </button>


                  </div>

                )

              )

            )}

          </div>

        </section>


        {/* ==========================================
            RESIDENT AMENITY BOOKINGS
        ========================================== */}

        <section className="dashboard-card admin-amenity-bookings-card">

          <div className="card-header">

            <h2>
              Resident Amenity Bookings
            </h2>

          </div>


          {bookingsLoading ? (

            <p>
              Loading bookings...
            </p>


          ) : bookings.length === 0 ? (

            <p>
              No amenity bookings found.
            </p>


          ) : (

            <div className="amenity-bookings-list">

              {bookings.map(
                (booking) => (

                  <div
                    className="amenity-booking-card"
                    key={
                      booking.booking_id
                    }
                  >

                    <h3>
                      {booking.amenity_name}
                    </h3>


                    <p>

                      👤{" "}

                      <strong>
                        Resident:
                      </strong>{" "}

                      {booking.resident_name}

                    </p>


                    <p>

                      🏠{" "}

                      <strong>
                        Flat:
                      </strong>{" "}

                      {booking.flat_number}

                    </p>


                    <p>

                      📅{" "}

                      <strong>
                        Date:
                      </strong>{" "}

                      {booking.booking_date}

                    </p>


                    <p>

                      🕐{" "}

                      <strong>
                        Time:
                      </strong>{" "}

                      {booking.start_time}
                      {" - "}
                      {booking.end_time}

                    </p>


                    <p>

                      📌{" "}

                      <strong>
                        Status:
                      </strong>{" "}

                      {booking.status}

                    </p>


                  </div>

                )

              )}

            </div>

          )}

        </section>


      </main>

    </div>

  );

}


export default AdminAmenities;