import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

function MenuDetail() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await API.get(`/menus/${id}/`);
        setMenu(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMenu();
  }, [id]);

  if (!menu) {
    return (
      <main>
        <div className="empty-state">Loading menu...</div>
      </main>
    );
  }

  const imageUrl =
    menu.image &&
    (menu.image.startsWith("http")
      ? menu.image
      : `http://127.0.0.1:8000${menu.image}`);

  const videoUrl =
    menu.video &&
    (menu.video.startsWith("http")
      ? menu.video
      : `http://127.0.0.1:8000${menu.video}`);

  return (
    <main>
      <Link to="/menus" className="btn btn-secondary">
        ← Back to Menus
      </Link>

      <div style={{ height: 22 }} />

      <section className="detail-layout">
        <div className="detail-media">
          {imageUrl ? (
            <img src={imageUrl} alt={menu.name} />
          ) : (
            <div className="menu-image-placeholder" style={{ minHeight: 420 }}>
              🍃
            </div>
          )}
        </div>

        <div className="card detail-panel">
          <div className="menu-meta">
            <span className="badge">{menu.category?.replace("_", " ")}</span>
            <span className="price">
              Rp{Number(menu.price).toLocaleString("id-ID")}
            </span>
          </div>

          <h1>{menu.name}</h1>

          <p className="detail-description">{menu.description}</p>

          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Prep time</span>
              <span className="info-value">{menu.prep_time_minutes} min</span>
            </div>

            <div className="info-item">
              <span className="info-label">Difficulty</span>
              <span className="info-value">{menu.difficulty}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Halal</span>
              <span className="info-value">{menu.is_halal ? "Yes" : "No"}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Spicy</span>
              <span className="info-value">{menu.is_spicy ? "Yes" : "No"}</span>
            </div>

            {menu.available_date && (
              <div className="info-item">
                <span className="info-label">Available date</span>
                <span className="info-value">
                  {new Date(menu.available_date).toLocaleDateString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {videoUrl && (
        <section className="card video-section">
          <h2>Menu Video</h2>

          <video controls>
            <source src={videoUrl} />
          </video>
        </section>
      )}
    </main>
  );
}

export default MenuDetail;