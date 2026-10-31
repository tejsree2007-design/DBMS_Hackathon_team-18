const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL PAYMENTS
// ==========================================
export const getPayments = async () => {

    const response = await fetch(
        `${API_URL}/payments`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch payments"
        );
    }

    return data;
};


// ==========================================
// GET PAYMENTS FOR ONE RESIDENT
// ==========================================
export const getResidentPayments = async (
    residentId
) => {

    const response = await fetch(
        `${API_URL}/payments/resident/${residentId}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch resident payments"
        );
    }

    return data;
};


// ==========================================
// MARK PAYMENT AS PAID
// ==========================================
export const markPaymentAsPaid = async (
    paymentId
) => {

    const response = await fetch(
        `${API_URL}/payments/${paymentId}/pay`,
        {
            method: "PUT"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to complete payment"
        );
    }

    return data;
};