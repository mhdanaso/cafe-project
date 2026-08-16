import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <h1>Coffee, Roasted With Intention</h1>
      <p>Small-batch beans, roasted fresh every morning.</p>
      <Link to="/menu" className="cta-button">
        View Menu
      </Link>
    </section>
  );
}

export default Hero;