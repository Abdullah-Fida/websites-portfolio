import React, { useState, useEffect, useRef } from 'react';
import {
  Globe, ExternalLink, Mail, Phone, MapPin,
  Linkedin, Github, Twitter, Code, Smartphone,
  Zap, Users, Star, ArrowUpRight,
} from 'lucide-react';

// ── Screenshot API ────────────────────────────────────────────────────────
const screenshotUrl = (url) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

const categoryMeta = {
  job:       { label: 'Job Portal',  accent: '#60a5fa' },
  nonprofit: { label: 'Non-Profit',  accent: '#34d399' },
  health:    { label: 'Healthcare',  accent: '#c084fc' },
  other:     { label: 'Business',    accent: '#fb923c' },
};

const websites = {
  jobPortals: [
    { name: 'Accountant Hire',    url: 'https://accountanthire.com',       category: 'job',       description: 'Specialized accounting jobs' },
    { name: 'Deep Dive Hire',     url: 'https://deepdivehire.com',         category: 'job',       description: 'Tech recruitment platform' },
    { name: 'Keyway Solutions',   url: 'https://keywaysolutions.com',      category: 'job',       description: 'IT recruitment agency' },
    { name: 'Capstone Recruiter', url: 'https://capstonerecruiter.com',    category: 'job',       description: 'Graduate recruitment' },
    { name: 'Simrec',             url: 'https://simrec.net',               category: 'job',       description: 'Recruitment software' },
    { name: 'DaBoss Consultants', url: 'https://dabossconsultants.com',    category: 'job',       description: 'Executive search firm' },
  ],
  nonProfit: [
    { name: 'Tulsa Nonprofit',    url: 'https://tulsanonprofit.org',       category: 'nonprofit', description: 'Community support platform' },
    { name: 'Fund It Showit',     url: 'https://funditshowit.com',         category: 'nonprofit', description: 'Creative fundraising' },
    { name: 'Sponsor Funded',     url: 'https://sponsorfunded.com',        category: 'nonprofit', description: 'Sponsorship platform' },
    { name: 'Fund Starters',      url: 'https://fundstarters.com',        category: 'nonprofit', description: 'Crowdfunding for startups' },
    { name: 'NIAPNY',             url: 'https://niapny.org',               category: 'nonprofit', description: 'Arts organization' },
    { name: 'ESL On The Go',      url: 'https://eslonthego.org',           category: 'nonprofit', description: 'Language education' },
    { name: 'Have Support',       url: 'https://havesupport.org',          category: 'nonprofit', description: 'Peer support network' },
  ],
  healthCare: [
    { name: 'Prestigious Home Health', url: 'https://prestigioushomehealth.com', category: 'health', description: 'Elderly care services' },
  ],
  other: [
    { name: 'Geo Solutions',         url: 'https://geosolutionspk.com',     category: 'other', description: 'Geospatial solutions' },
    { name: 'A New View Properties', url: 'https://anewviewproperties.com', category: 'other', description: 'Real estate agency' },
    { name: 'Zuid 55',               url: 'https://zuid55.com',             category: 'other', description: 'Commercial real estate' },
    { name: 'Ikonnect Services',     url: 'https://ikonnectservice.com',    category: 'other', description: 'IT services' },
    { name: 'Upgrade BDC',           url: 'https://upgradebdc.com',         category: 'other', description: 'Business development' },
  ],
};
const allWebsites = [
  ...websites.jobPortals,
  ...websites.nonProfit,
  ...websites.healthCare,
  ...websites.other,
];

