import React, { useState } from 'react';
import SeverityBadge from './SeverityBadge';
import Sparkline from './Sparkline';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import ParticleGrid from './ParticleGrid';
import WorldTradeMap from './WorldTradeMap';
import { FONTS } from '../constants';
import { useAlerts, useIndexData } from '../hooks';

function LandingPage({ onShowDemo }) {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const { alerts } = useAlerts(4);
  const { indexData } = useIndexData();

  return (
    <div style={{ background: "#07080a", minHeight: "100vh", color: "#e8e6e1", position: "relative" }}>
      <ParticleGrid />
      <nav style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 48px 80px", position: "sticky", top: 0, background: "rgba(7,8,10,0.95)", backdropFilter: "blur(10px)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "80px", maxWidth: 1000, width: "100%", background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", padding: "16px 50px", borderRadius: "50px", boxShadow: "0 4px 20px rgba(200,169,50,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
            <img src="logo.jpeg" alt="Advuman Logo" style={{ width: 32, height: 32, borderRadius: "8px", objectFit: "cover" }} />
            <span style={{ fontWeight: 500, fontSize: 18, letterSpacing: "0.01em", color: "#07080a" }}>ADVUMAN</span>
          </div>
          <div style={{ display: "flex", gap: "50px", alignItems: "center", flex: 1, justifyContent: "center" }}>
            <a href="#how" style={{ color: "#07080a", textDecoration: "none", fontSize: 14, fontWeight: 400, transition: "all 0.2s", opacity: 0.75 }} onMouseEnter={(e) => { e.target.style.opacity = "1"; }} onMouseLeave={(e) => { e.target.style.opacity = "0.75"; }}>How It Works</a>
            <a href="#pricing" style={{ color: "#07080a", textDecoration: "none", fontSize: 14, fontWeight: 400, transition: "all 0.2s", opacity: 0.75 }} onMouseEnter={(e) => { e.target.style.opacity = "1"; }} onMouseLeave={(e) => { e.target.style.opacity = "0.75"; }}>Pricing</a>
            <button onClick={() => setShowLogin(true)} style={{ background: "transparent", border: "none", color: "#07080a", padding: "10px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s", opacity: 0.75 }} onMouseEnter={(e) => { e.target.style.opacity = "1"; }} onMouseLeave={(e) => { e.target.style.opacity = "0.75"; }}>Login</button>
            <button onClick={() => setShowSignup(true)} style={{ background: "#07080a", border: "none", color: "#c8a932", padding: "10px 24px", borderRadius: "24px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.01em", transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }} onMouseEnter={(e) => { e.target.style.boxShadow = "0 3px 12px rgba(0,0,0,0.25)"; }} onMouseLeave={(e) => { e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)"; }}>START TRIAL →</button>
          </div>
        </div>
      </nav>

      <section style={{ padding: "140px 40px 100px", maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: -50, left: "50%", transform: "translateX(-50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(200,169,50,0.08) 0%, transparent 70%)", pointerEvents: "none", borderRadius: "50%" }} />
        <div style={{ display: "inline-block", padding: "6px 18px", background: "rgba(200,169,50,0.15)", border: "1px solid rgba(200,169,50,0.35)", borderRadius: "4px", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.12em", marginBottom: 32, fontWeight: 600 }}>UK ↔ INDIA TRADE INTELLIGENCE</div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 28, color: "#f0ede6" }}>
          Know what's changing<br /><span style={{ background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>before it hits your P&L</span>
        </h1>
        <p style={{ fontSize: 18, color: "#8a887f", maxWidth: 620, margin: "0 auto 52px", lineHeight: 1.8 }}>
          Early warning intelligence for UK businesses trading with India. Regulatory shifts, tariff changes, and compliance updates — delivered before your competitors know they exist.
        </p>
        <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto 32px", justifyContent: "center" }}>
          <button onClick={() => setShowSignup(true)} style={{ padding: "14px 32px", background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", color: "#07080a", border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(200,169,50,0.2)" }} onMouseEnter={(e) => { e.target.style.boxShadow = "0 6px 20px rgba(200,169,50,0.35)"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.boxShadow = "0 4px 12px rgba(200,169,50,0.2)"; e.target.style.transform = "translateY(0)"; }}>Start Free Trial</button>
          <button onClick={onShowDemo} style={{ padding: "14px 32px", background: "#0e1014", color: "#c8a932", border: "1px solid #c8a93240", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }} onMouseEnter={(e) => { e.target.style.borderColor = "#c8a93260"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.borderColor = "#c8a93240"; e.target.style.transform = "translateY(0)"; }}>See Live Demo</button>
        </div>
        <p style={{ fontSize: 13, color: "#555", marginTop: 24 }}>14-day free trial · No credit card required</p>
      </section>

      <section style={{ borderTop: "1px solid #1a1c20", borderBottom: "1px solid #1a1c20", overflow: "hidden", padding: "32px 0", background: "#0a0b0e", position: "relative" }}>
        <div style={{ display: "flex", gap: 20, padding: "0 40px", animation: "scroll 40s linear infinite" }}>
          {alerts.length > 0 && [...alerts, ...alerts].map((a, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "20px 24px", background: "#0e1014", border: "1px solid #1a1c20", borderRadius: 8, minWidth: 400, maxWidth: 400, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <SeverityBadge severity={a.severity} />
                <span style={{ fontSize: 13, color: "#888", fontFamily: FONTS.mono, fontWeight: 700 }}>{new Date(a.date).toLocaleDateString()}</span>
              </div>
              <h4 style={{ fontSize: 17, color: "#f0ede6", fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{a.title}</h4>
              <p style={{ fontSize: 15, color: "#a8a69d", lineHeight: 1.6, fontWeight: 500 }}>{a.summary.substring(0, 120)}...</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={{ padding: "120px 40px", maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#ff6b6b", letterSpacing: "0.12em", marginBottom: 24, fontWeight: 700, textTransform: "uppercase" }}>THE PROBLEM</h2>
            <h3 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 24, color: "#f0ede6" }}>You find out about trade barriers after they've already cost you money.</h3>
            <p style={{ color: "#8a887f", lineHeight: 1.9, fontSize: 16 }}>India's regulatory landscape moves fast. CBIC notifications, DGFT circulars, BIS quality orders, RBI policy changes — scattered across dozens of government sources in multiple languages. By the time it reaches industry news, your shipment is already stuck at customs or your pricing is wrong.</p>
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#4ddbaa", letterSpacing: "0.12em", marginBottom: 24, fontWeight: 700, textTransform: "uppercase" }}>THE SOLUTION</h2>
            <h3 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25, marginBottom: 24, color: "#f0ede6" }}>Intelligence, not information. Decisions, not data dumps.</h3>
            <p style={{ color: "#8a887f", lineHeight: 1.9, fontSize: 16, marginBottom: 32 }}>Advuman monitors 25+ official sources across the UK-India corridor. We filter the noise, verify the signal, and deliver actionable intelligence — with what it means for your specific business and what you should do about it.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {["Weekly intelligence briefings", "Real-time critical alerts via WhatsApp", "Sector-specific risk indexes", "Plain-English regulatory translations"].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", borderRadius: "50%", flexShrink: 0, boxShadow: "0 0 8px rgba(200,169,50,0.3)" }} />
                  <span style={{ fontSize: 15, color: "#b0ae9f", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: "120px 40px", borderTop: "1px solid #1a1c20", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.12em", marginBottom: 16, fontWeight: 700, textAlign: "center", textTransform: "uppercase" }}>GLOBAL COVERAGE</h2>
          <h3 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 24, color: "#f0ede6" }}>Monitor trade corridors worldwide</h3>
          <p style={{ fontSize: 15, color: "#8a887f", textAlign: "center", marginBottom: 48, maxWidth: 700, margin: "0 auto 48px" }}>Real-time risk assessment across multiple trade routes. Track regulatory changes, logistics strain, and cost pressure for every corridor.</p>
          <WorldTradeMap onCorridorClick={() => {}} />
        </div>
      </section>

      <section style={{ padding: "120px 40px", borderTop: "1px solid #1a1c20", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.12em", marginBottom: 16, fontWeight: 700, textAlign: "center", textTransform: "uppercase" }}>PROPRIETARY INDEXES</h2>
          <h3 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 72, color: "#f0ede6" }}>Three numbers that tell you the real story</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {Object.keys(indexData).length > 0 && Object.values(indexData).map((idx) => (
              <div key={idx.abbrev} style={{ background: "linear-gradient(135deg, #0e1014 0%, #0f101a 100%)", border: "1px solid #c8a93220", borderRadius: 8, padding: 36, transition: "all 0.3s", cursor: "pointer", position: "relative", overflow: "hidden" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8a93240"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(200,169,50,0.15)"; e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#c8a93220"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(200,169,50,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, position: "relative", zIndex: 1 }}>
                  <div>
                    <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#666", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 600 }}>{idx.abbrev}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#b0ae9f" }}>{idx.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 40, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#f0ede6" }}>{idx.value}</div>
                    <div style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: idx.change > 0 ? "#ff6b6b" : "#4ddbaa", fontWeight: 700, marginTop: 4 }}>{idx.change > 0 ? "▲" : "▼"} {Math.abs(idx.change).toFixed(1)}</div>
                  </div>
                </div>
                <Sparkline data={idx.history} color={idx.change > 0 ? "#ff6b6b" : "#4ddbaa"} width="100%" height={50} />
                <p style={{ fontSize: 13, color: "#666", marginTop: 20, lineHeight: 1.6 }}>{idx.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" style={{ padding: "120px 40px", borderTop: "1px solid #1a1c20", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.12em", marginBottom: 16, fontWeight: 700, textTransform: "uppercase" }}>PRICING</h2>
          <h3 style={{ fontSize: 36, fontWeight: 700, marginBottom: 20, color: "#f0ede6" }}>Less than one customs penalty.</h3>
          <p style={{ color: "#8a887f", marginBottom: 80, fontSize: 17, lineHeight: 1.8 }}>One missed CBIC notification can cost you thousands. Advuman costs less than a consultant lunch.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ background: "linear-gradient(135deg, #0e1014 0%, #12131a 100%)", border: "1px solid #c8a93220", borderRadius: 12, padding: 48, position: "relative", boxShadow: "0 12px 40px rgba(200,169,50,0.08)" }}>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700, textTransform: "uppercase" }}>STARTER</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 32 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#f0ede6" }}>£79</span>
                <span style={{ fontSize: 16, color: "#666" }}>/month</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left", marginBottom: 36 }}>
                {["Weekly intelligence briefings", "Email critical alerts", "RPI, LSI, CPI indexes", "Sector-specific tracking", "Impact assessments"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ color: "#c8a932", fontSize: 14, marginTop: -2, fontWeight: 800 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#b0ae9f" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ width: "100%", padding: "14px 0", background: "transparent", color: "#c8a932", border: "1px solid #c8a93240", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.target.style.borderColor = "#c8a93260"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.borderColor = "#c8a93240"; e.target.style.transform = "translateY(0)"; }}>Start Free Trial</button>
            </div>
            <div style={{ background: "linear-gradient(135deg, #0e1014 0%, #12131a 100%)", border: "1px solid #c8a93230", borderRadius: 12, padding: 48, position: "relative", boxShadow: "0 20px 60px rgba(200,169,50,0.1)" }}>
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%) translateY(-1px)", width: "80%", height: 2, background: "linear-gradient(90deg, transparent, #c8a932, transparent)" }} />
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#c8a932", letterSpacing: "0.1em", marginBottom: 12, fontWeight: 700, textTransform: "uppercase" }}>PROFESSIONAL</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 32 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#f0ede6" }}>£150</span>
                <span style={{ fontSize: 16, color: "#666" }}>/month</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left", marginBottom: 36 }}>
                {["Weekly UK-India intelligence briefings", "Real-time WhatsApp critical alerts", "RPI, LSI, CPI corridor indexes", "Sector-specific regulatory tracking", "Plain-English impact assessments", "Monthly strategic outlook report", "Direct analyst access (email)"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ color: "#c8a932", fontSize: 14, marginTop: -2, fontWeight: 800 }}>✓</span>
                    <span style={{ fontSize: 14, color: "#b0ae9f" }}>{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ width: "100%", padding: "14px 0", background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", color: "#07080a", border: "none", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(200,169,50,0.2)" }} onMouseEnter={(e) => { e.target.style.boxShadow = "0 6px 20px rgba(200,169,50,0.35)"; e.target.style.transform = "translateY(-2px)"; }} onMouseLeave={(e) => { e.target.style.boxShadow = "0 4px 12px rgba(200,169,50,0.2)"; e.target.style.transform = "translateY(0)"; }}>Start Free Trial</button>
              <p style={{ fontSize: 11, color: "#555", marginTop: 12 }}>No card required · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid #1a1c20", padding: "48px 40px", textAlign: "center", background: "linear-gradient(180deg, rgba(7,8,10,0.5) 0%, #07080a 100%)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #c8a932 0%, #d4b744 100%)", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#07080a", fontFamily: "'JetBrains Mono', monospace" }}>A</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#b0ae9f" }}>ADVUMAN</span>
        </div>
        <p style={{ fontSize: 13, color: "#555" }}>Early warning intelligence for UK-India trade · © 2026</p>
      </footer>
      
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default LandingPage;
