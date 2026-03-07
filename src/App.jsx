import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, ExternalLink, Mail, Phone, MapPin,
  Linkedin, Github, Twitter, Code, Smartphone,
  Zap, Users, Star, ArrowUpRight, Monitor, Layers, Shield,
  CheckCircle, PlayCircle, Fingerprint, Activity
} from 'lucide-react';

// ── Screenshot API ────────────────────────────────────────────────────────
const screenshotUrl = (url) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

const categoryMeta = {
  job: { label: 'Platform', accent: '#3b82f6' },
  nonprofit: { label: 'Non-Profit', accent: '#10b981' },
  health: { label: 'Healthcare', accent: '#8b5cf6' },
  other: { label: 'Corporate', accent: '#f59e0b' },
};

const websites = {
  jobPortals: [
    { name: 'Accountant Hire', url: 'https://accountanthire.com', category: 'job', description: 'Specialized accounting recruitment platform' },
    { name: 'Deep Dive Hire', url: 'https://deepdivehire.com', category: 'job', description: 'Tech talent acquisition system' },
    { name: 'Keyway Solutions', url: 'https://keywaysolutions.com', category: 'job', description: 'IT recruitment agency portal' },
    { name: 'Capstone Recruiter', url: 'https://capstonerecruiter.com', category: 'job', description: 'Graduate networking and recruitment' },
  ],
  nonProfit: [
    { name: 'Tulsa Nonprofit', url: 'https://tulsanonprofit.org', category: 'nonprofit', description: 'Community support and funding platform' },
    { name: 'Fund It Showit', url: 'https://funditshowit.com', category: 'nonprofit', description: 'Creative arts fundraising initiative' },
    { name: 'Sponsor Funded', url: 'https://sponsorfunded.com', category: 'nonprofit', description: 'Global sponsorship hub' },
  ],
  healthCare: [
    { name: 'Prestigious Health', url: 'https://prestigioushomehealth.com', category: 'health', description: 'Elderly care & healthcare services' },
  ],
  other: [
    { name: 'Geo Solutions', url: 'https://geosolutionspk.com', category: 'other', description: 'Geospatial & satellite imaging data' },
    { name: 'A New View Properties', url: 'https://anewviewproperties.com', category: 'other', description: 'Luxury real estate agency' },
    { name: 'Zuid 55', url: 'https://zuid55.com', category: 'other', description: 'Commercial real estate portfolio' },
  ],
};

const allWebsites = [
  ...websites.jobPortals, ...websites.nonProfit, ...websites.healthCare, ...websites.other,
];

