const API_URL = "http://localhost:5000/api";

// ==========================================
// REGISTER RESIDENT
// ==========================================
export const registerResident = async (residentData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(residentData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Registration failed"
        );
    }

    return data;
};


// ==========================================
// LOGIN RESIDENT
// ==========================================
export const loginResident = async (loginData) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Login failed"
        );
    }

    return data;
};
// ==========================================
// LOGIN ADMIN
// ==========================================
export const loginAdmin = async (loginData) => {
    const response = await fetch(`${API_URL}/auth/admin-login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Admin login failed"
        );
    }

    return data;
};