// ── Star Canvas with mouse particles ─────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = document.documentElement.scrollHeight);
    const mouse = { x: -9999, y: -9999 };
    const particles = [];

    // Static background stars
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.007 + 0.002,
    }));

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = document.documentElement.scrollHeight;
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY + window.scrollY;
      for (let i = 0; i < 4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: Math.random() * 1.6 + 0.4,
          alpha: 0.9 + Math.random() * 0.1,
          decay: Math.random() * 0.016 + 0.01,
          hue: 220 + Math.random() * 70,
          sat: 60 + Math.random() * 30,
        });
        if (particles.length > 400) particles.splice(0, particles.length - 400);
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);

    let t = 0;
    let raf;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        const tw = Math.sin(t * s.twinkleSpeed * 60 + s.twinkle) * 0.28 + 0.72;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha * tw})`;
        ctx.fill();
      }

      // Mouse glow
      if (mouse.x > 0) {
        const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 130);
        grd.addColorStop(0, 'rgba(110,80,255,0.14)');
        grd.addColorStop(0.5, 'rgba(80,100,255,0.05)');
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.alpha -= p.decay;
        if (p.alpha <= 0.01) { particles.splice(i, 1); continue; }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `hsla(${p.hue},${p.sat}%,88%,${p.alpha})`);
        g.addColorStop(1, `hsla(${p.hue},${p.sat}%,70%,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

// ── Cycling headline word ─────────────────────────────────────────────────
function CycleWord({ words }) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => {
      setShow(false);
      setTimeout(() => { setI(x => (x + 1) % words.length); setShow(true); }, 380);
    }, 2600);
    return () => clearInterval(iv);
  }, [words.length]);
  return (
    <span style={{
      color: '#a78bfa',
      fontStyle: 'italic',
      display: 'inline-block',
      opacity: show ? 1 : 0,
      transform: show ? 'translateY(0)' : 'translateY(10px)',
      transition: 'opacity .34s ease, transform .34s ease',
    }}>{words[i]}</span>
  );
}

