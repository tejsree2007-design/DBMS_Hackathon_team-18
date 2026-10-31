const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER A NEW RESIDENT
// ==========================================
const registerResident = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            flatNumber,
            phone
        } = req.body;

        // Check required fields
        if (!name || !email || !password || !flatNumber) {
            return res.status(400).json({
                message: "Name, email, password and flat number are required"
            });
        }

        // Check database
        db.query(
            "SELECT DATABASE() AS database_name",
            (err, dbResult) => {
                if (err) {
                    console.error("Database check error:", err);

                    return res.status(500).json({
                        message: "Database connection error"
                    });
                }

                console.log("Node is using database:", dbResult);

                // Check roles
                db.query(
                    "SELECT role_id, role_name FROM roles",
                    (err, roleResults) => {
                        if (err) {
                            console.error("Role table error:", err);

                            return res.status(500).json({
                                message: "Could not read roles table"
                            });
                        }

                        console.log(
                            "Roles visible to Node:",
                            roleResults
                        );

                        const residentRole = roleResults.find(
                            role =>
                                role.role_name &&
                                role.role_name.trim().toLowerCase() ===
                                "resident"
                        );

                        if (!residentRole) {
                            return res.status(500).json({
                                message: "Resident role not found"
                            });
                        }

                        const roleId = residentRole.role_id;

                        console.log(
                            "Resident role ID:",
                            roleId
                        );

                        // Check email
                        const checkEmailSql = `
                            SELECT user_id
                            FROM users
                            WHERE email = ?
                        `;

                        db.query(
                            checkEmailSql,
                            [email],
                            async (err, results) => {
                                if (err) {
                                    console.error(
                                        "Error checking email:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message: "Database error"
                                    });
                                }

                                if (results.length > 0) {
                                    return res.status(409).json({
                                        message: "Email already registered"
                                    });
                                }

                                // Check flat number
                                const checkFlatSql = `
                                    SELECT resident_id
                                    FROM residents
                                    WHERE flat_number = ?
                                `;

                                db.query(
                                    checkFlatSql,
                                    [flatNumber],
                                    async (err, results) => {
                                        if (err) {
                                            console.error(
                                                "Error checking flat number:",
                                                err
                                            );

                                            return res.status(500).json({
                                                message: "Database error"
                                            });
                                        }

                                        if (results.length > 0) {
                                            return res.status(409).json({
                                                message:
                                                    "Flat number already registered"
                                            });
                                        }

                                        // Hash password
                                        const passwordHash =
                                            await bcrypt.hash(
                                                password,
                                                10
                                            );

                                        // Insert user
                                        const userSql = `
                                            INSERT INTO users
                                            (
                                                role_id,
                                                name,
                                                email,
                                                password_hash
                                            )
                                            VALUES (?, ?, ?, ?)
                                        `;

                                        db.query(
                                            userSql,
                                            [
                                                roleId,
                                                name,
                                                email,
                                                passwordHash
                                            ],
                                            (err, userResult) => {
                                                if (err) {
                                                    console.error(
                                                        "Error creating user:",
                                                        err
                                                    );

                                                    return res.status(500).json({
                                                        message:
                                                            "Failed to create user"
                                                    });
                                                }

                                                const userId =
                                                    userResult.insertId;

                                                console.log(
                                                    "User created with ID:",
                                                    userId
                                                );

                                                // Insert resident
                                                const residentSql = `
                                                    INSERT INTO residents
                                                    (
                                                        user_id,
                                                        flat_number,
                                                        phone
                                                    )
                                                    VALUES (?, ?, ?)
                                                `;

                                                db.query(
                                                    residentSql,
                                                    [
                                                        userId,
                                                        flatNumber,
                                                        phone || null
                                                    ],
                                                    (err) => {
                                                        if (err) {
                                                            console.error(
                                                                "Error creating resident:",
                                                                err
                                                            );

                                                            return res.status(500).json({
                                                                message:
                                                                    "Failed to create resident"
                                                            });
                                                        }

                                                        console.log(
                                                            "Resident created successfully!"
                                                        );

                                                        return res.status(201).json({
                                                            message:
                                                                "Resident registered successfully"
                                                        });
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// LOGIN RESIDENT
// ==========================================
const loginResident = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find resident
        const sql = `
            SELECT
                u.user_id,
                u.name,
                u.email,
                u.password_hash,
                r.role_name,
                res.resident_id,
                res.flat_number,
                res.phone
            FROM users u
            JOIN roles r
                ON u.role_id = r.role_id
            JOIN residents res
                ON u.user_id = res.user_id
            WHERE u.email = ?
        `;

        db.query(
            sql,
            [email],
            async (err, results) => {
                if (err) {
                    console.error(
                        "Login database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                // Resident not found
                if (results.length === 0) {
                    return res.status(404).json({
                        message:
                            "Resident account not found. Please sign up first."
                    });
                }

                const user = results[0];

                // Check password
                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password_hash
                    );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message:
                            "Invalid email or password"
                    });
                }

                // Create JWT
                const token = jwt.sign(
                    {
                        userId: user.user_id,
                        residentId: user.resident_id,
                        role: user.role_name
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                // Send response
                return res.status(200).json({
                    message: "Resident login successful",

                    token,

                    resident: {
                        userId: user.user_id,
                        residentId: user.resident_id,
                        name: user.name,
                        email: user.email,
                        flatNumber: user.flat_number,
                        phone: user.phone,
                        role: user.role_name
                    }
                });
            }
        );
    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// LOGIN ADMIN
// ==========================================
const loginAdmin = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find admin
        const sql = `
            SELECT
                u.user_id,
                u.name,
                u.email,
                u.password_hash,
                r.role_name
            FROM users u
            JOIN roles r
                ON u.role_id = r.role_id
            WHERE u.email = ?
              AND r.role_name = 'Admin'
        `;

        db.query(
            sql,
            [email],
            async (err, results) => {
                if (err) {
                    console.error(
                        "Admin login database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                // Admin not found
                if (results.length === 0) {
                    return res.status(401).json({
                        message:
                            "Invalid admin email or password"
                    });
                }

                const admin = results[0];

                // Check password
                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        admin.password_hash
                    );

                if (!passwordMatch) {
                    return res.status(401).json({
                        message:
                            "Invalid admin email or password"
                    });
                }

                // Create JWT
                const token = jwt.sign(
                    {
                        userId: admin.user_id,
                        role: admin.role_name
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1d"
                    }
                );

                // Send response
                return res.status(200).json({
                    message: "Admin login successful",

                    token,

                    admin: {
                        userId: admin.user_id,
                        name: admin.name,
                        email: admin.email,
                        role: admin.role_name
                    }
                });
            }
        );
    } catch (error) {
        console.error(
            "Admin login error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================================
// EXPORT FUNCTIONS
// ==========================================
module.exports = {
    registerResident,
    loginResident,
    loginAdmin
};