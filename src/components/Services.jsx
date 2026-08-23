// src/components/Services.jsx
import "./Services.css";

const services = [
  { title: "Espresso Bar", desc: "Classic and specialty espresso drinks, made fresh." },
  { title: "Fresh Roasting", desc: "Beans roasted in-house every morning, never stale." },
  { title: "Cozy Space", desc: "A quiet corner to work, read, or catch up with a friend." },
];

function Services() {
  return (
    <section className="services">
      <h2>What We Offer</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;