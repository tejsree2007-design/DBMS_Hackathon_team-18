const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL COMPLAINTS
// ==========================================
export const getComplaints = async () => {

    const response = await fetch(
        `${API_URL}/complaints`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch complaints"
        );
    }

    return data;
};


// ==========================================
// CREATE COMPLAINT
// ==========================================
export const createComplaint = async (
    complaintData
) => {

    const response = await fetch(
        `${API_URL}/complaints`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                complaintData
            )
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to create complaint"
        );
    }

    return data;
};


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================
export const updateComplaintStatus = async (
    complaintId,
    status
) => {

    const response = await fetch(
        `${API_URL}/complaints/${complaintId}/status`,
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

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to update complaint status"
        );
    }

    return data;
};


// ==========================================
// DELETE COMPLAINT
// ==========================================
export const deleteComplaint = async (
    complaintId
) => {

    const response = await fetch(
        `${API_URL}/complaints/${complaintId}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to delete complaint"
        );
    }

    return data;
};