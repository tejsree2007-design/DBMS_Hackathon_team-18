import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  registerResident,
  loginResident
} from "../api/authApi";

function ResidentLogin() {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ================================
    // SIGNUP
    // ================================
    if (isSignup) {
      try {
        const residentData = {
          name: name,
          email: email,
          password: password,
          flatNumber: flatNumber
        };

        await registerResident(residentData);

        alert("Resident account created successfully!");

        // Switch to Login
        setIsSignup(false);

        // Clear form
        setName("");
        setFlatNumber("");
        setEmail("");
        setPassword("");

      } catch (error) {
        alert(error.message);
      }

      return;
    }

    // ================================
    // LOGIN
    // ================================
    try {
      const loginData = {
        email: email,
        password: password
      };

      const data = await loginResident(loginData);

      // Store JWT token
      localStorage.setItem(
        "token",
        data.token
      );

      // Store logged-in resident information
      localStorage.setItem(
        "currentResident",
        JSON.stringify(data.resident)
      );

      alert("Login successful!");

      // Go to Resident Dashboard
      navigate("/resident-dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Left Side */}
        <div className="auth-left">

          <div className="auth-logo">
            🏢
          </div>

          <h1>Society Management Portal</h1>

          <p>
            Welcome to the Resident Portal.
            Manage your society activities from one place.
          </p>

        </div>


        {/* Right Side */}
        <div className="auth-right">

          <div className="auth-box">

            <div className="auth-icon">
              👤
            </div>

            <h2>
              {isSignup
                ? "Create Resident Account"
                : "Resident Login"}
            </h2>

            <p className="auth-subtitle">
              {isSignup
                ? "Create your resident account"
                : "Sign in to access your resident dashboard"}
            </p>


            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              {isSignup && (
                <div className="input-group">

                  <label>Full Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />

                </div>
              )}


              {/* Flat Number */}
              {isSignup && (
                <div className="input-group">

                  <label>Flat Number</label>

                  <input
                    type="text"
                    placeholder="Enter your flat number"
                    value={flatNumber}
                    onChange={(e) =>
                      setFlatNumber(e.target.value)
                    }
                    required
                  />

                </div>
              )}


              {/* Email */}
              <div className="input-group">

                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>


              {/* Password */}
              <div className="input-group">

                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>


              {/* Submit Button */}
              <button
                type="submit"
                className="auth-button"
              >
                {isSignup
                  ? "Create Account"
                  : "Sign In"}
              </button>

            </form>


            {/* Login / Signup Switch */}
            <p className="switch-text">

              {isSignup
                ? "Already have a resident account?"
                : "Don't have a resident account?"}

              <button
                type="button"
                className="switch-button"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup
                  ? " Sign In"
                  : " Sign Up"}
              </button>

            </p>


            {/* Back Button */}
            <button
              className="back-button"
              onClick={() => navigate("/")}
            >
              ← Back to Role Selection
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResidentLogin;