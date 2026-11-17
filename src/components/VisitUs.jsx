import { Link } from "react-router-dom";
import { ArrowRight, Clock3, Mail, MapPin, Phone } from "lucide-react";
import "./VisitUs.css";

function VisitUs() {
  return (
    <section className="visit-us">
      <div className="visit-content">
        <div className="visit-intro">
          <p className="section-label">COME VISIT US</p>
          <h2>Your daily coffee ritual starts here.</h2>
          <p>
            Stop by Rivera Coffee for freshly roasted beans, handcrafted
            drinks, and a calm space to slow down.
          </p>

          <Link to="/contact" className="visit-button">
            Contact Us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="visit-details">
          <div className="detail-block">
            <h3><MapPin size={19} aria-hidden="true" />Find Us</h3>
            <p>123 Beach Road</p>
            <p>Calicut, Kerala 673001</p>
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </div>

          <div className="detail-block">
            <h3><Clock3 size={19} aria-hidden="true" />Opening Hours</h3>
            <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
            <p>Saturday - Sunday: 9:00 AM - 9:00 PM</p>
          </div>

          <div className="detail-block">
            <h3><Phone size={19} aria-hidden="true" />Contact</h3>
            <p>
              <a href="tel:+919876543210"><Phone size={16} aria-hidden="true" />+91 98765 43210</a>
            </p>
            <p>
              <a href="mailto:hello@riveracoffee.com">
                <Mail size={16} aria-hidden="true" />
                hello@riveracoffee.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisitUs;