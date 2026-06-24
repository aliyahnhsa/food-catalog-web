import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuList from "./pages/MenuList";
import MenuDetail from "./pages/MenuDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menus" element={<MenuList />} />
            <Route path="/menus/:id" element={<MenuDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;