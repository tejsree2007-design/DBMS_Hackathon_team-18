import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import {
  getPolls,
  createPoll,
  updatePollStatus
} from "../api/pollApi";

function AdminPolls() {

  const [polls, setPolls] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [question, setQuestion] = useState("");

  const [option1, setOption1] = useState("");

  const [option2, setOption2] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD POLLS
  // ==========================================

  const loadPolls = async () => {

    try {

      setLoading(true);

      setError("");

      const data = await getPolls();

      setPolls(data);

    } catch (error) {

      console.error(
        "Error loading polls:",
        error
      );

      setError(
        "Failed to load polls from the server."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadPolls();

  }, []);


  // ==========================================
  // CREATE POLL
  // ==========================================

  const handleAddPoll = async (e) => {

    e.preventDefault();

    if (
      !question.trim() ||
      !option1.trim() ||
      !option2.trim()
    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }


    try {

      // Get logged-in Admin information
      const adminData =
        localStorage.getItem("admin");


      if (!adminData) {

        alert(
          "Admin session not found. Please login again."
        );

        return;

      }


      const admin =
        JSON.parse(adminData);


      // Make sure Admin ID exists
      if (!admin.userId) {

        alert(
          "Admin ID not found. Please login again."
        );

        return;

      }


      // Create poll
      await createPoll({

        question:
          question.trim(),

        created_by:
          admin.userId,

        start_date:
          startDate || null,

        end_date:
          endDate || null,

        option1:
          option1.trim(),

        option2:
          option2.trim()

      });


      alert(
        "Poll created successfully!"
      );


      // Reload polls from database
      await loadPolls();


      // Clear form
      setQuestion("");

      setOption1("");

      setOption2("");

      setStartDate("");

      setEndDate("");

      setShowForm(false);


    } catch (error) {

      console.error(
        "Error creating poll:",
        error
      );

      alert(
        error.message ||
        "Failed to create poll."
      );

    }

  };


  // ==========================================
  // CLOSE POLL
  // ==========================================

  const handleClosePoll = async (pollId) => {

    const confirmClose =
      window.confirm(
        "Are you sure you want to close this poll?"
      );


    if (!confirmClose) {

      return;

    }


    try {

      await updatePollStatus(
        pollId,
        "Closed"
      );


      await loadPolls();


    } catch (error) {

      console.error(
        "Error closing poll:",
        error
      );

      alert(
        error.message ||
        "Failed to close poll."
      );

    }

  };


  // ==========================================
  // CALCULATE TOTAL VOTES
  // ==========================================

  const getTotalVotes = (poll) => {

    return poll.options.reduce(
      (total, option) =>
        total +
        Number(option.vote_count || 0),
      0
    );

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "Not set";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  };


  return (

    <div className="dashboard-page">

      <AdminSidebar
        activePage="polls"
      />


      <main className="dashboard-main">

        {/* ==========================================
            HEADER
        ========================================== */}

        <header className="dashboard-header">

          <div>

            <h1>
              Polls
            </h1>

            <p>
              Create and manage society polls.
            </p>

          </div>


          <button
            className="add-poll-button"
            onClick={() =>
              setShowForm(!showForm)
            }
          >

            {showForm
              ? "✕ Close"
              : "＋ Create Poll"}

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
            CREATE POLL FORM
        ========================================== */}

        {showForm && (

          <section className="dashboard-card admin-poll-form">

            <div className="card-header">

              <h2>
                Create New Poll
              </h2>

            </div>


            <form
              onSubmit={handleAddPoll}
            >

              {/* QUESTION */}

              <div className="input-group">

                <label>
                  Poll Question
                </label>

                <input
                  type="text"
                  placeholder="Example: Should we install CCTV cameras?"
                  value={question}
                  onChange={(e) =>
                    setQuestion(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* OPTIONS */}

              <div className="poll-options-grid">

                <div className="input-group">

                  <label>
                    Option 1
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Yes"
                    value={option1}
                    onChange={(e) =>
                      setOption1(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                <div className="input-group">

                  <label>
                    Option 2
                  </label>

                  <input
                    type="text"
                    placeholder="Example: No"
                    value={option2}
                    onChange={(e) =>
                      setOption2(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

              </div>


              {/* DATES */}

              <div className="poll-options-grid">

                <div className="input-group">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) =>
                      setStartDate(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="input-group">

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) =>
                      setEndDate(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* CREATE BUTTON */}

              <button
                type="submit"
                className="confirm-poll-button"
              >
                Create Poll
              </button>

            </form>

          </section>

        )}


        {/* ==========================================
            POLL LIST
        ========================================== */}

        <section className="dashboard-card admin-polls-card">

          <div className="card-header">

            <h2>
              Society Polls
            </h2>

          </div>


          <div className="admin-polls-list">

            {loading ? (

              <p className="admin-polls-empty">
                Loading polls...
              </p>


            ) : polls.length === 0 ? (

              <p className="admin-polls-empty">
                No polls available.
              </p>


            ) : (

              polls.map((poll) => {

                const totalVotes =
                  getTotalVotes(poll);


                return (

                  <div
                    className="admin-poll-item"
                    key={poll.poll_id}
                  >

                    {/* ICON */}

                    <div className="admin-poll-icon">
                      🗳️
                    </div>


                    {/* CONTENT */}

                    <div className="admin-poll-content">

                      <h3>
                        {poll.question}
                      </h3>


                      {/* STATUS */}

                      <p>

                        <strong>
                          Status:
                        </strong>{" "}

                        {poll.status}

                      </p>


                      {/* DATES */}

                      {(poll.start_date ||
                        poll.end_date) && (

                        <p>

                          <strong>
                            Poll Period:
                          </strong>{" "}

                          {formatDate(
                            poll.start_date
                          )}

                          {" → "}

                          {formatDate(
                            poll.end_date
                          )}

                        </p>

                      )}


                      {/* RESULTS */}

                      <div className="poll-results">

                        {poll.options.map(
                          (option) => {

                            const votes =
                              Number(
                                option.vote_count ||
                                0
                              );


                            const percentage =
                              totalVotes === 0
                                ? 0
                                : Math.round(
                                    (votes /
                                      totalVotes) *
                                      100
                                  );


                            return (

                              <div
                                className="poll-result"
                                key={
                                  option.option_id
                                }
                              >

                                <div className="poll-result-header">

                                  <span>
                                    {option.option_text}
                                  </span>

                                  <strong>

                                    {votes} votes (
                                    {percentage}
                                    %)

                                  </strong>

                                </div>


                                <div className="poll-progress">

                                  <div
                                    className="poll-progress-fill"
                                    style={{
                                      width:
                                        `${percentage}%`
                                    }}
                                  ></div>

                                </div>

                              </div>

                            );

                          }
                        )}

                      </div>


                      <small>

                        Total votes:{" "}
                        {totalVotes}

                      </small>

                    </div>


                    {/* CLOSE BUTTON */}

                    {poll.status === "Active" && (

                      <button
                        type="button"
                        className="delete-poll-button"
                        onClick={() =>
                          handleClosePoll(
                            poll.poll_id
                          )
                        }
                      >
                        🔒 Close Poll
                      </button>

                    )}

                  </div>

                );

              })

            )}

          </div>

        </section>

      </main>

    </div>

  );

}

export default AdminPolls;