import Footer from "../components/Footer";
import "./About.css";
import { FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "12K+", label: "Products Listed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Customer Support" },
];

const team = [
  { name: "Kevin Ngugi", role: "Founder & CEO", avatar: "/kevo.jpg" },
  { name: "Sarah Wanjiku", role: "Head of Operations", avatar: "/tasha.jpg" },
  { name: "James Omondi", role: "Lead Developer", avatar: "/user.png" },
  { name: "Amina Hassan", role: "Marketing Director", avatar: "/jk.jpg" },
];

const values = [
  { icon: "🚀", title: "Speed", desc: "Same-day delivery across Nairobi. We move fast so you don't have to wait." },
  { icon: "🔒", title: "Trust", desc: "Every seller is verified. Every transaction is secure. No compromises." },
  { icon: "💎", title: "Quality", desc: "Curated products only. We reject anything that doesn't meet our standards." },
  { icon: "🤝", title: "Community", desc: "Built for Kenyans, by Kenyans. We grow together with our customers and sellers." },
];

function About() {
  return (
    <>
      <div className="about-page">

        <section className="about-hero">
          <div className="about-hero-orb about-orb-1" />
          <div className="about-hero-orb about-orb-2" />
          <div className="about-hero-inner">
            <span className="about-badge">Our Story</span>
            <h1>
              Kenya's Most <span>Trusted</span><br />Online Marketplace
            </h1>
            <p>
              MarketPulse was born out of frustration — unreliable sellers, slow delivery,
              and no accountability. We built the platform we wished existed.
            </p>
            <div className="about-hero-actions">
              <a href="/" className="about-btn-primary">Shop Now</a>
              <a href="#mission" className="about-btn-secondary">Our Mission</a>
            </div>
          </div>
        </section>

        <section className="about-stats">
          <div className="about-stats-inner">
            {stats.map((s, i) => (
              <div className="about-stat-card" key={i}>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-mission" id="mission">
          <div className="about-mission-inner">
            <div className="about-mission-text">
              <span className="about-section-eyebrow">Our Mission</span>
              <h2>Connecting Buyers & Sellers <span>Seamlessly</span></h2>
              <p>
                MarketPulse is more than a marketplace — it's a movement. We connect
                everyday Kenyans with quality products at fair prices, while empowering
                local sellers to grow their businesses digitally.
              </p>
              <p>
                From electronics to fashion, home goods to drinks — we're building the
                infrastructure for modern commerce in Kenya. Fast, safe, and always reliable.
              </p>
              <div className="about-mission-chips">
                <span>🇰🇪 Made in Kenya</span>
                <span>⚡ Same-Day Delivery</span>
                <span>🔐 Secure Payments</span>
              </div>
            </div>
            <div className="about-mission-visual">
              <div className="about-visual-card about-card-1">
                <span>🛍️</span>
                <strong>12,000+</strong>
                <p>Products available</p>
              </div>
              <div className="about-visual-card about-card-2">
                <span>📦</span>
                <strong>Same Day</strong>
                <p>Delivery in Nairobi</p>
              </div>
              <div className="about-visual-card about-card-3">
                <span>⭐</span>
                <strong>4.9 / 5</strong>
                <p>Average rating</p>
              </div>
              <div className="about-visual-card about-card-4">
                <span>🔒</span>
                <strong>100%</strong>
                <p>Secure checkout</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-values">
          <div className="about-values-inner">
            <div className="about-section-header">
              <span className="about-section-eyebrow">What We Stand For</span>
              <h2>Our Core <span>Values</span></h2>
            </div>
            <div className="about-values-grid">
              {values.map((v, i) => (
                <div className="about-value-card" key={i}>
                  <div className="about-value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-team">
          <div className="about-team-inner">
            <div className="about-section-header">
              <span className="about-section-eyebrow">The People</span>
              <h2>Meet the <span>Team</span></h2>
            </div>
            <div className="about-team-grid">
              {team.map((member, i) => (
                <div className="about-team-card" key={i}>
                  <div className="about-team-avatar">
                    <img src={member.avatar} alt={member.name} />
                  </div>
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <div className="about-team-socials">
                    <a href="#"><FaTwitter /></a>
                    <a href="#"><FaLinkedinIn /></a>
                    <a href="#"><FaGithub /></a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-cta-orb" />
          <div className="about-cta-inner">
            <h2>Ready to Start <span>Shopping?</span></h2>
            <p>Join thousands of Kenyans who trust MarketPulse every day.</p>
            <a href="/" className="about-btn-primary">Browse Products →</a>
          </div>
        </section>

      </div>
      <Footer/>
    </>
  );
}

export default About;