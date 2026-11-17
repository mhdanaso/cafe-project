// src/components/Services.jsx
import { Armchair, Coffee, Flame } from "lucide-react";
import "./Services.css";

const services = [
  {
    title: "Espresso Bar",
    desc: "Classic and specialty espresso drinks, made fresh.",
    icon: Coffee,
  },
  {
    title: "Fresh Roasting",
    desc: "Beans roasted in-house every morning, never stale.",
    icon: Flame,
  },
  {
    title: "Cozy Space",
    desc: "A quiet corner to work, read, or catch up with a friend.",
    icon: Armchair,
  },
];

function Services() {
  return (
    <section className="services">
      <h2>What We Offer</h2>
      <div className="services-grid">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div className="service-card" key={service.title}>
              <Icon className="service-icon" size={32} aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services;