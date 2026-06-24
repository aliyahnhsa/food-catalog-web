import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import MenuCard from "../components/MenuCard";

function Home() {
  const [featuredMenus, setFeaturedMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    {
      label: "Main Course",
      value: "main_course",
    },
    {
      label: "Snack",
      value: "snack",
    },
    {
      label: "Dessert",
      value: "dessert",
    },
    {
      label: "Drink",
      value: "drink",
    },
  ];

  const shuffleMenus = (menus) => {
    return [...menus].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchFeaturedMenus = async () => {
      try {
        const response = await API.get("/menus/");
        const randomizedMenus = shuffleMenus(response.data).slice(0, 3);
        setFeaturedMenus(randomizedMenus);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMenus();
  }, []);

  const mainMenu = featuredMenus[0];

  const mainImageUrl =
    mainMenu?.image &&
    (mainMenu.image.startsWith("http")
      ? mainMenu.image
      : `http://127.0.0.1:8000${mainMenu.image}`);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">Food Catalog</div>

            <h1>Discover fresh menus in one clean catalog.</h1>

            <p>
              Browse food selections with clear details, beautiful visuals,
              menu categories, and simple search features.
            </p>

            <div className="hero-actions">
              <Link to="/menus" className="btn btn-large">
                Explore Menus
              </Link>

              <a href="#featured" className="btn btn-secondary btn-large">
                View Highlights
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>{categories.length}+</strong>
                <span>Categories</span>
              </div>

              <div>
                <strong>{featuredMenus.length > 0 ? "Fresh" : "New"}</strong>
                <span>Menu details</span>
              </div>

              <div>
                <strong>Easy</strong>
                <span>Search & filter</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase" aria-hidden="true">
            <div className="showcase-card showcase-main">
              <div className="showcase-image">
                {mainImageUrl ? (
                  <img src={mainImageUrl} alt={mainMenu.name} />
                ) : (
                  <span>No image yet</span>
                )}
              </div>

              <div>
                <span>
                  {mainMenu?.category
                    ? mainMenu.category.replace("_", " ")
                    : "Featured Menu"}
                </span>

                <h3>{mainMenu?.name || "Add your first menu"}</h3>

                <p>
                  {mainMenu
                    ? `Rp${Number(mainMenu.price).toLocaleString(
                        "id-ID"
                      )} · ${mainMenu.prep_time_minutes} min`
                    : "Your menu preview will appear here."}
                </p>
              </div>
            </div>

            {featuredMenus[1] && (
              <div className="floating-card floating-top">
                <span>01</span>
                <div>
                  <strong>{featuredMenus[1].name}</strong>
                  <small>{featuredMenus[1].category.replace("_", " ")}</small>
                </div>
              </div>
            )}

            {featuredMenus[2] && (
              <div className="floating-card floating-bottom">
                <span>02</span>
                <div>
                  <strong>{featuredMenus[2].name}</strong>
                  <small>{featuredMenus[2].category.replace("_", " ")}</small>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="featured" className="home-section">
        <div className="home-container">
          <div className="section-top">
            <div>
              <span className="section-label">Highlights</span>
              <h2>Random picks from the catalog</h2>
            </div>

            <Link to="/menus" className="text-link">
              See all menus →
            </Link>
          </div>

          {loading ? (
            <div className="empty-state">Loading menu highlights...</div>
          ) : featuredMenus.length > 0 ? (
            <div className="cards">
              {featuredMenus.map((menu) => (
                <MenuCard key={menu.id} menu={menu} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No menu items yet. Add menus from the admin dashboard first.
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-section-soft">
        <div className="home-container category-layout">
          <div>
            <span className="section-label">Categories</span>
            <h2>Browse by what you need.</h2>
            <p>
              Menu items are organized into simple categories so visitors can
              quickly find meals, snacks, desserts, or drinks.
            </p>
          </div>

          <div className="category-list">
            {categories.map((category) => (
              <Link
                to={`/menus?category=${category.value}`}
                className="category-pill"
                key={category.value}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container info-grid-home">
          <div className="info-card-home">
            <span>01</span>
            <h3>Clear menu details</h3>
            <p>
              Each menu can include description, category, price, prep time,
              difficulty, and availability.
            </p>
          </div>

          <div className="info-card-home">
            <span>02</span>
            <h3>Photo and video support</h3>
            <p>
              The catalog supports image and video uploads so each menu feels
              more informative and visually complete.
            </p>
          </div>

          <div className="info-card-home">
            <span>03</span>
            <h3>Simple admin management</h3>
            <p>
              Admins can add new menus through a structured form with helpful
              labels and clearer input guidance.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;