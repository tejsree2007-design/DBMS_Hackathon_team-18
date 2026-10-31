import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import {
  getVisitors,
  createVisitor,
  deleteVisitor
} from "../api/visitorApi";

function ResidentVisitors() {

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );

  const [visitors, setVisitors] = useState([]);

  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("AM");

  // ==========================================
  // LOAD VISITORS FROM BACKEND
  // ==========================================
  useEffect(() => {

    const loadVisitors = async () => {

      try {

        const data = await getVisitors();

        const residentVisitors = data.filter(
          (visitor) =>
            Number(visitor.resident_id) ===
            Number(currentResident?.residentId)
        );

        setVisitors(residentVisitors);

      } catch (error) {

        console.error(
          "Error loading visitors:",
          error
        );

        alert("Failed to load visitors.");

      }
    };

    if (currentResident?.residentId) {
      loadVisitors();
    }

  }, [currentResident?.residentId]);


  // ==========================================
  // ADD VISITOR
  // ==========================================
  const handleAddVisitor = async (e) => {

    e.preventDefault();

    if (!currentResident?.residentId) {
      alert("Resident information not found.");
      return;
    }

    try {

      // Convert 12-hour time to 24-hour time
      let hour24 = Number(hour);

      if (ampm === "PM" && hour24 !== 12) {
        hour24 += 12;
      }

      if (ampm === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      const formattedTime =
        `${String(hour24).padStart(2, "0")}:${minute}:00`;

      const newVisitor = {
        resident_id: currentResident.residentId,
        visitor_name: name,
        visitor_phone: null,
        visit_date: date,
        visit_time: formattedTime,
        purpose: purpose
      };

      await createVisitor(newVisitor);

      // Reload visitors from backend
      const data = await getVisitors();

      const residentVisitors = data.filter(
        (visitor) =>
          Number(visitor.resident_id) ===
          Number(currentResident.residentId)
      );

      setVisitors(residentVisitors);

      // Clear form
      setName("");
      setPurpose("");
      setDate("");
      setHour("");
      setMinute("");
      setAmpm("AM");

      alert("Visitor added successfully!");

    } catch (error) {

      console.error(
        "Error adding visitor:",
        error
      );

      alert(
        error.message ||
        "Failed to add visitor."
      );
    }
  };


  // ==========================================
  // DELETE VISITOR
  // ==========================================
  const handleDelete = async (visitorId) => {

    try {

      await deleteVisitor(visitorId);

      setVisitors(
        visitors.filter(
          (visitor) =>
            visitor.visitor_id !== visitorId
        )
      );

    } catch (error) {

      console.error(
        "Error deleting visitor:",
        error
      );

      alert(
        error.message ||
        "Failed to delete visitor."
      );
    }
  };


  return (
    <div className="dashboard-page">

      <ResidentSidebar activePage="visitors" />

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>
            <h1>Visitors</h1>

            <p>
              Add and manage your expected visitors.
            </p>
          </div>

        </header>


        <section className="dashboard-card">

          <div className="card-header">
            <h2>Add Visitor</h2>
          </div>


          <form onSubmit={handleAddVisitor}>

            <div className="input-group">

              <label>Visitor Name</label>

              <input
                type="text"
                placeholder="Enter visitor name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />

            </div>


            <div className="input-group">

              <label>Purpose</label>

              <input
                type="text"
                placeholder="Example: Personal Visit"
                value={purpose}
                onChange={(e) =>
                  setPurpose(e.target.value)
                }
                required
              />

            </div>


            <div className="input-group">

              <label>Visit Date</label>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                required
              />

            </div>


            <div className="input-group">

              <label>Visit Time</label>

              <div>

                <select
                  value={hour}
                  onChange={(e) =>
                    setHour(e.target.value)
                  }
                  required
                >
                  <option value="">Hour</option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>


                <select
                  value={minute}
                  onChange={(e) =>
                    setMinute(e.target.value)
                  }
                  required
                >
                  <option value="">Minute</option>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>


                <select
                  value={ampm}
                  onChange={(e) =>
                    setAmpm(e.target.value)
                  }
                  required
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>

              </div>

            </div>


            <button
              type="submit"
              className="auth-button"
            >
              + Add Visitor
            </button>

          </form>

        </section>


        <section className="dashboard-card activity-card">

          <div className="card-header">
            <h2>My Visitors</h2>
          </div>


          {visitors.length > 0 ? (

            visitors.map((visitor) => (

              <div
                className="activity-item"
                key={visitor.visitor_id}
              >

                <span>🚗</span>

                <div>

                  <strong>
                    {visitor.visitor_name}
                  </strong>

                  <p>
                    {visitor.purpose} •{" "}
                    {visitor.visit_date} •{" "}
                    {visitor.visit_time}
                  </p>

                  <small>
                    {visitor.status}
                  </small>

                </div>


                <button
                  onClick={() =>
                    handleDelete(
                      visitor.visitor_id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            ))

          ) : (

            <p>
              No visitors added yet.
            </p>

          )}

        </section>

      </main>

    </div>
  );
}

export default ResidentVisitors;