// ── ANIMATION 1: Interactive Flowing Liquid Network ─────────────────────────
// A highly interactive mesh of liquid particles that connect and dynamically repel from the mouse.
function InteractiveNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    let rafId;

    let mouse = { x: null, y: null, radius: 300, isMoving: false }; // Increased Interaction radius
    let mouseTimeout;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const density = window.innerWidth < 768 ? 4000 : 8000; // More particles
      const numParticles = Math.floor((W * H) / density);

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 1.2, // Slightly faster base movement
          vy: (Math.random() - 0.5) * 1.2,
          baseX: Math.random() * W,
          baseY: Math.random() * H,
          size: Math.random() * 3 + 1, // Larger particles
          color: Math.random() > 0.7 ? [59, 130, 246] : (Math.random() > 0.4 ? [139, 92, 246] : (Math.random() > 0.2 ? [16, 185, 129] : [255, 255, 255])) // Added green
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Global glowing effect
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Soft bounce off walls with slight dampening
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > W) { p.x = W; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > H) { p.y = H; p.vy *= -1; }

        // Natural dampening to prevent infinite acceleration
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Ensure minimum speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.2) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }


        // Interaction with mouse - Liquid flow algorithm
        let isHighlighted = false;
        if (mouse.x != null) {
          let dx = mouse.x - p.x;
          let dy = mouse.y - p.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            isHighlighted = true;
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            // The closer, the stronger the force
            const force = (mouse.radius - distance) / mouse.radius;

            // Push particles away (creates a wake)
            const pushMultiplier = mouse.isMoving ? 15 : 5; // Stronger push when moving
            const pushX = forceDirectionX * force * pushMultiplier;
            const pushY = forceDirectionY * force * pushMultiplier;

            // Add mouse force to velocity instead of just moving position (more fluid)
            p.vx -= pushX * 0.05;
            p.vy -= pushY * 0.05;

            // Draw a vibrant halo around particles near mouse
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${0.4 * force})`;
            ctx.fill();

            // Particles light up intensely
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${0.5 + Math.random() * 0.5})`;
          } else {
            ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.4)`;
          }
        } else {
          ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.4)`;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles to create fluid web
        const connectionRadius = isHighlighted ? 180 : 130; // Further connections near mouse
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dX = p.x - p2.x;
          let dY = p.y - p2.y;
          let distance = Math.sqrt(dX * dX + dY * dY);

          // Only connect if within range
          if (distance < connectionRadius) {
            let opacity = 1 - (distance / connectionRadius);
            // Stronger, thicker lines near mouse
            const lineOpacity = isHighlighted ? opacity * 0.6 : opacity * 0.2;
            const lineWidth = isHighlighted ? 1.5 : 0.8;

            // Create gradient line between different colored particles
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${lineOpacity})`);
            grad.addColorStop(1, `rgba(${p2.color[0]}, ${p2.color[1]}, ${p2.color[2]}, ${lineOpacity})`);

            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = lineWidth;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw a subtle larger glow following the mouse
      if (mouse.x !== null) {
        ctx.beginPath();
        const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius * 0.8);
        mouseGlow.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        mouseGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGlow;
        ctx.arc(mouse.x, mouse.y, mouse.radius * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      rafId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isMoving = true;

      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        mouse.isMoving = false;
      }, 100);
    });
    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.isMoving = false;
    });

    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', resize); // Cleanup
      cancelAnimationFrame(rafId);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} />;
}

// ── ANIMATION 2: Realistic 3D Tilt Card (with glare) ────────────────────────
function TiltCard({ children, style }) {
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = -1 * ((x / rect.width) * 10 - 5);
    const rotateX = ((y / rect.height) * 10 - 5);

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.2 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ ...glare, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="tilt-container"
      style={{
        ...style,
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
        transition: 'opacity 0.3s'
      }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', width: '100%', transform: 'translateZ(30px)' }}>
        {children}
      </div>
    </div>
  );
}

// ── Site Card using TiltCard ────────────────────────────────────────────────
function SiteCard({ site }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const meta = categoryMeta[site.category];
  const host = site.url.replace(/^https?:\/\//, '');

  useEffect(() => {
    setSrc(screenshotUrl(site.url));
    setLoaded(false);
    setError(false);
  }, [site.url]);

  return (
    <TiltCard style={{
      display: 'flex', flexDirection: 'column',
      background: 'rgba(15, 15, 20, 0.5)',
      border: `1px solid rgba(255,255,255,0.06)`,
      borderRadius: 20,
      textDecoration: 'none',
      backdropFilter: 'blur(20px) saturate(140%)',
      cursor: 'pointer',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      height: '100%'
    }}>
      <a href={site.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', width: '100%', paddingTop: '65%', background: '#0a0a0f', overflow: 'hidden', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          {!loaded && !error && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #11111a 25%, #1c1c2b 50%, #11111a 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 2s infinite'
            }} />
          )}
          {error && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: `radial-gradient(circle at center, ${meta.accent}22 0%, #0a0a0f 80%)`
            }}>
              <Globe size={32} color={meta.accent} style={{ opacity: .6 }} />
              <span style={{ fontSize: 11, color: meta.accent, opacity: .7, fontFamily: 'monospace' }}>{host}</span>
            </div>
          )}
          {src && (
            <img src={src} alt={site.name} onLoad={() => setLoaded(true)} onError={() => setError(true)}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease'
              }}
            />
          )}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to top, rgba(15,15,20,1) 10%, transparent)', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: 16, left: 16,
            background: 'rgba(0,0,0,0.4)', border: `1px solid ${meta.accent}77`, color: '#fff',
            fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: 30, backdropFilter: 'blur(10px)'
          }}>{meta.label}</div>
        </div>
        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#ffffff', fontFamily: "'Outfit', sans-serif" }}>{site.name}</span>
            <ExternalLink size={16} color='rgba(255,255,255,0.4)' />
          </div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>{host}</span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 12, lineHeight: 1.6 }}>{site.description}</span>
        </div>
      </a>
    </TiltCard>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setCategory] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    // Premium cinematic loader delay
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const filtered = activeCategory === 'all'
    ? allWebsites
    : allWebsites.filter(s => s.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'job', label: 'Platforms' },
    { id: 'nonprofit', label: 'Non-Profit' },
    { id: 'health', label: 'Healthcare' },
    { id: 'other', label: 'Corporate' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; background: #000; }
        body { font-family: 'Inter', sans-serif; background: #020202; overflow-x: hidden; color: #f3f4f6; }
        
        ::selection { background: rgba(59, 130, 246, 0.4); color: #fff; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
        
        @keyframes shimmer { 0% {background-position: 200% 0} 100% {background-position: -200% 0} }
        @keyframes liquidAura { 
          0% { transform: translate(0, 0) scale(1) rotate(0deg); } 
          33% { transform: translate(5%, -5%) scale(1.1) rotate(2deg); }
          66% { transform: translate(-5%, 5%) scale(0.9) rotate(-2deg); }
          100% { transform: translate(0, 0) scale(1) rotate(0deg); }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(50px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        
        .fade-up-1 { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s; opacity: 0; }
        .fade-up-2 { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s; opacity: 0; }
        .fade-up-3 { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.6s; opacity: 0; }
        .fade-up-4 { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.8s; opacity: 0; }
        
        /* Premium Cinematic Loader */
        .loader {
          position: fixed; inset: 0; z-index: 9999; background: #030303;
          display: flex; align-items: center; justify-content: center;
          clip-path: inset(0 0 0 0);
          transition: clip-path 1.2s cubic-bezier(0.85, 0, 0.15, 1) 0.3s;
        }
        .loader.hidden { clip-path: inset(0 0 100% 0); pointer-events: none; }
        .loader-logo-wrap { overflow: hidden; padding: 20px; }
        .loader-logo {
          font-family: 'Outfit', sans-serif; font-size: clamp(28px, 5vw, 48px); font-weight: 400; color: #fff;
          letter-spacing: 0.3em; text-transform: uppercase;
          transform: translateY(110%);
          animation: slideUpTitle 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s, fadeOutTitle 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 1.8s;
        }
        @keyframes slideUpTitle { to { transform: translateY(0); } }
        @keyframes fadeOutTitle { to { opacity: 0; filter: blur(10px); transform: translateY(-20px); } }
        
        /* Realistic frosted glass button */
        .glass-btn {
          position: relative;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.6);
        }
        .glass-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: skewX(-20deg); transition: 0.7s;
        }
        .glass-btn:hover::before { left: 150%; }
        
        /* Interactive Nav Link */
        .nav-link {
          position: relative; color: rgba(255,255,255,0.6); text-decoration: none;
          font-weight: 500; font-size: 14px; letter-spacing: 0.02em; padding: 6px 12px;
          transition: color 0.3s ease;
          display: inline-block;
        }
        .nav-link:hover { color: #fff; }
        .nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6); transition: all 0.3s ease; transform: translateX(-50%);
          border-radius: 2px;
        }
        .nav-link:hover::after { width: 80%; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }

        /* Responsive Layout Utilities */
        .section-container { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
        .grid-2 { display: grid; grid-template-columns: 1fr; gap: 40px; }
        .grid-3 { display: grid; grid-template-columns: 1fr; gap: 24px; }
        
        @media (min-width: 768px) {
          .grid-2 { grid-template-columns: 1fr 1fr; gap: 60px; }
          .grid-3 { grid-template-columns: 1fr 1fr; }
          .hero-grid { grid-template-columns: 1.2fr 1fr !important; gap: 80px; }
        }
        @media (min-width: 1024px) {
          .grid-3 { grid-template-columns: 1fr 1fr 1fr; }
        }

        .desktop-nav { display: none; }
        .mobile-toggle { display: block; background: transparent; border: none; color: white; cursor: pointer; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .mobile-toggle { display: none; }
        }
      `}</style>

      {/* ── PREMIUM CINEMATIC LOADER ────────────────────────────────────────────── */}
      <div className={`loader ${!isLoading ? 'hidden' : ''}`}>
        <div className="loader-logo-wrap">
           <div className="loader-logo">
             OnT Sols<span style={{ color: '#3b82f6' }}>.</span>
           </div>
        </div>
      </div>

      {/* ── BACKGROUND INCANDESCENCE ────────────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-10%', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 60%)',
          filter: 'blur(90px)', animation: 'liquidAura 25s ease-in-out infinite alternate'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 60%)',
          filter: 'blur(90px)', animation: 'liquidAura 30s ease-in-out infinite alternate-reverse'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 0%, #000 100%)', opacity: 0.8 }} />
      </div>

      <InteractiveNetwork />

      <div style={{ position: 'relative', zIndex: 10, opacity: isLoading ? 0 : 1, transition: 'opacity 1s ease 0.5s' }}>

        {/* ── ULTRA-PREMIUM EDGE-TO-EDGE NAV ─────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          padding: scrollY > 50 ? '16px 0' : '28px 0',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          background: scrollY > 50 ? 'rgba(5, 5, 5, 0.85)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(30px) saturate(200%)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}>
          <div style={{
            maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #fff, #a1a1aa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif", color: '#000', fontSize: 18, fontWeight: 700,
                boxShadow: '0 4px 14px rgba(255,255,255,0.2)'
              }}>OT</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: "'Outfit', sans-serif", color: '#fff', letterSpacing: '0.05em' }}>
                OnT Sols
              </div>
            </div>

            <div className="desktop-nav" style={{ alignItems: 'center', gap: 32 }}>
              {['Works', 'Process', 'Agency'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
              ))}
              <a href="#contact" className="glass-btn" style={{
                marginLeft: 16, padding: '10px 24px', borderRadius: 30, color: '#fff',
                fontSize: 14, fontWeight: 500, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)'
              }}>
                Start Project
              </a>
            </div>

            <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
              <Layers size={24} color="#fff" />
            </button>
          </div>

          {/* Mobile Menu Expansion */}
          {mobileMenu && (
            <div style={{ position: 'fixed', top: 80, left: 24, right: 24, background: 'rgba(15,15,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 20, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Works', 'Process', 'Agency', 'Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileMenu(false)} style={{ color: '#fff', textDecoration: 'none', fontSize: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: 10 }}>{l}</a>
              ))}
            </div>
          )}
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 100, paddingBottom: 60 }}>
          <div className="section-container grid-2 hero-grid" style={{ alignItems: 'center' }}>

            <div style={{ zIndex: 2 }}>
              <div className="fade-up-1" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#fff', fontWeight: 600, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)',
                padding: '8px 20px', borderRadius: 40, marginBottom: 40, backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 15px #3b82f6', animation: 'liquidAura 2s infinite' }} />
                Premium Digital Studio
              </div>

              <h1 className="fade-up-2" style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(44px, 7vw, 92px)', fontWeight: 300,
                lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: 30
              }}>
                Architecting <br />
                <span style={{ fontWeight: 600, background: 'linear-gradient(135deg, #fff 0%, #52525b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  fluid reality.
                </span>
              </h1>

              <p className="fade-up-3" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 520, marginBottom: 48, fontWeight: 300 }}>
                We are <strong style={{ color: '#fff', fontWeight: 500 }}>OnT Sols</strong> — an elite agency engineering high-performance platforms and bespoke web environments for industry leaders worldwide.
              </p>

              <div className="fade-up-4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <a href="#works" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#000',
                  padding: '18px 36px', borderRadius: 12, fontSize: 15, fontWeight: 600, textDecoration: 'none',
                  transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(255,255,255,0.15)'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  Explore Portfolio <ArrowUpRight size={18} />
                </a>
                <a href="#process" className="glass-btn" style={{
                  display: 'inline-flex', alignItems: 'center', color: '#fff', padding: '18px 36px',
                  borderRadius: 12, fontSize: 15, fontWeight: 500, textDecoration: 'none',
                }}>
                  <PlayCircle size={18} style={{ marginRight: 8 }} /> Our Process
                </a>
              </div>
            </div>

            {/* Right: Realistic 3D Stats Card */}
            <div className="fade-up-4" style={{ position: 'relative' }}>
              <TiltCard style={{
                background: 'rgba(20, 20, 25, 0.4)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 24, padding: 'clamp(24px, 4vw, 48px)', backdropFilter: 'blur(40px) saturate(150%)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 40 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Globe size={26} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>Global Scale</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Operating across 14+ regions</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                  {[
                    ['Live Platforms', '40+', '#3b82f6'],
                    ['Client Retention', '99%', '#10b981'],
                    ['Global Brands', '25+', '#f59e0b'],
                    ['Years Active', '7+', '#8b5cf6']
                  ].map(([l, v, c]) => (
                    <div key={l}>
                      <div style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 600, color: '#fff', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', marginBottom: 4 }}>{v}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} /> {l}
                      </div>
                    </div>
                  ))}
                </div>
              </TiltCard>
            </div>

          </div>
        </section>

        {/* ── PROCESS SECTION ──────────────────────────────────────────── */}
        <section id="process" style={{ padding: '100px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(to bottom, rgba(10,10,12,0.8), transparent)' }}>
          <div className="section-container">
            <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#10b981', marginBottom: 20, fontWeight: 600 }}>Methodology</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 400, color: '#fff', marginBottom: 60, letterSpacing: '-0.02em', maxWidth: 600 }}>
              We don't guess. <br /><span style={{ color: 'rgba(255,255,255,0.4)' }}>We engineer execution.</span>
            </h2>

            <div className="grid-3">
              {[
                { step: '01', title: 'Discovery & Strategy', icon: <Fingerprint size={28} />, desc: 'Deep-dive analysis of market fit, user personas, and technical requirements before writing a single line of code.' },
                { step: '02', title: 'Architecture & UX', icon: <Layers size={28} />, desc: 'Crafting high-fidelity prototypes and defining scalable infrastructure that supports long-term growth.' },
                { step: '03', title: 'Full-Stack Delivery', icon: <Activity size={28} />, desc: 'Rigorous engineering utilizing React, Next.js, and headless backends with uncompromising performance standards.' }
              ].map((item, i) => (
                <div key={i} className="glass-btn" style={{ padding: '40px', borderRadius: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                    <div style={{ color: '#fff', padding: 12, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)' }}>{item.icon}</div>
                    <div style={{ fontSize: 32, fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.1)' }}>{item.step}</div>
                  </div>
                  <h3 style={{ fontSize: 20, color: '#fff', fontFamily: "'Outfit', sans-serif", marginBottom: 12, fontWeight: 500 }}>{item.title}</h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WORKS ────────────────────────────────────────────────────── */}
        <section id="works" style={{ padding: '60px 0 120px' }}>
          <div className="section-container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 60 }}>
              <div>
                <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#3b82f6', marginBottom: 20, fontWeight: 600 }}>Selected Work</div>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Our latest deployments.
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 40, border: '1px solid rgba(255,255,255,0.05)' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{
                    padding: '12px 24px', borderRadius: 30,
                    background: activeCategory === c.id ? '#fff' : 'transparent',
                    color: activeCategory === c.id ? '#000' : 'rgba(255,255,255,0.6)',
                    border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s ease',
                  }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))', gap: 32 }}>
              {filtered.map((site, i) => (
                <div key={site.url} style={{ animation: `fadeUp 0.8s ease backwards ${(i * 0.1)}s` }}>
                  <SiteCard site={site} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ABOUT AGENCY ─────────────────────────────────────────────── */}
        <section id="agency" style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, padding: '120px 0' }}>
          <div className="section-container grid-2" style={{ alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8b5cf6', marginBottom: 20, fontWeight: 600 }}>The Agency</div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 30 }}>
                Driven by perfection. <br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>Backed by data.</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 20, fontWeight: 300 }}>
                OnT Sols was founded with a singular mission: to eliminate mediocre web experiences. We combine enterprise-grade engineering with cutting-edge visual design to create platforms that dominate their respective markets.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 40 }}>
                {['React.js', 'Node.js', 'Next.js', 'TypeScript', 'WebGL', 'PostgreSQL', 'Cloudflare'].map(s => (
                  <span key={s} style={{ padding: '10px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 14, color: '#fff', fontFamily: "'Outfit',sans-serif" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid-2" style={{ gap: 20 }}>
              {[['Founded', '2019'], ['Core Team', '12+ Experts'], ['Tech Stack', 'Modern JS'], ['Uptime', '99.9%']].map(([l, n]) => (
                <div key={l} className="glass-btn" style={{ padding: '40px 30px', borderRadius: 20 }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 36, fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', marginBottom: 12 }}>{n}</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section id="contact" style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, padding: '120px 0' }}>
          <div className="section-container grid-2" style={{ gap: 80 }}>
            <div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(44px, 6vw, 72px)', fontWeight: 400, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 30 }}>
                Ready to scale? <br />Let's talk.
              </h2>
              <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 60, fontWeight: 300, maxWidth: 450 }}>
                Partner with us to build digital products that completely outperform your competition.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {[
                  { icon: <Mail size={20} />, label: 'Inquiries', val: 'hello@ontsols.com' },
                  { icon: <Phone size={20} />, label: 'Global Line', val: '+1 (647) 558-5637' },
                  { icon: <MapPin size={20} />, label: 'Headquarters', val: 'New York / Remote Worldwide' },
                ].map(({ icon, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 600 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 500, color: '#fff', fontFamily: "'Outfit',sans-serif" }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TiltCard style={{ background: 'rgba(15, 15, 20, 0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 'clamp(30px, 5vw, 56px)', backdropFilter: 'blur(30px)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
                  <input placeholder="First Name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: 14, color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <input placeholder="Last Name" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: 14, color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                </div>
                <input placeholder="Company / Organization" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: 14, color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                <input placeholder="Email Address" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: 14, color: '#fff', outline: 'none', fontSize: 15, transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                <textarea rows={5} placeholder="Tell us about your project..." style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px', borderRadius: 14, color: '#fff', outline: 'none', fontSize: 15, resize: 'none', transition: 'border 0.3s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />

                <button style={{
                  background: '#fff', color: '#000', padding: '20px', borderRadius: 14,
                  fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
                  transition: 'transform 0.2s', marginTop: 10
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  Submit Request →
                </button>
              </div>
            </TiltCard>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, padding: '60px 0', background: '#000' }}>
          <div className="section-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 30 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 12, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>OT</div>
              <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>© 2024 OnT Sols. All Rights Reserved.</span>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ i: <Linkedin size={20} />, l: 'LinkedIn' }, { i: <Twitter size={20} />, l: 'Twitter' }, { i: <Github size={20} />, l: 'GitHub' }].map((item, i) => (
                <a key={i} href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                  {item.i}
                </a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}