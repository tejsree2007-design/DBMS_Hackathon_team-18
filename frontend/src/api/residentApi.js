const API_URL = "http://localhost:5000/api";

export const getResidents = async () => {
    const response = await fetch(`${API_URL}/residents`);

    if (!response.ok) {
        throw new Error("Failed to fetch residents");
    }

    return response.json();
};


// DELETE RESIDENT
export const deleteResident = async (residentId) => {

    const response = await fetch(
        `${API_URL}/residents/${residentId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete resident");
    }

    return response.json();
};