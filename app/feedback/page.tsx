'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import sayoLogo from '../../public/sayologo.png';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const tokens = {
  color: {
    gold:        '#B8860B',
    goldLight:   'rgba(184,134,11,0.15)',
    bgDark:      '#040405',
    white:       '#ffffff',
    whiteMuted:  'rgba(255,255,255,0.80)',
    whiteDim:    'rgba(255,255,255,0.70)',
    whiteFaint:  'rgba(255,255,255,0.35)',
    whiteBorder: 'rgba(255,255,255,0.10)',
  },
  font: {
    family:    'Inter, sans-serif',
    heroTitle: 'clamp(2rem, 4.5vw, 4rem)',
    heroSub:   'clamp(0.9rem, 1.6vw, 1.4rem)',
    logoText:  'clamp(1.125rem, 1.5vw, 1.375rem)',
  },
  layout: {
    inner: '86rem',
  },
} as const;

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const LOCATIONS = ['Colombo', 'Negombo', 'Kiribathgoda'] as const;

const SERVICES = [
  'Bridal Package',
  'Groom Package',
  'Hair & Grooming',
  'Gold Facial',
  'Skin Brightening',
  'Deep Tissue Massage',
  'Aromatherapy Massage',
  'Gel Manicure & Pedicure',
  'Full Body Wax',
  'Other',
] as const;

/* ─────────────────────────────────────────
   FORM TYPES
───────────────────────────────────────── */
type FormData = {
  name:     string;
  email:    string;
  location: string;
  service:  string;
  rating:   number;
  comment:  string;
  consent:  boolean;
};

type FormErrors  = Partial<Record<keyof FormData, string>>;
type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/* ─────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────── */
const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #040405; }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  @keyframes pulseGold {
    0%, 100% { box-shadow: 0 0 0 0 rgba(184,134,11,0.4); }
    50%      { box-shadow: 0 0 0 10px rgba(184,134,11,0); }
  }
  @keyframes successPop {
    0%   { opacity: 0; transform: scale(0.85) translateY(20px); }
    70%  { transform: scale(1.03) translateY(-4px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmerGold {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  @keyframes starPop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.4); }
    100% { transform: scale(1); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .logo-float { animation: floatY 4s ease-in-out 1.5s infinite; }

  /* ── Form inputs ── */
  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.12);
    border-radius: 0.75rem;
    padding: 0.875rem 1.125rem;
    color: #ffffff;
    font-family: Inter, sans-serif;
    font-size: clamp(0.875rem, 1.2vw, 1rem);
    font-weight: 400;
    outline: none;
    transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
    resize: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .form-input::placeholder { color: rgba(255,255,255,0.3); }
  .form-input:hover {
    border-color: rgba(184,134,11,0.35);
    background: rgba(255,255,255,0.07);
  }
  .form-input:focus {
    border-color: rgba(184,134,11,0.7);
    background: rgba(184,134,11,0.06);
    box-shadow: 0 0 0 3px rgba(184,134,11,0.12);
  }
  .form-input-error {
    border-color: rgba(220,60,60,0.7) !important;
    box-shadow: 0 0 0 3px rgba(220,60,60,0.1) !important;
  }
  .form-input option { background: #1a1a1a; color: #fff; }

  /* ── Star buttons ── */
  .star-btn {
    background: none; border: none; cursor: pointer;
    padding: 2px; line-height: 0;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  .star-btn:hover { transform: scale(1.2); }
  .star-btn.selected { animation: starPop 0.3s cubic-bezier(0.34,1.56,0.64,1); }

  /* ── Submit button ── */
  .submit-btn {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #B8860B, #d4a017);
    border: none; border-radius: 0.75rem;
    color: #fff; font-family: Inter, sans-serif;
    font-size: clamp(0.9rem, 1.3vw, 1.05rem);
    font-weight: 600; letter-spacing: 0.08em;
    padding: 1rem 2.5rem; cursor: pointer; width: 100%;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s;
  }
  .submit-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    background-size: 400px 100%;
    animation: shimmerGold 2.5s infinite;
  }
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 12px 35px rgba(184,134,11,0.45);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0) scale(0.99); }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── Checkbox ── */
  .custom-checkbox {
    width: 20px; height: 20px; border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.05);
    cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s;
  }
  .custom-checkbox.checked { background: #B8860B; border-color: #B8860B; }

  /* ── Cards ── */
  .success-card { animation: successPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }

  .form-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 1.5rem;
    padding: clamp(1.75rem, 4vw, 3rem);
    backdrop-filter: blur(12px);
    transition: border-color 0.3s;
  }
  .form-card:focus-within { border-color: rgba(184,134,11,0.25); }

  /* ── Labels / errors ── */
  .field-label {
    color: rgba(255,255,255,0.75);
    font-size: 0.82rem; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    display: block; margin-bottom: 0.5rem;
  }
  .error-text {
    color: #e05555; font-size: 0.72rem; font-weight: 500;
    margin-top: 0.375rem;
    display: flex; align-items: center; gap: 0.3rem;
    animation: fadeIn 0.2s ease;
  }
  .char-count { font-size: 0.72rem; font-weight: 500; transition: color 0.2s; }

  /* ── Grid helpers ── */
  .form-row {
    display: grid; grid-template-columns: 1fr; gap: 1.25rem;
  }
  @media (min-width: 640px) {
    .form-row { grid-template-columns: 1fr 1fr; }
  }

  .info-cards-grid {
    display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1.5rem;
  }
  @media (min-width: 480px) {
    .info-cards-grid { grid-template-columns: repeat(3, 1fr); }
  }
