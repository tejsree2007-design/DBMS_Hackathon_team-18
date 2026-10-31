const API_URL = "http://localhost:5000/api";


// ==========================================
// GET ALL POLLS
// ==========================================

export const getPolls = async () => {

    const response = await fetch(
        `${API_URL}/polls`
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to fetch polls"
        );

    }

    return data;
};


// ==========================================
// CREATE POLL
// ==========================================

export const createPoll = async (
    pollData
) => {

    const response = await fetch(
        `${API_URL}/polls`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(pollData)
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to create poll"
        );

    }

    return data;
};


// ==========================================
// VOTE IN POLL
// ==========================================

export const votePoll = async (
    pollId,
    residentId,
    optionId
) => {

    const response = await fetch(
        `${API_URL}/polls/${pollId}/vote`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                resident_id:
                    residentId,

                option_id:
                    optionId

            })
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to record vote"
        );

    }

    return data;
};


// ==========================================
// CHECK RESIDENT VOTE
// ==========================================

export const checkResidentVote = async (
    pollId,
    residentId
) => {

    const response = await fetch(
        `${API_URL}/polls/${pollId}/vote/${residentId}`
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to check vote"
        );

    }

    return data;
};


// ==========================================
// UPDATE POLL STATUS
// ==========================================

export const updatePollStatus = async (
    pollId,
    status
) => {

    const response = await fetch(
        `${API_URL}/polls/${pollId}/status`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })
        }
    );

    const data =
        await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "Failed to update poll status"
        );

    }

    return data;
};