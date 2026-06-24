import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!form.password_confirm) {
      newErrors.password_confirm = "Please confirm your password.";
    } else if (form.password !== form.password_confirm) {
      newErrors.password_confirm = "Passwords do not match.";
    }

    return newErrors;
  };

  const getErrorMessage = (field) => {
    const error = errors[field];

    if (!error) return null;

    if (Array.isArray(error)) {
      return error.join(" ");
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const response = await API.post("/register/", form);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/");
    } catch (error) {
      const data = error.response?.data;

      if (data) {
        setErrors(data);
      } else {
        setErrors({
          non_field_errors: "Registration failed. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading ||
    !form.username.trim() ||
    !form.password.trim() ||
    !form.password_confirm.trim();

  return (
    <main>
      <section
        style={{
          minHeight: "calc(100vh - 180px)",
          display: "grid",
          placeItems: "center",
          padding: "24px 0",
        }}
      >
        <div className="card auth-card">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 20,
                margin: "0 auto 16px",
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(135deg, var(--primary-dark), var(--primary))",
                color: "white",
                fontSize: 24,
                fontWeight: 800,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              FC
            </div>

            <h1 className="form-title">Create Account</h1>

            <p className="form-subtitle">
              Sign up to access the catalog and continue browsing menus.
            </p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            {getErrorMessage("username") && (
              <p className="error-text">{getErrorMessage("username")}</p>
            )}

            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {getErrorMessage("email") && (
              <p className="error-text">{getErrorMessage("email")}</p>
            )}

            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: 92 }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "auto",
                  margin: 0,
                  padding: "8px 12px",
                  background: "var(--primary-soft)",
                  color: "var(--primary-dark)",
                  boxShadow: "none",
                  fontSize: 12,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {getErrorMessage("password") && (
              <p className="error-text">{getErrorMessage("password")}</p>
            )}

            <label htmlFor="password_confirm">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="password_confirm"
                type={showConfirmPassword ? "text" : "password"}
                name="password_confirm"
                placeholder="Re-enter your password"
                value={form.password_confirm}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: 92 }}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "auto",
                  margin: 0,
                  padding: "8px 12px",
                  background: "var(--primary-soft)",
                  color: "var(--primary-dark)",
                  boxShadow: "none",
                  fontSize: 12,
                }}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {getErrorMessage("password_confirm") && (
              <p className="error-text">
                {getErrorMessage("password_confirm")}
              </p>
            )}

            {getErrorMessage("non_field_errors") && (
              <p className="error-text">
                {getErrorMessage("non_field_errors")}
              </p>
            )}

            <button type="submit" disabled={isDisabled}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div
            style={{
              marginTop: 22,
              paddingTop: 20,
              borderTop: "1px solid var(--line)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--muted)",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "var(--primary-dark)",
                  fontWeight: 800,
                }}
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;