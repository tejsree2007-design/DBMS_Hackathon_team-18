const API_URL = "http://localhost:5000/api";

// ==========================================
// GET ALL AMENITIES
// ==========================================
export const getAmenities = async () => {

    const response = await fetch(
        `${API_URL}/amenities`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch amenities"
        );
    }

    return data;
};


// ==========================================
// CREATE AMENITY
// ==========================================
export const createAmenity = async (
    amenityData
) => {

    const response = await fetch(
        `${API_URL}/amenities`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(amenityData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to create amenity"
        );
    }

    return data;
};


// ==========================================
// GET ALL AMENITY BOOKINGS
// ==========================================
export const getAmenityBookings = async () => {

    const response = await fetch(
        `${API_URL}/amenities/bookings`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to fetch amenity bookings"
        );
    }

    return data;
};


// ==========================================
// CREATE AMENITY BOOKING
// ==========================================
export const createAmenityBooking = async (
    bookingData
) => {

    const response = await fetch(
        `${API_URL}/amenities/bookings`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(bookingData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to create amenity booking"
        );
    }

    return data;
};


// ==========================================
// CANCEL AMENITY BOOKING
// ==========================================
export const deleteAmenityBooking = async (
    bookingId
) => {

    const response = await fetch(
        `${API_URL}/amenities/bookings/${bookingId}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to cancel amenity booking"
        );
    }

    return data;
};
// ==========================================
// DELETE AMENITY
// ==========================================
export const deleteAmenity = async (amenityId) => {

    const response = await fetch(
        `${API_URL}/amenities/${amenityId}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to delete amenity"
        );
    }

    return data;
};