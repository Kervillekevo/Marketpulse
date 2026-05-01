import Footer from "../components/Footer";
import "./About.css";
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "5K+",  label: "Tech Products" },
  { value: "98%",  label: "Satisfaction Rate" },
  { value: "24/7", label: "Customer Support" },
];

const team = [
  { name: "Kevin Ngugi",   role: "Founder & CEO",        avatar: "/kevo.jpg" },
  { name: "Sarah Wanjiku", role: "Head of Operations",    avatar: "/tasha.jpg" },
  { name: "James Omondi",  role: "Lead Developer",        avatar: "/user.png" },
  { name: "Amina Hassan",  role: "Marketing Director",    avatar: "/jk.jpg" },
];

const values = [
  { icon: "🚀", title: "Speed",     desc: "Same-day delivery across Nairobi. We move fast so you don't have to wait." },
  { icon: "🔒", title: "Trust",     desc: "Every product is genuine and verified. Every transaction is secure. No compromises." },
  { icon: "💎", title: "Quality",   desc: "Genuine tech products only. We source directly from authorized distributors." },
  { icon: "🤝", title: "Community", desc: "Built for Kenyans, by Kenyans. We grow together with our customers and partners." },
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
              Nairobi's Most <span>Trusted</span><br />Tech Store
            </h1>
            <p>
              Big Five Technologies was born out of a passion for tech — bringing the latest
              laptops, phones, cameras and more to Kenyans at unbeatable prices.
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
              <h2>Premium Tech, <span>Affordable Prices</span></h2>
              <p>
                Big Five Technologies is more than a tech store — it's your trusted partner
                in navigating the ever-evolving world of technology. We connect everyday
                Kenyans with the latest and greatest consumer electronics at fair prices.
              </p>
              <p>
                From laptops to home audio systems, phones to cameras — we're building the
                go-to destination for tech in Kenya. Fast, genuine, and always reliable.
              </p>
              <div className="about-mission-chips">
                <span>🇰🇪 Based in Nairobi</span>
                <span>⚡ Same-Day Delivery</span>
                <span>🔐 Secure Payments</span>
              </div>
            </div>
            <div className="about-mission-visual">
              <div className="about-visual-card about-card-1">
                <strong>5,000+</strong>
                <p>Tech products available</p>
              </div>
              <div className="about-visual-card about-card-2">
                <strong>Same Day</strong>
                <p>Delivery in Nairobi</p>
              </div>
              <div className="about-visual-card about-card-3">
                <strong>4.9 / 5</strong>
                <p>Average rating</p>
              </div>
              <div className="about-visual-card about-card-4">
                <strong>100%</strong>
                <p>Genuine products</p>
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
                    <a href="#"><FaXTwitter /></a>
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
            <h2>Ready to Upgrade <span>Your Tech?</span></h2>
            <p>Join thousands of Kenyans who trust Big Five Technologies every day.</p>
            <a href="/" className="about-btn-primary">Browse Products →</a>
          </div>
        </section>

      </div>
      <Footer/>
    </>
  );
}

export default About;