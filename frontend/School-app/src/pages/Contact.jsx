import { useState } from "react";
import "./Contact.css";
import Footer from "../components/Footer";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";

const contactCards = [
  { icon: "📞", label: "Call Us",    value: "0790 240220",              sub: "Mon–Sat, 8am–8pm" },
  { icon: "✉️", label: "Email Us",   value: "kelvinngui00@gmail.com",   sub: "We reply within 24hrs" },
  { icon: "📍", label: "Find Us",    value: "Nairobi, Kenya",           sub: "Serving all 47 counties" },
  { icon: "⚡", label: "Live Chat",  value: "Available on WhatsApp",    sub: "Instant responses" },
];

const faqs = [
  { q: "How fast is delivery?",      a: "Same-day delivery within Nairobi. Upcountry orders take 2–4 business days." },
  { q: "Are your products genuine?", a: "Yes — all our products are 100% genuine and sourced from authorized distributors." },
  { q: "Is payment secure?",         a: "Absolutely. We use M-Pesa STK push and all transactions are encrypted." },
  { q: "How do I track my order?",   a: "Log in to your account and visit My Orders to track your shipment in real time." },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hello Big Five Technologies, I need help with...");
    window.open(`https://wa.me/254790240220?text=${msg}`, "_blank");
  };

  return (
    <>
    <div className="contact-page">

      <section className="contact-hero">
        <div className="contact-hero-orb contact-orb-1" />
        <div className="contact-hero-orb contact-orb-2" />
        <div className="contact-hero-inner">
          <span className="contact-badge">Get In Touch</span>
          <h1>We're Here to <span>Help You</span></h1>
          <p>Have a question about a product or your order? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="contact-cards-section">
        <div className="contact-cards-inner">
          {contactCards.map((card, i) => (
            <div className="contact-info-card" key={i}>
              <div className="contact-info-icon">{card.icon}</div>
              <h4>{card.label}</h4>
              <p className="contact-info-value">{card.value}</p>
              <span className="contact-info-sub">{card.sub}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-main-inner">

          <div className="contact-form-wrap">
            <div className="contact-form-header">
              <h2>Send Us a <span>Message</span></h2>
              <p>Fill in the form and we'll get back to you as soon as possible.</p>
            </div>

            {submitted && (
              <div className="contact-success">
                Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="contact-form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@email.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="contact-form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-group">
                <label>Message</label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-form-actions">
                <button type="submit" className="contact-submit-btn">
                  Send Message →
                </button>
                <button type="button" className="contact-whatsapp-btn" onClick={handleWhatsApp}>
                  <FaWhatsapp /> Chat on WhatsApp
                </button>
              </div>
            </form>
          </div>

          <div className="contact-side">
            <div className="contact-side-card">
              <h3>Quick Links</h3>
              <div className="contact-quick-links">
                <a href="/">Browse Products</a>
                <a href="/orders">Track My Order</a>
                <a href="/about">About Us</a>
                <a href="#">Return Policy</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>

            <div className="contact-side-card">
              <h3>Follow Us</h3>
              <p className="contact-social-desc">Stay updated with our latest deals and tech news.</p>
              <div className="contact-socials">
                <a href="#" className="contact-social-btn"><FaFacebookF /></a>
                <a href="#" className="contact-social-btn"><FaXTwitter /></a>
                <a href="#" className="contact-social-btn"><FaInstagram /></a>
                <a href="#" className="contact-social-btn"><FaLinkedinIn /></a>
                <a href="#" className="contact-social-btn whatsapp"><FaWhatsapp /></a>
              </div>
            </div>

            <div className="contact-hours-card">
              <h3>Business Hours</h3>
              <div className="contact-hours-list">
                <div className="contact-hours-row">
                  <span>Monday – Friday</span>
                  <span>8:00 AM – 8:00 PM</span>
                </div>
                <div className="contact-hours-row">
                  <span>Saturday</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
                <div className="contact-hours-row">
                  <span>Sunday</span>
                  <span className="contact-closed">Closed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="contact-faq">
        <div className="contact-faq-inner">
          <div className="contact-faq-header">
            <span className="contact-badge">FAQ</span>
            <h2>Frequently Asked <span>Questions</span></h2>
          </div>
          <div className="contact-faq-list">
            {faqs.map((faq, i) => (
              <div
                className={`contact-faq-item ${openFaq === i ? "open" : ""}`}
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="contact-faq-q">
                  <span>{faq.q}</span>
                  <span className="contact-faq-arrow">{openFaq === i ? "▲" : "▼"}</span>
                </div>
                {openFaq === i && (
                  <div className="contact-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
}

export default Contact;