import React, { useEffect, useState, useRef } from "react";

/*
  WeddingCountdown.jsx — Improved: allow changing date quickly via URL query or by editing the constant.
  - Primary source (in order): URL param `date` (ISO), EVENT_DATE_ISO constant
  - Also supports optional URL param `name` to override EVENT_NAME for quick testing
  - HMR-friendly: component updates when URL changes (you may need to refresh the preview in some environments)
*/

// --- Edit these two values to your real event (or supply ?date= and ?name= in the URL) ----------------
const EVENT_NAME = "Rutvik ❤️ Kinjal";
const EVENT_DATE_ISO = "2026-02-08T00:00:00"; // YYYY-MM-DDTHH:MM:SS
// ----------------------------------------------------------------------------------------------------

const SAMPLE_BG = "/DSC_4401.JPG"; // decorative placeholder image

// Helper: calculate time left safely
function calcTimeLeft(dateStr) {
  const now = new Date();
  const target = new Date(dateStr);
  if (isNaN(target)) return { total: NaN };
  const diff = target - now;
  if (diff <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function WeddingCountdown() {
  // Allow quick overrides from URL query string: ?date=2026-02-14T18:00:00&name=Demo
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams('');
  const urlDate = params.get('date');
  const urlName = params.get('name');
  const effectiveDate = urlDate || EVENT_DATE_ISO;
  const effectiveName = urlName || EVENT_NAME;

  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(effectiveDate));
  const intervalRef = useRef(null);

  useEffect(() => {
    // if date invalid, do nothing to avoid errors
    if (isNaN(new Date(effectiveDate))) {
      setTimeLeft({ total: NaN });
      return;
    }

    // update immediately then start interval
    setTimeLeft(calcTimeLeft(effectiveDate));
    intervalRef.current = setInterval(() => setTimeLeft(calcTimeLeft(effectiveDate)), 1000);
    return () => clearInterval(intervalRef.current);
  }, [effectiveDate]); // re-run effect when effectiveDate changes (supports URL changes with a refresh)

  const reached = timeLeft && timeLeft.total === 0;

  return (
    <div className="wc-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Great+Vibes&display=swap');

        :root{ --rose-50:#fff1f2; --amber-50:#fffbeb; --rose-800:#9f1239; }
        *{box-sizing:border-box}
        html,body,#root{height:100%;}
        body{margin:0}

        .wc-page{ min-height:100vh; width:100vw; display:flex; align-items:center; justify-content:center; padding:0; overflow:hidden; background:none; }
        .wc-stage{ position:relative; width:100%; max-width:none; display:flex; align-items:flex-end; justify-content:center; padding:18px 24px; height:100vh; }

        .wc-photo-panel{ position:fixed; left:0; top:0; width:100vw; height:100vh; border-radius:0; overflow:hidden; box-shadow:none; z-index:0; }
        .wc-photo-panel img{ width:100%; height:100%; object-fit:cover; object-position:center; content: url("/rk_3.jpg"); filter:blur(0px) saturate(1); opacity:1; transform:scale(1.02); }
        /* Mobile portrait image */
        @media (max-width: 768px) {.wc-photo-panel img {content: url("/rk_1.jpg"); object-position: center top; /* optional */}}

        .wc-card{ position:relative; z-index:10; width:100%; max-width:760px; background:rgba(255,255,255,0.95); backdrop-filter:blur(6px); border-radius:20px; padding:28px; box-shadow:0 10px 28px rgba(2,6,23,0.08); border:1px solid rgba(248,113,113,0.05); }

        .wc-title{
  font-family:'Great Vibes', cursive;
  line-height: 1.25;
  font-size:62px;
  font-weight:400; /* Great Vibes supports only 400 */
  text-align:center;
  margin:12px 0 10px;
  background: linear-gradient(90deg, #B54A5B, #A23545, #932233, #6F1421);
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing:1.2px;
  /* Medium Bold effect */
  text-shadow:
    0 2px 3px rgba(0,0,0,0.25),
    0 0 4px rgba(0,0,0,0.10);
}
        .wc-subtitle{ font-family:'Cormorant Garamond', serif; font-style:italic; color:#932233; text-align:center; margin:0 0 0; font-size:22px; font-weight:300; }
        .wc-date{ text-align:center; font-size:13px; color:#8a4b1f; margin-top:1px; }

        .wc-grid{ display:grid; grid-template-columns: repeat(4, 1fr); gap:18px; margin-top:28px; }
        .wc-time-card{ background:rgba(255,255,255,0.90); border-radius:14px; padding:22px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px solid rgba(250,204,210,0.35); box-shadow:0 8px 20px rgba(15,23,42,0.04); }

        .wc-number{ font-family:'Playfair Display', serif; font-size:44px; font-weight:800; color:#932233; line-height:1; letter-spacing:-0.6px; text-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .wc-label{ margin-top:10px; font-family:'Cormorant Garamond', serif; font-size:15px; color:#7b394a; font-style:italic; }

        .wc-celebrate{ margin-top:22px; padding:14px; border-radius:12px; background:#fff6f7; text-align:center; border:1px solid #fde2e8; }

        @media (max-width:880px){ 
          .wc-grid{ grid-template-columns: repeat(2, 1fr); gap:14px; } 
          .wc-title{ font-size:36px; line-height:1.15; } 
          .wc-number{ font-size:34px } 
        }

        /* Mobile-specific improvements */
        @media (max-width:768px){
  .wc-stage { align-items:flex-end; padding:18px 12px 20px; }
  .wc-card { width:calc(100% - 20px); padding:10px; border-radius:12px; }
  .wc-title { font-size:47px; }
  .wc-date strong { font-size:40px !important; }
  .wc-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
  .wc-time-card { padding:10px; }
  .wc-number { font-size:32px; }
}
          .wc-card{ width: calc(100% - 10px); max-width:760px; max-height: calc(100vh - env(safe-area-inset-top, 16px) - env(safe-area-inset-bottom, 16px) - 28px); margin: 0 auto; padding:5px; border-radius:10px; overflow: hidden; transform: translateY(0);}
          .wc-title{ font-size:47px; margin-top:6px; line-height: 1.25; }
          .wc-date strong{ font-size:40px !important; }
          .wc-grid{ grid-template-columns: repeat(4, 1fr); gap:5px; margin-top:5px; }
          .wc-time-card{ padding:5px; border-radius:12px; }
          .wc-number{ font-size:32px }
          .wc-photo-panel img{ object-position: center top; filter: blur(0px) saturate(1); transform:scale(1); }
        } .wc-title{ font-size:32px; } .wc-number{ font-size:35px } }
      `}</style>

      <div className="wc-stage" role="main">
        <div className="wc-photo-panel" aria-hidden>
          <img src={SAMPLE_BG} alt="decorative wedding" />
        </div>

        <div className="wc-card" role="region" aria-label="Countdown card" style={{ position:'relative' }}>
          <header style={{ textAlign: "center", marginTop: 10 }}>
            <h1 className="wc-title">{effectiveName}</h1>
            <p className="wc-subtitle">Counting down to our big day</p>
            <div className="wc-date">
            <strong style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 48,
                fontStyle: 'italic',
                fontWeight: 501,
                background: 'linear-gradient(90deg,#FFD700,#F6C400,#E6A400,#D99200)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 2px 6px rgba(0,0,0,0.1)',
                letterSpacing: '0.6px'
            }}>
                {(() => {
                const d = new Date(effectiveDate);
                return `${("0"+d.getDate()).slice(-2)}/${("0"+(d.getMonth()+1)).slice(-2)}/${d.getFullYear()}`;
                })()}
            </strong>
            </div>
          </header>

          <main>
            <div className="wc-grid" aria-live="polite">
              <TimeCard label="Days" value={timeLeft && timeLeft.days} />
              <TimeCard label="Hours" value={timeLeft && timeLeft.hours} />
              <TimeCard label="Minutes" value={timeLeft && timeLeft.minutes} />
              <TimeCard label="Seconds" value={timeLeft && timeLeft.seconds} />
            </div>

            {reached && (
              <div className="wc-celebrate">
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize:20, color:'#9f1239', fontWeight:700 }}> The day is here — We are getting married today ❤️ ❤️</div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function TimeCard({ label, value }) {
  return (
    <div className="wc-time-card" role="group" aria-label={label}>
      <div className="wc-number">{value === undefined || isNaN(value) ? "--" : value}</div>
      <div className="wc-label">{label}</div>
    </div>
  );
}

function FloralHeader() {
  // kept for backward compatibility — returns a small elegant divider
  return (
    <svg width="260" height="24" viewBox="0 0 520 24" fill="none" aria-hidden>
      <path d="M20 12 C120 0, 400 24, 500 12" stroke="#FECACA" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}
