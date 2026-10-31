const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL NOTICES
// ==========================================
export const getNotices = async () => {

    const response = await fetch(
        `${API_URL}/notices`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch notices"
        );
    }

    return data;
};


// ==========================================
// CREATE NOTICE
// ==========================================
export const createNotice = async (
    noticeData
) => {

    const response = await fetch(
        `${API_URL}/notices`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(noticeData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create notice"
        );
    }

    return data;
};