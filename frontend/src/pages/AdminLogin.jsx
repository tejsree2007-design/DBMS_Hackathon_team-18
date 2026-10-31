import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/authApi";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await loginAdmin({
        email,
        password,
      });

      // Store admin login information
      localStorage.setItem("adminToken", response.token);

      localStorage.setItem(
        "admin",
        JSON.stringify(response.admin)
      );

      alert("Admin login successful!");

      // Go to Admin Dashboard
      navigate("/admin-dashboard");

    } catch (error) {
      console.error("Admin login error:", error);

      alert(
        error.message ||
        "Invalid admin email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* =========================================
            LEFT SIDE
        ========================================== */}

        <div className="auth-left">

          <div className="auth-logo">
            🏢
          </div>

          <h1>
            Society Management Portal
          </h1>

          <p>
            Welcome to the Admin Portal.
            Manage your society efficiently from one place.
          </p>

        </div>


        {/* =========================================
            RIGHT SIDE
        ========================================== */}

        <div className="auth-right">

          <div className="auth-box">

            <div className="auth-icon">
              👨‍💼
            </div>

            <h2>
              Admin Login
            </h2>

            <p className="auth-subtitle">
              Sign in to access the admin dashboard
            </p>


            {/* =====================================
                LOGIN FORM
            ====================================== */}

            <form onSubmit={handleSubmit}>

              {/* Email */}

              <div className="input-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your admin email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>


              {/* Password */}

              <div className="input-group">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your admin password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>


              {/* Sign In Button */}

              <button
                type="submit"
                className="auth-button"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </form>


            {/* =====================================
                ADMIN ACCOUNT MESSAGE
            ====================================== */}

            <p className="switch-text">
              Admin accounts are created and managed
              by the society management.
            </p>


            {/* =====================================
                BACK BUTTON
            ====================================== */}

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/")
              }
            >
              ← Back to Role Selection
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;