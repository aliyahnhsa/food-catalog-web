import { Link } from "react-router-dom";

export default function MenuCard({ menu }) {
  const imageUrl =
    menu.image &&
    (menu.image.startsWith("http")
      ? menu.image
      : `http://127.0.0.1:8000${menu.image}`);

  return (
    <Link to={`/menus/${menu.id}`} className="card menu-card">
      <div className="menu-image-wrap">
        {imageUrl ? (
          <img src={imageUrl} alt={menu.name} />
        ) : (
          <div className="menu-image-placeholder">🍃</div>
        )}
      </div>

      <div className="menu-content">
        <div className="menu-meta">
          <span className="badge">{menu.category?.replace("_", " ")}</span>
          <span className="price">Rp{Number(menu.price).toLocaleString("id-ID")}</span>
        </div>

        <h2>{menu.name}</h2>
        <p>{menu.description}</p>
      </div>
    </Link>
  );
}