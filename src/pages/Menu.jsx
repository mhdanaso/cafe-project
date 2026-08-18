import { useState } from "react";
import SEO from "../components/SEO";
import "./Menu.css";

const menuItems = [
  { id: 1, name: "Espresso", price: 120, category: "Espresso" },
  { id: 2, name: "Cappuccino", price: 160, category: "Espresso" },
  { id: 3, name: "Filter Coffee", price: 90, category: "Filter" },
  { id: 4, name: "Cold Brew", price: 180, category: "Filter" },
  { id: 5, name: "Croissant", price: 110, category: "Pastries" },
  { id: 6, name: "Almond Biscotti", price: 90, category: "Pastries" },
];

const categories = ["All", "Espresso", "Filter", "Pastries"];

function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="menu-page">
      <SEO
        title="Menu | Rivera Coffee"
        description="Explore our menu of espresso, filter coffee, and pastries."
      />
      <h1>Our Menu</h1>

      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="menu-list">
        {filteredItems.map((item) => (
          <div className="menu-item" key={item.id}>
            <span>{item.name}</span>
            <span>₹{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;