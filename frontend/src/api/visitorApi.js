const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL VISITORS
// ==========================================
export const getVisitors = async () => {
    const response = await fetch(`${API_URL}/visitors`);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch visitors"
        );
    }

    return data;
};

// ==========================================
// CREATE VISITOR
// ==========================================
export const createVisitor = async (visitorData) => {
    const response = await fetch(`${API_URL}/visitors`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(visitorData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create visitor"
        );
    }

    return data;
};

// ==========================================
// DELETE VISITOR
// ==========================================
export const deleteVisitor = async (visitorId) => {
    const response = await fetch(
        `${API_URL}/visitors/${visitorId}`,
        {
            method: "DELETE",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete visitor"
        );
    }

    return data;
};