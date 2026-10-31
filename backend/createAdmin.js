const db = require("./config/db");
const bcrypt = require("bcryptjs");

const createAdmin = async () => {

    const name = "Admin";
    const email = "admin@society.com";
    const password = "admin123";

    try {

        // Find Admin role
        db.query(
            "SELECT role_id FROM roles WHERE role_name = 'Admin'",
            async (err, results) => {

                if (err) {
                    console.error("Error finding Admin role:", err);
                    process.exit(1);
                }

                if (results.length === 0) {
                    console.error("Admin role not found.");
                    process.exit(1);
                }

                const roleId = results[0].role_id;

                // Check if admin already exists
                db.query(
                    "SELECT user_id FROM users WHERE email = ?",
                    [email],
                    async (err, users) => {

                        if (err) {
                            console.error(
                                "Error checking admin:",
                                err
                            );
                            process.exit(1);
                        }

                        if (users.length > 0) {

                            console.log(
                                "Admin account already exists."
                            );

                            process.exit(0);
                        }

                        // Hash password
                        const passwordHash =
                            await bcrypt.hash(
                                password,
                                10
                            );

                        // Create admin
                        const sql = `
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
                            sql,
                            [
                                roleId,
                                name,
                                email,
                                passwordHash
                            ],
                            (err, result) => {

                                if (err) {

                                    console.error(
                                        "Error creating admin:",
                                        err
                                    );

                                    process.exit(1);
                                }

                                console.log(
                                    "Admin account created successfully!"
                                );

                                console.log(
                                    "Email:",
                                    email
                                );

                                console.log(
                                    "Password:",
                                    password
                                );

                                console.log(
                                    "User ID:",
                                    result.insertId
                                );

                                process.exit(0);
                            }
                        );
                    }
                );
            }
        );

    } catch (error) {

        console.error(
            "Error:",
            error
        );

        process.exit(1);
    }
};

createAdmin();