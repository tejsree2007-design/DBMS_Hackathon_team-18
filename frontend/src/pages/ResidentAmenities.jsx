import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import {
  getAmenities,
  getAmenityBookings,
  createAmenityBooking,
  deleteAmenityBooking
} from "../api/amenityApi";

function ResidentAmenities() {

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );

  const [amenities, setAmenities] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD AMENITIES AND BOOKINGS
  // ==========================================

  const loadData = async () => {

    try {

      setLoading(true);

      const [amenityData, bookingData] =
        await Promise.all([
          getAmenities(),
          getAmenityBookings()
        ]);

      setAmenities(amenityData);

      const myBookings = bookingData.filter(
        (booking) =>
          Number(booking.resident_id) ===
          Number(currentResident?.residentId)
      );

      setBookings(myBookings);

    } catch (error) {

      console.error(
        "Error loading amenities:",
        error
      );

      alert(
        error.message ||
        "Failed to load amenities."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    if (currentResident?.residentId) {
      loadData();
    }

  }, [currentResident?.residentId]);


  // ==========================================
  // OPEN BOOKING FORM
  // ==========================================

  const handleBook = (amenity) => {

    setSelectedAmenity(amenity);

    setBookingDate("");
    setBookingTime("");
    setEndTime("");

    setShowForm(true);

  };


  // ==========================================
  // CREATE BOOKING
  // ==========================================

  const handleBooking = async (e) => {

    e.preventDefault();

    if (!currentResident?.residentId) {

      alert(
        "Please login again."
      );

      return;
    }

    if (!selectedAmenity) {

      alert(
        "Please select an amenity."
      );

      return;
    }

    if (!bookingDate ||
        !bookingTime ||
        !endTime) {

      alert(
        "Please select date, start time and end time."
      );

      return;
    }


    if (endTime <= bookingTime) {

      alert(
        "End time must be later than start time."
      );

      return;
    }


    try {

      await createAmenityBooking({

        amenity_id:
          selectedAmenity.amenity_id,

        resident_id:
          currentResident.residentId,

        booking_date:
          bookingDate,

        start_time:
          bookingTime,

        end_time:
          endTime

      });


      alert(
        "Booking confirmed!"
      );


      setShowForm(false);

      setSelectedAmenity(null);

      setBookingDate("");
      setBookingTime("");
      setEndTime("");


      await loadData();

    } catch (error) {

      console.error(
        "Error creating booking:",
        error
      );

      alert(
        error.message ||
        "Failed to create booking."
      );

    }

  };


  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const handleCancelBooking = async (
    bookingId
  ) => {

    try {

      await deleteAmenityBooking(
        bookingId
      );


      alert(
        "Booking cancelled successfully!"
      );


      await loadData();

    } catch (error) {

      console.error(
        "Error cancelling booking:",
        error
      );

      alert(
        error.message ||
        "Failed to cancel booking."
      );

    }

  };


  return (

    <div className="dashboard-page">

      <ResidentSidebar
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
              View and book society amenities.
            </p>

          </div>

        </header>


        {/* ==========================================
            AVAILABLE AMENITIES
        ========================================== */}

        <section
          className="dashboard-card amenities-section"
        >

          <div className="card-header">

            <h2>
              Available Amenities
            </h2>

          </div>


          {loading ? (

            <p className="no-bookings">
              Loading amenities...
            </p>

          ) : amenities.length === 0 ? (

            <p className="no-bookings">
              No amenities are currently available.
            </p>

          ) : (

            <div className="amenities-grid">

              {amenities.map(
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


                    {amenity.status ===
                      "Available" && (

                      <button
                        type="button"
                        className="book-amenity-button"
                        onClick={() =>
                          handleBook(
                            amenity
                          )
                        }
                      >
                        Book Amenity
                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ==========================================
            BOOKING FORM
        ========================================== */}

        {showForm &&
          selectedAmenity && (

          <section
            className="dashboard-card booking-section"
          >

            <div className="card-header">

              <h2>
                Book{" "}
                {selectedAmenity.name}
              </h2>

            </div>


            <form
              onSubmit={
                handleBooking
              }
            >

              <div className="input-group">

                <label>
                  Select Date
                </label>

                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) =>
                    setBookingDate(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Start Time
                </label>

                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) =>
                    setBookingTime(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="booking-buttons">

                <button
                  type="submit"
                  className="confirm-booking-button"
                >
                  Confirm Booking
                </button>


                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {

                    setShowForm(
                      false
                    );

                    setSelectedAmenity(
                      null
                    );

                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </section>

        )}


        {/* ==========================================
            MY BOOKINGS
        ========================================== */}

        <section
          className="dashboard-card my-bookings-section"
        >

          <div className="card-header">

            <h2>
              My Bookings
            </h2>

          </div>


          {bookings.length === 0 ? (

            <p className="no-bookings">
              You don't have any
              amenity bookings yet.
            </p>

          ) : (

            <div className="booking-list">

              {bookings.map(
                (booking) => (

                  <div
                    className="booking-item"
                    key={
                      booking.booking_id
                    }
                  >

                    <div>

                      <h3>
                        {
                          booking.amenity_name
                        }
                      </h3>


                      <p>
                        📅 Date:{" "}
                        {
                          booking.booking_date
                        }
                      </p>


                      <p>
                        🕐 Time:{" "}
                        {
                          booking.start_time
                        }
                        {" - "}
                        {
                          booking.end_time
                        }
                      </p>

                    </div>


                    <div
                      className="booking-actions"
                    >

                      <span
                        className="booking-status"
                      >
                        {
                          booking.status
                        }
                      </span>


                      {booking.status ===
                        "Booked" && (

                        <button
                          type="button"
                          className="cancel-booking-button"
                          onClick={() =>
                            handleCancelBooking(
                              booking.booking_id
                            )
                          }
                        >
                          Cancel Booking
                        </button>

                      )}

                    </div>

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

export default ResidentAmenities;