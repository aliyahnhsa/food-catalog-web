import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api";
import MenuCard from "../components/MenuCard";

function MenuList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";

  const [allMenus, setAllMenus] = useState([]);
  const [menus, setMenus] = useState([]);
  const [search, setSearch] = useState(searchParam);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      label: "All",
      value: "",
    },
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

  const applyFilters = (menuData, selectedCategory, searchKeyword) => {
    let filtered = [...menuData];

    if (selectedCategory) {
      filtered = filtered.filter((menu) => menu.category === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();

      filtered = filtered.filter((menu) => {
        return (
          menu.name?.toLowerCase().includes(keyword) ||
          menu.description?.toLowerCase().includes(keyword) ||
          menu.category?.toLowerCase().includes(keyword)
        );
      });
    }

    setMenus(filtered);
  };

  const fetchMenus = async () => {
    setLoading(true);

    try {
      const response = await API.get("/menus/");
      setAllMenus(response.data);
      applyFilters(response.data, categoryParam, searchParam);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = {};

    if (categoryParam) {
      params.category = categoryParam;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params);
  };

  const handleCategoryChange = (categoryValue) => {
    const params = {};

    if (categoryValue) {
      params.category = categoryValue;
    }

    if (search.trim()) {
      params.search = search.trim();
    }

    setSearchParams(params);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  useEffect(() => {
    applyFilters(allMenus, categoryParam, searchParam);
    setSearch(searchParam);
  }, [categoryParam, searchParam, allMenus]);

  return (
    <main>
      <section className="page-heading">
        <h1>Explore Menus</h1>
        <p>
          Search and filter menus by category, name, or description.
        </p>
      </section>

      <div className="category-filter-row">
        {categories.map((category) => (
          <button
            key={category.value || "all"}
            type="button"
            className={
              categoryParam === category.value
                ? "category-filter active"
                : "category-filter"
            }
            onClick={() => handleCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          type="text"
          placeholder="Search menus..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />

        <button onClick={handleSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {(categoryParam || searchParam) && (
        <div className="active-filter-info">
          <span>
            Showing{" "}
            {categoryParam
              ? categoryParam.replace("_", " ")
              : "all categories"}
            {searchParam ? ` matching "${searchParam}"` : ""}
          </span>

          <Link to="/menus">Clear filters</Link>
        </div>
      )}

      <div style={{ height: 28 }} />

      <div className="cards">
        {loading ? (
          <div className="empty-state">Loading menus...</div>
        ) : menus.length > 0 ? (
          menus.map((menu) => <MenuCard key={menu.id} menu={menu} />)
        ) : (
          <div className="empty-state">
            No menus found for this filter.
          </div>
        )}
      </div>
    </main>
  );
}

export default MenuList;