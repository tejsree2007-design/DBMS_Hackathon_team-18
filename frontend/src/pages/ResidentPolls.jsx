import { useEffect, useState } from "react";
import ResidentSidebar from "../components/ResidentSidebar";
import {
  getPolls,
  votePoll,
  checkResidentVote
} from "../api/pollApi";

function ResidentPolls() {

  // ==========================================
  // CURRENT RESIDENT
  // ==========================================

  const currentResident = JSON.parse(
    localStorage.getItem("currentResident")
  );


  // ==========================================
  // STATE
  // ==========================================

  const [polls, setPolls] =
    useState([]);

  const [votes, setVotes] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD POLLS
  // ==========================================

  useEffect(() => {

    const loadPolls = async () => {

      if (!currentResident) {

        setError(
          "Please login again."
        );

        setLoading(false);

        return;
      }


      try {

        setLoading(true);

        setError("");


        // Get polls from backend
        const data =
          await getPolls();


        // Only show active polls
        const activePolls =
          data.filter(
            (poll) =>
              poll.status === "Active"
          );


        setPolls(activePolls);


        // ==========================================
        // CHECK VOTES FOR EACH POLL
        // ==========================================

        const residentId =
          currentResident.residentId;


        const voteResults = {};


        for (
          const poll of activePolls
        ) {

          try {

            const voteData =
              await checkResidentVote(
                poll.poll_id,
                residentId
              );


            if (
              voteData.hasVoted
            ) {

              voteResults[
                poll.poll_id
              ] = voteData.vote;

            }

          } catch (error) {

            console.error(
              `Error checking vote for poll ${poll.poll_id}:`,
              error
            );

          }

        }


        setVotes(
          voteResults
        );


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


    loadPolls();

  }, []);


  // ==========================================
  // HANDLE VOTE
  // ==========================================

  const handleVote = async (
    poll,
    option
  ) => {

    if (!currentResident) {

      alert(
        "Please login again."
      );

      return;

    }


    // Check if already voted
    if (
      votes[poll.poll_id]
    ) {

      alert(
        "You have already voted in this poll."
      );

      return;

    }


    try {

      await votePoll(

        poll.poll_id,

        currentResident.residentId,

        option.option_id

      );


      // Store vote in React state
      setVotes((previousVotes) => ({

        ...previousVotes,

        [poll.poll_id]: {

          option_id:
            option.option_id,

          option_text:
            option.option_text

        }

      }));


      alert(
        `Your vote for "${option.option_text}" has been recorded!`
      );


      // Reload polls so Admin/Resident results
      // are reflected from the database
      const updatedPolls =
        await getPolls();


      const activePolls =
        updatedPolls.filter(
          (item) =>
            item.status === "Active"
        );


      setPolls(
        activePolls
      );


    } catch (error) {

      console.error(
        "Error voting:",
        error
      );


      alert(
        error.message ||
        "Failed to record your vote."
      );

    }

  };


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="dashboard-page">

      <ResidentSidebar
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
              Participate in society polls and share your opinion.
            </p>

          </div>

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
            ACTIVE POLLS
        ========================================== */}

        <section className="dashboard-card">

          <div className="card-header">

            <h2>
              Active Polls
            </h2>

          </div>


          <div className="polls-list">


            {loading ? (

              <p className="resident-polls-empty">
                Loading polls...
              </p>


            ) : polls.length === 0 ? (

              <p className="resident-polls-empty">
                No active polls available.
              </p>


            ) : (

              polls.map((poll) => {

                const residentVote =
                  votes[
                    poll.poll_id
                  ];


                const hasVoted =
                  Boolean(
                    residentVote
                  );


                return (

                  <div
                    className="resident-poll-card"
                    key={
                      poll.poll_id
                    }
                  >

                    <div className="poll-icon">
                      🗳️
                    </div>


                    <div className="poll-content">

                      <h2>
                        {poll.question}
                      </h2>


                      {hasVoted ? (

                        <div className="poll-voted-message">

                          ✅ You have already voted.

                          <br />

                          Your choice:{" "}

                          <strong>
                            {
                              residentVote.option_text
                            }
                          </strong>

                        </div>

                      ) : (

                        <div className="poll-options">

                          {poll.options.map(
                            (option) => (

                              <button
                                type="button"
                                className="poll-option-button"
                                key={
                                  option.option_id
                                }
                                onClick={() =>
                                  handleVote(
                                    poll,
                                    option
                                  )
                                }
                              >

                                {
                                  option.option_text
                                }

                              </button>

                            )
                          )}

                        </div>

                      )}

                    </div>

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

export default ResidentPolls;