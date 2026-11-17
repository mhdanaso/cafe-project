import { useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, Home, Mail, Menu as MenuIcon, UtensilsCrossed, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav>
      <div className="nav-brand">
        <Coffee size={22} aria-hidden="true" />
        Rivera Coffee
      </div>
      <button
        className="menu-toggle"
        type="button"
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} aria-hidden="true" /> : <MenuIcon size={24} aria-hidden="true" />}
      </button>
      <ul className={isMenuOpen ? "nav-links open" : "nav-links"}>
        <li>
          <Link to="/">
            <Home size={17} aria-hidden="true" />
            Home
          </Link>
        </li>
        <li>
          <Link to="/menu">
            <UtensilsCrossed size={17} aria-hidden="true" />
            Menu
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <Mail size={17} aria-hidden="true" />
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;