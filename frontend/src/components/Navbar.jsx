import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to log out?");
    if (!ok) return;

    localStorage.removeItem("token");
    setIsAdmin(false);
    navigate("/");
  };

  useEffect(() => {
    let canceled = false;

    const fetchMe = async () => {
      if (!token) {
        setChecked(true);
        return;
      }

      try {
        const res = await API.get("/me/");
        if (!canceled) setIsAdmin(res.data.is_staff === true);
      } catch (err) {
        localStorage.removeItem("token");
        if (!canceled) setIsAdmin(false);
      } finally {
        if (!canceled) setChecked(true);
      }
    };

    fetchMe();

    return () => {
      canceled = true;
    };
  }, [token]);

  if (!checked) return null;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-mark">FC</div>

          <div className="brand-text">
            <span className="brand-name">Food Catalog</span>
            <span className="brand-caption">Fresh menus, neatly curated.</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link className="nav-link" to="/">
            Home
          </Link>

          <Link className="nav-link" to="/menus">
            Menus
          </Link>

          {!token ? (
            <>
              <Link className="nav-link" to="/login">
                Login
              </Link>

              <Link className="nav-link" to="/register">
                Register
              </Link>
            </>
          ) : (
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          )}

          {isAdmin && (
            <Link className="nav-link" to="/dashboard">
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}