`;

/* ─────────────────────────────────────────
   HOOK — in-view
───────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <Image
      src={sayoLogo} alt="SAYO Logo"
      width={56} height={56} className={className}
      style={{ width: 'clamp(2.5rem, 5vw, 3.5rem)', height: 'auto', objectFit: 'contain' }}
      priority
    />
  );
}

function StarIcon({ filled, size = 32 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? '#B8860B' : 'none'}
      stroke={filled ? '#B8860B' : 'rgba(255,255,255,0.25)'}
      strokeWidth={filled ? 0 : 1.5}
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconCheck({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconError({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function IconSend({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   RATING LABELS
───────────────────────────────────────── */
const RATING_LABELS: Record<number, string> = {
  1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent',
};

/* ─────────────────────────────────────────
   STAR RATING COMPONENT
───────────────────────────────────────── */
function StarRating({
  value, hovered, onChange, onHover, onLeave,
}: {
  value: number; hovered: number;
  onChange: (n: number) => void;
  onHover:  (n: number) => void;
  onLeave:  () => void;
}) {
  const display = hovered || value;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n} type="button"
          className={`star-btn${value === n ? ' selected' : ''}`}
          onClick={() => onChange(n)}
          onMouseEnter={() => onHover(n)}
          onMouseLeave={onLeave}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          <StarIcon filled={n <= display} size={32} />
        </button>
      ))}
      {display > 0 && (
        <span style={{
          color: tokens.color.gold, fontSize: '0.85rem',
          fontWeight: 600, marginLeft: '0.5rem',
          animation: 'fadeIn 0.2s ease',
        }}>
          {RATING_LABELS[display]}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   FIELD WRAP (moved to module scope — FIX)
───────────────────────────────────────── */
function FieldWrap({
  label, error, children, required = true,
}: {
  label: string; error?: string;
  children: React.ReactNode; required?: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label className="field-label">
        {label}
        {required && <span style={{ color: tokens.color.gold, marginLeft: '3px' }}>*</span>}
      </label>
      {children}
      {error && (
        <span className="error-text">
          <IconError size={12} />{error}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SUCCESS CARD
───────────────────────────────────────── */
function SuccessCard({ onReset }: { onReset: () => void }) {
  return (
    <div className="success-card" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      gap: '1.5rem',
      padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(184,134,11,0.3)',
      borderRadius: '1.5rem', backdropFilter: 'blur(12px)',
    }}>
      {/* Pulse circle */}
      <div style={{
        width: '88px', height: '88px', borderRadius: '50%',
        background: 'linear-gradient(135deg,rgba(184,134,11,0.25),rgba(184,134,11,0.08))',
        border: '2px solid rgba(184,134,11,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'pulseGold 2.5s ease infinite',
      }}>
        <div style={{ color: tokens.color.gold, display: 'flex' }}>
          <IconCheck size={40} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2 style={{
          color: tokens.color.white,
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 600, margin: 0,
        }}>
          Thank You for Your Feedback!
        </h2>
        <p style={{
          color: tokens.color.whiteMuted,
          fontSize: 'clamp(0.875rem, 1.4vw, 1rem)',
          lineHeight: 1.7, margin: 0, maxWidth: '420px',
        }}>
          Your review has been submitted successfully. We truly appreciate you
          taking the time to share your experience at SAYO.
        </p>
      </div>

      {/* Gold rule */}
      <div style={{
        width: '60px', height: '2px',
        background: 'linear-gradient(90deg, transparent, #B8860B, transparent)',
        borderRadius: '999px',
      }} />

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onReset}
          style={{
            background: 'rgba(184,134,11,0.15)',
            border: '1.5px solid rgba(184,134,11,0.4)',
            borderRadius: '0.75rem', color: tokens.color.gold,
            fontSize: '0.9rem', fontWeight: 600,
            padding: '0.75rem 1.75rem', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'background 0.25s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(184,134,11,0.25)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(184,134,11,0.15)'}
        >
          Submit Another Review
        </button>
        <a
          href="/reviews"
          style={{
            background: 'linear-gradient(135deg, #B8860B, #d4a017)',
            borderRadius: '0.75rem', color: '#fff',
            fontSize: '0.9rem', fontWeight: 600,
            padding: '0.75rem 1.75rem', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          View All Reviews
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DIVIDER
───────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 clamp(1rem,4vw,3.5rem)' }}>
      <div style={{
        width: '100%', maxWidth: tokens.layout.inner,
        height: '1px', background: 'rgba(255,255,255,0.12)',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────
   DROPDOWN ARROW STYLE (reused)
───────────────────────────────────────── */
const ARROW_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23B8860B' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
const dropdownStyle: React.CSSProperties = {
  backgroundImage:    ARROW_BG,
  backgroundRepeat:   'no-repeat',
  backgroundPosition: 'right 1rem center',
  paddingRight:       '2.5rem',
};

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function FeedbackPage() {
  const [loaded,       setLoaded]       = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [hoveredStar,  setHoveredStar]  = useState(0);

  const [form, setForm] = useState<FormData>({
    name: '', email: '', location: '',
    service: '', rating: 0, comment: '', consent: false,
  });
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});

  const MAX_COMMENT = 500;
  const { ref: formRef, inView: formVisible } = useInView(0.05);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  /* ── Validation ── */
  const validate = (data: FormData): FormErrors => {
    const e: FormErrors = {};
    if (!data.name.trim())
      e.name = 'Please enter your name.';
    if (!data.email.trim())
      e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      e.email = 'Please enter a valid email address.';
    if (!data.location)
      e.location = 'Please select a location.';
    if (!data.service)
      e.service = 'Please select a service.';
    if (data.rating === 0)
      e.rating = 'Please select a star rating.';
    if (!data.comment.trim())
      e.comment = 'Please share your experience.';
    else if (data.comment.trim().length < 20)
      e.comment = 'Please write at least 20 characters.';
    if (!data.consent)
      e.consent = 'You must agree to publish your review.';
    return e;
  };

  const handleChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      const errs = validate(updated);
      setErrors(prev => ({ ...prev, [key]: errs[key] }));
    }
  };

  const handleBlur = (key: keyof FormData) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    const errs = validate(form);
    setErrors(prev => ({ ...prev, [key]: errs[key] }));
  };

  /* ── Submit → real API call ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(form).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<keyof FormData, boolean>
    );
    setTouched(allTouched);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitStatus('submitting');

    try {
      const res = await fetch('/api/site-data?section=feedback', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cusName:     form.name,
          cusEmail:    form.email,
          cusLocation: form.location,
          cusService:  form.service,
          cusRating:   form.rating,
          cusComment:  form.comment,
          cusConsent:  form.consent,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData?.fields) {
          /* Map server field names back to form keys */
          const mapped: FormErrors = {};
          if (errData.fields.cusName)     mapped.name     = errData.fields.cusName;
          if (errData.fields.cusEmail)    mapped.email    = errData.fields.cusEmail;
          if (errData.fields.cusLocation) mapped.location = errData.fields.cusLocation;
          if (errData.fields.cusService)  mapped.service  = errData.fields.cusService;
          if (errData.fields.cusRating)   mapped.rating   = errData.fields.cusRating;
          if (errData.fields.cusComment)  mapped.comment  = errData.fields.cusComment;
          if (errData.fields.cusConsent)  mapped.consent  = errData.fields.cusConsent;
          setErrors(mapped);
        }
        setSubmitStatus('error');
        return;
      }

      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  const handleReset = () => {
    setForm({ name:'', email:'', location:'', service:'', rating:0, comment:'', consent:false });
    setErrors({});
    setTouched({});
    setSubmitStatus('idle');
  };

  /* ─────────────────────────────────────────
     RENDER
  ───────────────────────────────────────── */
  return (
    <>
      <style>{globalCss}</style>

      <main style={{
        minHeight: '100vh', backgroundColor: 'transparent',
        fontFamily: tokens.font.family, color: tokens.color.white,
        display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Fixed background ── */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Image
            src="/services-bg.jpg" alt="background"
            fill priority sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(270deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(0deg, rgba(4,4,5,0.75) 0%, rgba(4,4,5,0.3) 100%)',
          }} />
        </div>

        {/* ── Content ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column', flex: 1,
        }}>

          {/* ══════════ LOGO HEADER ══════════ */}
          <header style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '0.625rem',
            padding: 'clamp(2rem,4vw,3rem) clamp(1.25rem,5vw,4rem) clamp(1.25rem,2.5vw,2rem)',
            opacity:    loaded ? 1 : 0,
            transform:  loaded ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <LogoIcon className="logo-float" />
            <span style={{
              color: tokens.color.white,
              fontSize: tokens.font.logoText,
              fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}>
              SAYO
            </span>
          </header>

          <Divider />

          {/* ══════════ PAGE TITLE ══════════ */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center',
            padding: 'clamp(1.75rem,4vw,3rem) clamp(1.25rem,5vw,4rem) clamp(1.25rem,2.5vw,2rem)',
            gap: 'clamp(0.75rem,1.5vw,1.25rem)',
            opacity:    loaded ? 1 : 0,
            transform:  loaded ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            <p style={{
              color: tokens.color.gold, fontSize: '0.78rem',
              fontWeight: 600, letterSpacing: '0.28em',
              textTransform: 'uppercase', margin: 0,
            }}>
              Share Your Experience
            </p>

            <h1 style={{
              color: tokens.color.white,
              fontSize: tokens.font.heroTitle,
              fontWeight: 500, lineHeight: 1.2,
              maxWidth: '50rem', margin: 0,
              textShadow: '0 4px 40px rgba(0,0,0,0.4)',
            }}>
              We&apos;d Love to Hear{' '}
              <span style={{ color: tokens.color.gold }}>Your Thoughts</span>
            </h1>

            <p style={{
              color: tokens.color.whiteMuted,
              fontSize: tokens.font.heroSub,
              fontWeight: 400, lineHeight: 1.7,
              maxWidth: '42rem', margin: 0,
            }}>
              Your feedback helps us grow and serve you better. Take a moment
              to tell us about your SAYO experience.
            </p>
          </div>

          <Divider />

          {/* ══════════ FORM SECTION ══════════ */}
          <div
            ref={formRef}
            style={{
              flex: 1,
              padding: 'clamp(2rem,4vw,3.5rem) clamp(1.25rem,5vw,4rem) clamp(2.5rem,5vw,4rem)',
              opacity:    formVisible ? 1 : 0,
              transform:  formVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>

              {/* Success or Form */}
              {submitStatus === 'success' ? (
                <SuccessCard onReset={handleReset} />
              ) : (
                <div className="form-card">

                  {/* Card header */}
                  <div style={{
                    marginBottom: 'clamp(1.5rem,3vw,2.25rem)',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <h2 style={{
                      color: tokens.color.white,
                      fontSize: 'clamp(1.1rem,2vw,1.4rem)',
                      fontWeight: 600, margin: '0 0 0.4rem',
                    }}>
                      Leave a Review
                    </h2>
                    <p style={{
                      color: tokens.color.whiteFaint,
                      fontSize: '0.82rem', margin: 0, lineHeight: 1.6,
                    }}>
                      Fields marked with{' '}
                      <span style={{ color: tokens.color.gold }}>*</span>
                      {' '}are required.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>

                      {/* ── Row 1: Name + Email ── */}
                      <div className="form-row">
                        <FieldWrap label="Your Name" error={errors.name}>
                          <input
                            type="text"
                            className={`form-input${errors.name && touched.name ? ' form-input-error' : ''}`}
                            placeholder="e.g. Anika Perera"
                            value={form.name}
                            onChange={e => handleChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            autoComplete="name"
                          />
                        </FieldWrap>

                        <FieldWrap label="Email Address" error={errors.email}>
                          <input
                            type="email"
                            className={`form-input${errors.email && touched.email ? ' form-input-error' : ''}`}
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            autoComplete="email"
                          />
                        </FieldWrap>
                      </div>

                      {/* ── Row 2: Location + Service ── */}
                      <div className="form-row">
                        <FieldWrap label="Branch Location" error={errors.location}>
                          <select
                            className={`form-input${errors.location && touched.location ? ' form-input-error' : ''}`}
                            value={form.location}
                            onChange={e => handleChange('location', e.target.value)}
                            onBlur={() => handleBlur('location')}
                            style={dropdownStyle}
                          >
                            <option value="" disabled>Select a branch</option>
                            {LOCATIONS.map(loc => (
                              <option key={loc} value={loc}>{loc}</option>
                            ))}
                          </select>
                        </FieldWrap>

                        <FieldWrap label="Service Received" error={errors.service}>
                          <select
                            className={`form-input${errors.service && touched.service ? ' form-input-error' : ''}`}
                            value={form.service}
                            onChange={e => handleChange('service', e.target.value)}
                            onBlur={() => handleBlur('service')}
                            style={dropdownStyle}
                          >
                            <option value="" disabled>Select a service</option>
                            {SERVICES.map(svc => (
                              <option key={svc} value={svc}>{svc}</option>
                            ))}
                          </select>
                        </FieldWrap>
                      </div>

                      {/* ── Star Rating ── */}
                      <FieldWrap label="Your Rating" error={errors.rating}>
                        <div style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${errors.rating && touched.rating
                            ? 'rgba(220,60,60,0.7)' : 'rgba(255,255,255,0.10)'}`,
                          borderRadius: '0.75rem',
                          padding: '1rem 1.125rem',
                          transition: 'border-color 0.25s',
                        }}>
                          <StarRating
                            value={form.rating}
                            hovered={hoveredStar}
                            onChange={n => {
                              handleChange('rating', n);
                              setTouched(prev => ({ ...prev, rating: true }));
                            }}
                            onHover={setHoveredStar}
                            onLeave={() => setHoveredStar(0)}
                          />
                        </div>
                      </FieldWrap>

                      {/* ── Comment ── */}
                      <FieldWrap label="Your Review" error={errors.comment}>
                        <div style={{ position: 'relative' }}>
                          <textarea
                            className={`form-input${errors.comment && touched.comment ? ' form-input-error' : ''}`}
                            placeholder="Tell us about your experience — what did you love, what could we improve?"
                            value={form.comment}
                            onChange={e => {
                              if (e.target.value.length <= MAX_COMMENT)
                                handleChange('comment', e.target.value);
                            }}
                            onBlur={() => handleBlur('comment')}
                            rows={5}
                            style={{ paddingBottom: '2rem' }}
                          />
                          <div style={{ position: 'absolute', bottom: '0.625rem', right: '1rem' }}>
                            <span className="char-count" style={{
                              color: form.comment.length > MAX_COMMENT * 0.9
                                ? '#e05555' : tokens.color.whiteFaint,
                            }}>
                              {form.comment.length}/{MAX_COMMENT}
                            </span>
                          </div>
                        </div>
                      </FieldWrap>

                      {/* ── Consent ── */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div
                          style={{
                            display: 'flex', alignItems: 'flex-start',
                            gap: '0.75rem', cursor: 'pointer',
                          }}
                          onClick={() => {
                            handleChange('consent', !form.consent);
                            setTouched(prev => ({ ...prev, consent: true }));
                          }}
                        >
                          <div
                            className={`custom-checkbox${form.consent ? ' checked' : ''}`}
                            style={{
                              border: errors.consent && touched.consent
                                ? '1.5px solid rgba(220,60,60,0.7)' : undefined,
                            }}
                          >
                            {form.consent && (
                              <svg width="12" height="12" viewBox="0 0 24 24"
                                fill="none" stroke="#fff" strokeWidth="3">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            )}
                          </div>
                          <p style={{
                            color: tokens.color.whiteDim, fontSize: '0.82rem',
                            lineHeight: 1.6, margin: 0, userSelect: 'none',
                          }}>
                            I agree to have my review published on the SAYO website.
                            My name and experience may be displayed publicly.
                          </p>
                        </div>
                        {errors.consent && touched.consent && (
                          <span className="error-text" style={{ paddingLeft: '2rem' }}>
                            <IconError size={12} />{errors.consent}
                          </span>
                        )}
                      </div>

                      {/* ── Error banner ── */}
                      {submitStatus === 'error' && (
                        <div style={{
                          background: 'rgba(220,60,60,0.1)',
                          border: '1.5px solid rgba(220,60,60,0.35)',
                          borderRadius: '0.75rem',
                          padding: '1rem 1.25rem',
                          color: '#e07070', fontSize: '0.875rem',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          animation: 'fadeIn 0.3s ease',
                        }}>
                          <IconError size={16} />
                          Something went wrong. Please try again.
                        </div>
                      )}

                      {/* ── Submit button ── */}
                      <button
                        type="submit"
                        className="submit-btn"
                        disabled={submitStatus === 'submitting'}
                      >
                        {submitStatus === 'submitting' ? (
                          <span style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '0.625rem',
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="2.5"
                              style={{ animation: 'spin 0.8s linear infinite' }}
                            >
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                            Submitting…
                          </span>
                        ) : (
                          <span style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '0.625rem',
                          }}>
                            <IconSend size={18} />
                            Submit Review
                          </span>
                        )}
                      </button>

                      {/* Privacy note */}
                      <p style={{
                        color: tokens.color.whiteFaint, fontSize: '0.72rem',
                        textAlign: 'center', lineHeight: 1.6, margin: 0,
                      }}>
                        Your email address will never be published or shared with third parties.
                      </p>

                    </div>
                  </form>
                </div>
              )}

              {/* ── Info cards (always visible) ── */}
              <div className="info-cards-grid">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="#B8860B" strokeWidth="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ),
                    title: 'Safe & Private',
                    text:  'Your data is protected and never shared.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="#B8860B" strokeWidth="1.8">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    ),
                    title: 'Quick to Submit',
                    text:  'Takes less than 2 minutes to complete.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="#B8860B" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    ),
                    title: 'Helps Us Improve',
                    text:  'Every review shapes our service quality.',
                  },
                ].map(({ icon, title, text }) => (
                  <div key={title} style={{
                    background: 'rgba(184,134,11,0.06)',
                    border: '1px solid rgba(184,134,11,0.18)',
                    borderRadius: '1rem',
                    padding: '1.125rem 1.25rem',
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  }}>
                    <div style={{
                      width: '36px', height: '36px', flexShrink: 0,
                      borderRadius: '50%',
                      background: 'rgba(184,134,11,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{
                        color: tokens.color.white,
                        fontSize: '0.82rem', fontWeight: 600, margin: '0 0 0.2rem',
                      }}>
                        {title}
                      </p>
                      <p style={{
                        color: tokens.color.whiteFaint,
                        fontSize: '0.75rem', margin: 0, lineHeight: 1.5,
                      }}>
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* ══════════ COPYRIGHT ══════════ */}
          <div style={{
            padding: 'clamp(1rem,2vw,1.5rem) clamp(1.25rem,5vw,4rem)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            textAlign: 'center',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.5s',
          }}>
            <p style={{
              color: tokens.color.whiteFaint,
              fontSize: '0.813rem', margin: 0, letterSpacing: '0.02em',
            }}>
              © 2026 SAYO Beauty. All rights reserved.
            </p>
          </div>

        </div>
      </main>
    </>
  );
}