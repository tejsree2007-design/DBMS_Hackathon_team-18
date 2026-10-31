const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const residentRoutes = require("./routes/residentRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const amenityRoutes = require("./routes/amenityRoutes");
const pollRoutes = require("./routes/pollRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send(
        "Society Management Portal Backend is running!"
    );
});


// ==========================================
// API TEST ROUTE
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({
        message: "API is working",
        project: "Society Management Portal"
    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/residents",
    residentRoutes
);

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);
app.use(
    "/api/visitors",
    visitorRoutes
);
app.use(
    "/api/complaints",
    complaintRoutes
);
app.use(
    "/api/notices",
    noticeRoutes
);
app.use(
    "/api/amenities",
    amenityRoutes
);
app.use(
    "/api/polls",
    pollRoutes
);
app.use(
    "/api/notifications",
    notificationRoutes
);

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});