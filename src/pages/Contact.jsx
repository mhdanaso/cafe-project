import { useState } from "react";
import SEO from "../components/SEO";
import "./Contact.css";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, message });
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact | Rivera Coffee"
        description="Get in touch with Rivera Coffee. Visit us or send a message."
      />
      <h1>Contact Us</h1>

      {submitted ? (
        <p className="success-msg">Thanks {name}, we'll get back to you soon!</p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            required
          />
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
}

export default Contact;