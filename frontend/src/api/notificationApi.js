const API_URL = "http://localhost:5000/api/notifications";


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {

    const response = await fetch(API_URL);

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.message ||
            "Failed to fetch notifications"
        );

    }

    return response.json();

};


// ==========================================
// CREATE NOTIFICATION
// ==========================================

export const createNotification = async (
    notificationData
) => {

    const response = await fetch(
        API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(
                notificationData
            )
        }
    );


    if (!response.ok) {

        const errorData =
            await response.json();

        throw new Error(
            errorData.message ||
            "Failed to create notification"
        );

    }


    return response.json();

};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

export const markNotificationAsRead =
    async (notificationId) => {

        const response = await fetch(
            `${API_URL}/${notificationId}/read`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.message ||
                "Failed to mark notification as read"
            );

        }


        return response.json();

    };