// ── Site Card ─────────────────────────────────────────────────────────────
function SiteCard({ site }) {
  const [src, setSrc]       = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError]   = useState(false);
  const meta = categoryMeta[site.category];
  const host = site.url.replace(/^https?:\/\//, '');

  useEffect(() => {
    setSrc(screenshotUrl(site.url));
    setLoaded(false);
    setError(false);
  }, [site.url]);

  const border = 'rgba(255,255,255,0.07)';

  return (
    <a href={site.url} target="_blank" rel="noopener noreferrer"
      style={{
        display: 'flex', flexDirection: 'column',
        background: 'rgba(8,6,22,0.72)',
        border: `1px solid ${border}`,
        borderRadius: 16, overflow: 'hidden',
        textDecoration: 'none',
        backdropFilter: 'blur(14px)',
        transition: 'transform .26s ease, box-shadow .26s ease, border-color .26s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 28px 64px rgba(0,0,0,.75), 0 0 32px ${meta.accent}28`;
        e.currentTarget.style.borderColor = meta.accent + '55';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = border;
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '58%', background: '#06051a', overflow: 'hidden' }}>
        {!loaded && !error && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg,#0b0920 25%,#131130 50%,#0b0920 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
          }} />
        )}
        {error && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: `radial-gradient(ellipse, ${meta.accent}18 0%, #06051a 70%)`,
          }}>
            <Globe size={28} color={meta.accent} style={{ opacity: .7 }} />
            <span style={{ fontSize: 10, color: meta.accent, opacity: .65, fontFamily: 'monospace' }}>{host}</span>
          </div>
        )}
        {src && (
          <img src={src} alt={site.name}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', opacity: loaded ? 1 : 0,
              transition: 'opacity .5s ease',
            }}
          />
        )}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          background: 'linear-gradient(to top, rgba(6,5,26,.85), transparent)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: meta.accent + 'dd', color: '#fff',
          fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
          padding: '3px 10px', borderRadius: 20,
        }}>{meta.label}</div>
        <div style={{
          position: 'absolute', top: 10, right: 10,
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(8px)',
          borderRadius: 20, padding: '3px 9px',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'livePulse 2s infinite' }} />
          <span style={{ color: '#fff', fontSize: 9, fontWeight: 600 }}>LIVE</span>
        </div>
      </div>
      <div style={{ padding: '14px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e8e6ff', fontFamily: "'DM Sans',sans-serif" }}>{site.name}</span>
          <ExternalLink size={12} color='rgba(255,255,255,.28)' />
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.28)', fontFamily: 'monospace' }}>{host}</span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,.42)', marginTop: 2, lineHeight: 1.55 }}>{site.description}</span>
      </div>
    </a>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [activeCategory, setCategory] = useState('all');
  const [scrollY, setScrollY]         = useState(0);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const accent  = '#7c6cff';
  const border  = 'rgba(255,255,255,0.07)';
  const muted   = 'rgba(255,255,255,0.40)';
  const text    = '#e8e6ff';
  const surface = 'rgba(255,255,255,0.02)';

  const categories = [
    { id: 'all',       label: 'All',        count: allWebsites.length },
    { id: 'job',       label: 'Job Portals',count: websites.jobPortals.length },
    { id: 'nonprofit', label: 'Non-Profit', count: websites.nonProfit.length },
    { id: 'health',    label: 'Healthcare', count: websites.healthCare.length },
    { id: 'other',     label: 'Business',   count: websites.other.length },
  ];

  const filtered = activeCategory === 'all'
    ? allWebsites
    : allWebsites.filter(s => s.category === activeCategory);

  const navScrolled = scrollY > 40;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: #04030f; overflow-x: hidden; cursor: default; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes livePulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(1.5)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,-35px) scale(1.07)} 66%{transform:translate(-25px,45px) scale(.95)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(-45px,55px)} 70%{transform:translate(35px,-25px)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes rotateSlow{ from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .fu1{animation:fadeUp .8s ease both .08s} .fu2{animation:fadeUp .8s ease both .2s}
        .fu3{animation:fadeUp .8s ease both .34s} .fu4{animation:fadeUp .8s ease both .48s}
        .fu5{animation:fadeUp .8s ease both .62s} .fi{animation:fadeIn .55s ease both}
        ::selection{background:rgba(124,108,255,.38);color:#fff}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-track{background:#04030f}
        ::-webkit-scrollbar-thumb{background:rgba(124,108,255,.35);border-radius:3px}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,.2)}
        input,textarea{caret-color:#a78bfa}
      `}</style>

      {/* Deep space gradient backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 18% 40%, #0f0925 0%, #04030f 55%), radial-gradient(ellipse at 80% 80%, #050818 0%, transparent 60%)',
      }} />

      <StarCanvas />

      <div style={{ position: 'relative', zIndex: 1, color: text, minHeight: '100vh' }}>

        {/* ── NAV ─────────────────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
          background: navScrolled ? 'rgba(4,3,15,.88)' : 'transparent',
          borderBottom: navScrolled ? `1px solid ${border}` : '1px solid transparent',
          backdropFilter: navScrolled ? 'blur(22px)' : 'none',
          transition: 'all .35s ease',
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg,#7c6cff,#a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'DM Serif Display',serif", color: '#fff', fontSize: 18,
                boxShadow: '0 0 18px rgba(124,108,255,.45)',
              }}>T</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display',serif", color: '#e8e6ff', letterSpacing: '.01em' }}>Talha Ahmed</div>
                <div style={{ fontSize: 9, color: muted, letterSpacing: '.1em', textTransform: 'uppercase' }}>WordPress Developer</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
              {['Work','About','Contact'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  style={{ fontSize: 13, color: muted, textDecoration: 'none', fontWeight: 500, letterSpacing: '.03em', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = '#e8e6ff'}
                  onMouseLeave={e => e.target.style.color = muted}>{l}</a>
              ))}
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '0 28px' }}>
          {/* Ambient orbs */}
          <div style={{ position: 'absolute', top: '8%',  left: '3%',  width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,108,255,.13) 0%,transparent 68%)', animation: 'orbFloat1 20s ease-in-out infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,.09) 0%,transparent 68%)', animation: 'orbFloat2 25s ease-in-out infinite', pointerEvents: 'none' }} />

          {/* Decorative rings */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 760, height: 760, borderRadius: '50%', border: '1px solid rgba(124,108,255,.05)', animation: 'rotateSlow 55s linear infinite', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: 540, height: 540, borderRadius: '50%', border: '1px solid rgba(124,108,255,.04)', animation: 'rotateSlow 35s linear infinite reverse', pointerEvents: 'none', transform: 'translate(-50%,-50%)' }} />

          <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', paddingTop: 110, paddingBottom: 90, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

            {/* Left: headline */}
            <div>
              {/* Status pill */}
              <div className="fu1" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 10, letterSpacing: '.13em', textTransform: 'uppercase',
                color: '#34d399', fontWeight: 700,
                border: '1px solid rgba(52,211,153,.25)',
                background: 'rgba(52,211,153,.07)',
                padding: '6px 14px', borderRadius: 20, marginBottom: 32,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', display: 'inline-block', animation: 'livePulse 2.2s infinite' }} />
                Open to new projects
              </div>

              <h1 className="fu2" style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: 'clamp(40px,5.2vw,74px)',
                lineHeight: 1.06,
                fontWeight: 400,
                letterSpacing: '-.025em',
                marginBottom: 26,
              }}>
                Building digital<br />
                worlds with{' '}
                <CycleWord words={['precision.','purpose.','passion.','craft.']} />
              </h1>

              <p className="fu3" style={{ fontSize: 16, color: muted, lineHeight: 1.82, maxWidth: 450, marginBottom: 40 }}>
                WordPress developer · <strong style={{ color: text, fontWeight: 500 }}>5+ years</strong> delivering high-performance websites across job portals, healthcare, non-profits & businesses in{' '}
                <strong style={{ color: text, fontWeight: 500 }}>10+ countries</strong>.
              </p>

              <div className="fu4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
                <a href="#work" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg,#7c6cff,#a78bfa)',
                  backgroundSize: '200% 200%',
                  color: '#fff', padding: '13px 30px',
                  borderRadius: 12, fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 0 28px rgba(124,108,255,.4)',
                  transition: 'box-shadow .28s, transform .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 0 55px rgba(124,108,255,.65)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='0 0 28px rgba(124,108,255,.4)'; e.currentTarget.style.transform='none'; }}>
                  View my work <ArrowUpRight size={15} />
                </a>
                <a href="#contact" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,.03)',
                  border: `1px solid ${border}`,
                  color: text, padding: '13px 30px',
                  borderRadius: 12, fontSize: 13, fontWeight: 500,
                  textDecoration: 'none', backdropFilter: 'blur(10px)',
                  transition: 'border-color .25s, background .25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(124,108,255,.5)'; e.currentTarget.style.background='rgba(124,108,255,.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=border; e.currentTarget.style.background='rgba(255,255,255,.03)'; }}>
                  Get in touch
                </a>
              </div>

              {/* Stats */}
              <div className="fu5" style={{ display: 'flex', gap: 0 }}>
                {[['40+','Projects'],['35+','Clients'],['10+','Countries'],['5+','Years']].map(([n,l],i)=>(
                  <div key={l} style={{
                    paddingRight: 28, marginRight: 28,
                    borderRight: i < 3 ? `1px solid ${border}` : 'none',
                  }}>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: '#fff', letterSpacing: '-.02em' }}>{n}</div>
                    <div style={{ fontSize: 10, color: muted, letterSpacing: '.05em', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating card cluster */}
            <div className="fu3" style={{ position: 'relative', height: 440 }}>
              {/* Central glow */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,108,255,.18) 0%,transparent 70%)', pointerEvents: 'none' }} />

              {/* Main stats card */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 270,
                background: 'rgba(10,8,28,.9)',
                border: '1px solid rgba(124,108,255,.3)',
                borderRadius: 20, padding: 24,
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 80px rgba(0,0,0,.7), inset 0 1px 0 rgba(255,255,255,.06)',
                animation: 'floatY 5.5s ease-in-out infinite',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#7c6cff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(124,108,255,.4)' }}>
                    <Globe size={17} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e8e6ff' }}>40+ Live Websites</div>
                    <div style={{ fontSize: 10, color: muted }}>Worldwide clients</div>
                  </div>
                </div>
                {[
                  ['Job Portals', '#60a5fa', 80],
                  ['Non-Profit',  '#34d399', 66],
                  ['Healthcare',  '#c084fc', 30],
                  ['Business',    '#fb923c', 52],
                ].map(([l, c, w]) => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: muted }}>{l}</span>
                      <span style={{ fontSize: 10, color: c }}>{w}%</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,.07)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${w}%`, background: c, borderRadius: 3, boxShadow: `0 0 6px ${c}99` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Top-right float */}
              <div style={{
                position: 'absolute', top: 24, right: 0,
                background: 'rgba(10,8,28,.92)',
                border: '1px solid rgba(52,211,153,.22)',
                borderRadius: 14, padding: '10px 16px',
                backdropFilter: 'blur(18px)',
                animation: 'floatY 4.2s ease-in-out infinite .9s',
                boxShadow: '0 0 22px rgba(52,211,153,.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#34d399' }}>Available Now</span>
                </div>
              </div>

              {/* Bottom-left float */}
              <div style={{
                position: 'absolute', bottom: 24, left: 0,
                background: 'rgba(10,8,28,.92)',
                border: '1px solid rgba(251,146,60,.22)',
                borderRadius: 14, padding: '10px 16px',
                backdropFilter: 'blur(18px)',
                animation: 'floatY 6.3s ease-in-out infinite 1.8s',
                boxShadow: '0 0 22px rgba(251,146,60,.12)',
              }}>
                <div style={{ fontSize: 11, color: '#fb923c', fontWeight: 600, marginBottom: 2 }}>⭐ 5.0 Rating</div>
                <div style={{ fontSize: 9, color: muted }}>35+ client reviews</div>
              </div>

              {/* Top-left small float */}
              <div style={{
                position: 'absolute', top: 60, left: 0,
                background: 'rgba(10,8,28,.92)',
                border: '1px solid rgba(124,108,255,.2)',
                borderRadius: 14, padding: '10px 16px',
                backdropFilter: 'blur(18px)',
                animation: 'floatY 5s ease-in-out infinite 2.4s',
                boxShadow: '0 0 18px rgba(124,108,255,.1)',
              }}>
                <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600, marginBottom: 2 }}>🌍 10+ Countries</div>
                <div style={{ fontSize: 9, color: muted }}>Global reach</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES ─────────────────────────────────────────────────── */}
        <section style={{ borderTop: `1px solid ${border}`, padding: '72px 28px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
            {[
              { icon: <Globe size={20}/>,      title: 'Custom Dev',   desc: 'Bespoke WordPress solutions from scratch' },
              { icon: <Zap size={20}/>,        title: 'Performance',  desc: 'Optimized Core Web Vitals & lightning loads' },
              { icon: <Smartphone size={20}/>, title: 'Mobile First', desc: 'Pixel-perfect on every screen size' },
              { icon: <Code size={20}/>,       title: 'Clean Code',   desc: 'Maintainable, documented, standards-ready' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '34px 26px', background: surface,
                borderRight: i < 3 ? `1px solid ${border}` : 'none',
                transition: 'background .22s',
              }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(124,108,255,.07)'}
                onMouseLeave={e => e.currentTarget.style.background=surface}>
                <div style={{ color: accent, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 7, color: text }}>{s.title}</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PORTFOLIO ────────────────────────────────────────────────── */}
        <section id="work" style={{ padding: '0 28px 100px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 68, marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: muted, marginBottom: 10, fontWeight: 700 }}>Selected Work</div>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(28px,3.8vw,48px)', fontWeight: 400, letterSpacing: '-.02em', lineHeight: 1.1 }}>
                  {filtered.length} projects
                </h2>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} style={{
                    padding: '7px 15px', borderRadius: 8,
                    border: `1px solid ${activeCategory === c.id ? accent : border}`,
                    background: activeCategory === c.id ? 'rgba(124,108,255,.15)' : 'transparent',
                    color: activeCategory === c.id ? accent : muted,
                    fontSize: 12, fontWeight: 500, cursor: 'pointer',
                    transition: 'all .2s', fontFamily: "'DM Sans',sans-serif",
                  }}>
                    {c.label} <span style={{ opacity: .6, fontSize: 10 }}>{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
            {filtered.map((site, i) => (
              <div key={site.url} className="fi" style={{ animationDelay: `${i * 0.04}s` }}>
                <SiteCard site={site} />
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ────────────────────────────────────────────────────── */}
        <section id="about" style={{ borderTop: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: muted, marginBottom: 12, fontWeight: 700 }}>About</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(24px,3.2vw,40px)', fontWeight: 400, letterSpacing: '-.02em', lineHeight: 1.18, marginBottom: 22 }}>
                Building the web,<br /><em style={{ fontStyle: 'italic', color: muted }}>one site at a time.</em>
              </h2>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.85, marginBottom: 14 }}>I'm Talha Ahmed — a WordPress developer focused on fast, polished websites for businesses worldwide. Clean code, thoughtful design, results that move the needle.</p>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.85, marginBottom: 28 }}>From executive job portals to humanitarian aid platforms, every project gets the same level of craft.</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {['WordPress','PHP','JavaScript','React','Elementor','WooCommerce','SEO','UI/UX'].map(s => (
                  <span key={s} style={{ padding: '5px 11px', borderRadius: 6, border: `1px solid ${border}`, fontSize: 11, color: muted, fontFamily: "'JetBrains Mono',monospace", transition: 'border-color .2s, color .2s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor=accent+'77'; e.currentTarget.style.color=accent; }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor=border; e.currentTarget.style.color=muted; }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['40+','Websites built'],['35+','Happy clients'],['10+','Countries'],['5+','Years exp']].map(([n,l])=>(
                <div key={l} style={{ padding: 26, borderRadius: 14, border: `1px solid ${border}`, background: surface, transition: 'border-color .25s, background .25s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=accent+'55'; e.currentTarget.style.background='rgba(124,108,255,.06)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=border; e.currentTarget.style.background=surface; }}>
                  <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 38, color: '#fff', letterSpacing: '-.03em' }}>{n}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <section style={{ borderTop: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px' }}>
            <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: muted, marginBottom: 42, fontWeight: 700 }}>Client Feedback</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16 }}>
              {[
                { name:'John Smith',    role:'CEO, PrimePath Recruitment', text:'Talha delivered an exceptional job portal. Attention to detail that truly exceeded expectations.' },
                { name:'Sarah Johnson', role:'Director, Tulsa Nonprofit',  text:'Outstanding work on our charity site. The design perfectly captures our mission.' },
                { name:'Mike Chen',     role:'Owner, Divers Health',        text:'Professional, creative, and reliable. Our healthcare website has never looked better.' },
              ].map((t,i)=>(
                <div key={i} style={{ padding: 26, borderRadius: 14, border: `1px solid ${border}`, background: surface, backdropFilter: 'blur(10px)', transition: 'border-color .25s' }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=accent+'44'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=border}>
                  <div style={{ display:'flex', gap:3, marginBottom:14 }}>{[...Array(5)].map((_,j)=><Star key={j} size={11} fill='#f59e0b' color='#f59e0b'/>)}</div>
                  <p style={{ fontSize:13, color:muted, lineHeight:1.75, marginBottom:18 }}>"{t.text}"</p>
                  <div style={{ fontSize:13, fontWeight:600, color:text }}>{t.name}</div>
                  <div style={{ fontSize:10, color:muted, marginTop:3 }}>{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section id="contact" style={{ borderTop: `1px solid ${border}` }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: muted, marginBottom: 12, fontWeight: 700 }}>Contact</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(24px,3.2vw,40px)', fontWeight: 400, letterSpacing: '-.02em', lineHeight: 1.18, marginBottom: 22 }}>
                Let's build<br /><em style={{ fontStyle: 'italic', color: muted }}>something great.</em>
              </h2>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.8, marginBottom: 34 }}>Have a project in mind? I'd love to hear about it. Reach out and let's get started.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { icon:<Mail size={14}/>,   label:'Email',    val:'talha.ahmed@example.com' },
                  { icon:<Phone size={14}/>,  label:'Phone',    val:'+1 (555) 123-4567' },
                  { icon:<MapPin size={14}/>, label:'Location', val:'Remote / Worldwide' },
                ].map(({icon,label,val})=>(
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:34, height:34, borderRadius:9, border:`1px solid ${border}`, background:'rgba(124,108,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', color:accent }}>{icon}</div>
                    <div>
                      <div style={{ fontSize:9, color:muted, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:2 }}>{label}</div>
                      <div style={{ fontSize:13, fontWeight:500, color:text }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:'rgba(8,6,22,.75)', border:`1px solid ${border}`, borderRadius:16, padding:30, backdropFilter:'blur(18px)' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {['Your Name','Your Email','Project Type'].map(p=>(
                  <input key={p} placeholder={p} style={{
                    padding:'11px 14px', borderRadius:10,
                    border:`1px solid ${border}`,
                    background:'rgba(255,255,255,.03)', color:text,
                    fontSize:13, outline:'none',
                    fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s',
                  }}
                    onFocus={e=>e.target.style.borderColor=accent+'88'}
                    onBlur={e=>e.target.style.borderColor=border} />
                ))}
                <textarea rows={4} placeholder="Tell me about your project" style={{
                  padding:'11px 14px', borderRadius:10,
                  border:`1px solid ${border}`,
                  background:'rgba(255,255,255,.03)', color:text,
                  fontSize:13, outline:'none', resize:'none',
                  fontFamily:"'DM Sans',sans-serif", transition:'border-color .2s',
                }}
                  onFocus={e=>e.target.style.borderColor=accent+'88'}
                  onBlur={e=>e.target.style.borderColor=border} />
                <button style={{
                  padding:'13px', borderRadius:10,
                  background:'linear-gradient(135deg,#7c6cff,#a78bfa)',
                  color:'#fff', fontSize:13, fontWeight:600,
                  cursor:'pointer', border:'none',
                  fontFamily:"'DM Sans',sans-serif",
                  boxShadow:'0 0 22px rgba(124,108,255,.32)',
                  transition:'box-shadow .25s, transform .2s',
                }}
                  onMouseEnter={e=>{ e.target.style.boxShadow='0 0 44px rgba(124,108,255,.6)'; e.target.style.transform='translateY(-1px)'; }}
                  onMouseLeave={e=>{ e.target.style.boxShadow='0 0 22px rgba(124,108,255,.32)'; e.target.style.transform='none'; }}>
                  Send message →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer style={{ borderTop:`1px solid ${border}`, maxWidth:1100, margin:'0 auto', padding:'22px 28px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:14 }}>
            <span style={{ fontSize:11, color:muted }}>© 2024 Talha Ahmed · All rights reserved.</span>
            <div style={{ display:'flex', gap:20 }}>
              {[<Linkedin size={14}/>, <Github size={14}/>, <Twitter size={14}/>].map((icon,i)=>(
                <a key={i} href="#" style={{ color:muted, textDecoration:'none', transition:'color .2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='#e8e6ff'}
                  onMouseLeave={e=>e.currentTarget.style.color=muted}>{icon}</a>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}