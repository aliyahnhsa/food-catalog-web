import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { BACKEND_URL } from "../api";

const initialForm = {
  name: "",
  description: "",
  category: "main_course",
  price: "",
  prep_time_minutes: "",
  difficulty: "easy",
  is_halal: true,
  is_spicy: false,
  available_date: "",
  image: null,
  video: null,
};

function Dashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [menus, setMenus] = useState([]);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await API.get("/me/");

        if (!res.data.is_staff) {
          navigate("/");
          return;
        }

        setCheckingAccess(false);
        await loadMenus();
      } catch (err) {
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  const loadMenus = async () => {
    setLoadingMenus(true);
    try {
      const res = await API.get("/menus/");
      setMenus(res.data);
    } catch (error) {
      console.log("Failed to load menus", error);
    } finally {
      setLoadingMenus(false);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreview, videoPreview]);

  const clearFieldError = (fieldName) => {
    if (!errors[fieldName]) return;

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setSuccessMessage("");
    clearFieldError(name);

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (type === "file") {
      const file = files?.[0] || null;

      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (name === "image") {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(file ? URL.createObjectURL(file) : null);
      }

      if (name === "video") {
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(file ? URL.createObjectURL(file) : null);
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter the menu name.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Please add a short description for this menu.";
    } else if (form.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters.";
    }

    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = "Please enter a valid price.";
    }

    if (!form.prep_time_minutes || Number(form.prep_time_minutes) <= 0) {
      newErrors.prep_time_minutes = "Please enter the preparation time in minutes.";
    }

    if (form.image && !form.image.type.startsWith("image/")) {
      newErrors.image = "Please upload a valid image file.";
    }

    if (form.video && !form.video.type.startsWith("video/")) {
      newErrors.video = "Please upload a valid video file.";
    }

    return newErrors;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditingMenuId(null);
    setFileInputKey((prev) => prev + 1);

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setImagePreview(null);
    setVideoPreview(null);
  };

  const handleEdit = (menu) => {
    setEditingMenuId(menu.id);
    setForm({
      name: menu.name || "",
      description: menu.description || "",
      category: menu.category || "main_course",
      price: menu.price || "",
      prep_time_minutes: menu.prep_time_minutes || "",
      difficulty: menu.difficulty || "easy",
      is_halal: menu.is_halal,
      is_spicy: menu.is_spicy,
      available_date: menu.available_date || "",
      image: null,
      video: null,
    });
    setFileInputKey((prev) => prev + 1);

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    setImagePreview(menu.image ? (menu.image.startsWith("http") ? menu.image : `${BACKEND_URL}${menu.image}`) : null);
    setVideoPreview(menu.video ? (menu.video.startsWith("http") ? menu.video : `${BACKEND_URL}${menu.video}`) : null);
    setSuccessMessage("");
    setErrors({});
  };

  const handleDelete = async (menuId) => {
    const confirmed = window.confirm("Delete this menu item? This cannot be undone.");
    if (!confirmed) return;

    try {
      await API.delete(`/menus/${menuId}/`);
      setSuccessMessage("Menu has been deleted successfully.");
      setMenus((prev) => prev.filter((menu) => menu.id !== menuId));
      if (editingMenuId === menuId) {
        resetForm();
      }
    } catch (error) {
      console.log(error);
      setErrors({ form: "Unable to delete menu right now." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSuccessMessage("");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        data.append(key, form[key]);
      }
    });

    try {
      if (editingMenuId) {
        await API.put(`/menus/${editingMenuId}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Menu has been updated successfully.");
      } else {
        await API.post("/menus/", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Menu has been added successfully.");
      }

      await loadMenus();
      resetForm();
    } catch (error) {
      console.log(error);

      const responseData = error.response?.data;

      if (responseData && typeof responseData === "object") {
        setErrors(responseData);
      } else {
        setErrors({
          form: "Something went wrong. Please check the menu details and try again.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getErrorMessage = (field) => {
    const error = errors[field];

    if (!error) return null;

    if (Array.isArray(error)) {
      return error.join(" ");
    }

    return error;
  };

  if (checkingAccess) {
    return (
      <main>
        <section className="dashboard-shell">
          <div className="empty-state">Checking admin access...</div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <div className="hero-kicker">Admin dashboard</div>
            <h1>Add a new menu item</h1>
            <p>
              Create a menu entry with clear details, pricing, availability,
              and media so visitors can browse it easily.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="success-box">
            <strong>Success.</strong> {successMessage}
          </div>
        )}

        {getErrorMessage("form") && (
          <div className="error-box">
            <strong>Unable to save menu.</strong> {getErrorMessage("form")}
          </div>
        )}

        <form className="menu-form-layout" onSubmit={handleSubmit}>
          <div className="form-main">
            <section className="card form-section">
              <div className="section-heading">
                <span className="section-number">01</span>
                <div>
                  <h2>Basic information</h2>
                  <p>Start with the menu name, description, and category.</p>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="name">
                  Menu name <span>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Example: Nasi Goreng Kampung"
                  value={form.name}
                  onChange={handleChange}
                />
                <small>This name will appear on the menu card.</small>
                {getErrorMessage("name") && (
                  <p className="error-text">{getErrorMessage("name")}</p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="description">
                  Description <span>*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe the taste, ingredients, or what makes this menu special."
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                />
                <small>
                  Keep it short but informative. Around 1–2 sentences is enough.
                </small>
                {getErrorMessage("description") && (
                  <p className="error-text">
                    {getErrorMessage("description")}
                  </p>
                )}
              </div>

              <div className="field-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="main_course">Main Course</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                  <option value="drink">Drink</option>
                </select>
                <small>Choose the category that best matches this menu.</small>
              </div>
            </section>

            <section className="card form-section">
              <div className="section-heading">
                <span className="section-number">02</span>
                <div>
                  <h2>Pricing and availability</h2>
                  <p>Add the price, preparation time, and available date.</p>
                </div>
              </div>

              <div className="form-grid two-columns">
                <div className="field-group">
                  <label htmlFor="price">
                    Price <span>*</span>
                  </label>
                  <div className="input-prefix">
                    <span>Rp</span>
                    <input
                      id="price"
                      type="number"
                      name="price"
                      placeholder="25000"
                      value={form.price}
                      onChange={handleChange}
                    />
                  </div>
                  <small>Enter numbers only, without dots or commas.</small>
                  {getErrorMessage("price") && (
                    <p className="error-text">{getErrorMessage("price")}</p>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="prep_time_minutes">
                    Prep time <span>*</span>
                  </label>
                  <div className="input-suffix">
                    <input
                      id="prep_time_minutes"
                      type="number"
                      name="prep_time_minutes"
                      placeholder="30"
                      value={form.prep_time_minutes}
                      onChange={handleChange}
                    />
                    <span>min</span>
                  </div>
                  <small>Estimated preparation time for this menu.</small>
                  {getErrorMessage("prep_time_minutes") && (
                    <p className="error-text">
                      {getErrorMessage("prep_time_minutes")}
                    </p>
                  )}
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="available_date">Available date</label>
                <input
                  id="available_date"
                  type="date"
                  name="available_date"
                  value={form.available_date}
                  onChange={handleChange}
                />
                <small>
                  Optional. Use this if the menu is only available on a specific
                  date.
                </small>
              </div>
            </section>

            <section className="card form-section">
              <div className="section-heading">
                <span className="section-number">03</span>
                <div>
                  <h2>Menu details</h2>
                  <p>Set the difficulty level and simple menu labels.</p>
                </div>
              </div>

              <div className="field-group">
                <label>Difficulty</label>

                <div className="choice-grid">
                  <label className="choice-card">
                    <input
                      type="radio"
                      name="difficulty"
                      value="easy"
                      checked={form.difficulty === "easy"}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>Easy</strong>
                      <small>Simple and quick to prepare.</small>
                    </span>
                  </label>

                  <label className="choice-card">
                    <input
                      type="radio"
                      name="difficulty"
                      value="medium"
                      checked={form.difficulty === "medium"}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>Medium</strong>
                      <small>Needs a bit more preparation.</small>
                    </span>
                  </label>

                  <label className="choice-card">
                    <input
                      type="radio"
                      name="difficulty"
                      value="hard"
                      checked={form.difficulty === "hard"}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>Hard</strong>
                      <small>More complex or time-consuming.</small>
                    </span>
                  </label>
                </div>
              </div>

              <div className="field-group">
                <label>Labels</label>

                <div className="toggle-row">
                  <label className="toggle-card">
                    <input
                      type="checkbox"
                      name="is_halal"
                      checked={form.is_halal}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>Halal</strong>
                      <small>Mark this menu as halal-friendly.</small>
                    </span>
                  </label>

                  <label className="toggle-card">
                    <input
                      type="checkbox"
                      name="is_spicy"
                      checked={form.is_spicy}
                      onChange={handleChange}
                    />
                    <span>
                      <strong>Spicy</strong>
                      <small>Use this if the menu has a spicy taste.</small>
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <section className="card form-section">
              <div className="section-heading">
                <span className="section-number">04</span>
                <div>
                  <h2>Media</h2>
                  <p>Upload a photo and optional video for this menu.</p>
                </div>
              </div>

              <div className="media-upload-grid">
                <div className="field-group">
                  <label htmlFor="image">Menu photo</label>

                  <label className="upload-box" htmlFor="image">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Menu preview" />
                    ) : (
                      <div>
                        <strong>Upload photo</strong>
                        <span>JPG, PNG, or WEBP</span>
                      </div>
                    )}
                  </label>

                  <input
                    key={`image-${fileInputKey}`}
                    id="image"
                    className="hidden-file"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />

                  <small>
                    Recommended: use a clear landscape photo of the menu.
                  </small>

                  {getErrorMessage("image") && (
                    <p className="error-text">{getErrorMessage("image")}</p>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="video">Menu video</label>

                  <label className="upload-box" htmlFor="video">
                    {videoPreview ? (
                      <video src={videoPreview} controls />
                    ) : (
                      <div>
                        <strong>Upload video</strong>
                        <span>Optional, MP4 recommended</span>
                      </div>
                    )}
                  </label>

                  <input
                    key={`video-${fileInputKey}`}
                    id="video"
                    className="hidden-file"
                    type="file"
                    name="video"
                    accept="video/*"
                    onChange={handleChange}
                  />

                  <small>
                    Optional. Good for cooking process, serving, or menu preview.
                  </small>

                  {getErrorMessage("video") && (
                    <p className="error-text">{getErrorMessage("video")}</p>
                  )}
                </div>
              </div>
            </section>
          </div>

          <aside className="form-sidebar">
            <div className="card sidebar-card">
              <h2>Before saving</h2>

              <ul>
                <li>Use a clear menu name.</li>
                <li>Add a short but helpful description.</li>
                <li>Check the price and prep time.</li>
                <li>Upload a good photo if available.</li>
              </ul>

              <button type="submit" disabled={submitting}>
                {submitting ? "Saving menu..." : editingMenuId ? "Update Menu" : "Save Menu"}
              </button>

              {editingMenuId && (
                <button
                  type="button"
                  className="btn-secondary reset-button"
                  onClick={resetForm}
                  disabled={submitting}
                  style={{marginTop:12}}
                >
                  Cancel edit
                </button>
              )}

              {!editingMenuId && (
                <button
                  type="button"
                  className="btn-secondary reset-button"
                  onClick={resetForm}
                  disabled={submitting}
                  style={{marginTop:12}}
                >
                  Clear Form
                </button>
              )}

              <p>
                Fields marked with <strong>*</strong> are required.
              </p>
            </div>
          </aside>
        </form>

        <section className="card menu-list-section">
          <div className="section-heading" style={{marginBottom:16}}>
            <div>
              <h2>Manage existing menus</h2>
              <p>Update or delete menu items that are already published.</p>
            </div>
          </div>

          {loadingMenus ? (
            <div className="empty-state">Loading menus...</div>
          ) : menus.length === 0 ? (
            <div className="empty-state">No menu items found yet.</div>
          ) : (
            <div className="menu-management-grid">
              {menus.map((menu) => (
                <div key={menu.id} className="card menu-card menu-item-card">
                  <div className="menu-image-wrap">
                    {menu.image ? (
                      <img
                        src={menu.image.startsWith("http") ? menu.image : `${BACKEND_URL}${menu.image}`}
                        alt={menu.name}
                      />
                    ) : (
                      <div className="menu-image-placeholder">
                        <span>{menu.category?.replace("_", " ") || "Menu"}</span>
                      </div>
                    )}
                  </div>

                  <div className="menu-content">
                    <div className="menu-meta">
                      <span className="badge">{menu.category?.replace("_", " ")}</span>
                      <span className="price">Rp{menu.price}</span>
                    </div>

                    <h2>{menu.name}</h2>
                    <p>{menu.description}</p>

                    <div className="menu-item-actions" style={{ marginTop: 18 }}>
                      <button type="button" className="btn-secondary" onClick={() => handleEdit(menu)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(menu.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Dashboard;