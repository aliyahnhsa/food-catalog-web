import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      setErrorMessage("Please enter your username and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await API.post("/login/", form);
      localStorage.setItem("token", response.data.token);

      try {
        const meResponse = await API.get("/me/");

        if (meResponse.data.is_staff) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/dashboard");
      }
    } catch (error) {
      setErrorMessage("Login failed. Please check your username and password.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !form.username.trim() || !form.password.trim();

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

            <h1 className="form-title">Welcome Back</h1>

            <p className="form-subtitle">
              Log in to manage the food catalog and update menu details.
            </p>
          </div>

          <form className="form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>

            <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button type="submit" disabled={isDisabled}>
              {loading ? "Logging in..." : "Login"}
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
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--primary-dark)",
                  fontWeight: 800,
                }}
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;