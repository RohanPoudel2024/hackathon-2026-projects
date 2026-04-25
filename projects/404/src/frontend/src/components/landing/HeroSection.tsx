import { ArrowRight, Play, CheckCircle2, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const highlights = [
  'HIPAA Compliant',
  'AI-Powered Accuracy',
  'Patient-Ready Plans',
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-headline"
      style={{
        background: 'linear-gradient(160deg, #eff6ff 0%, #f8fafc 45%, #f0fdf4 100%)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background decoration */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: -120,
          right: -80,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: -60,
          left: -60,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left: Copy */}
          <div className="animate-fade-up">
            <div style={{ marginBottom: '1.25rem' }}>
              <Badge variant="blue">
                <Sparkles size={12} />
                AI-Powered Post-Consultation Care
              </Badge>
            </div>

            <h1
              id="hero-headline"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: 'var(--color-gray-900)',
                marginBottom: '1.375rem',
              }}
            >
              Turn Medical Conversations Into{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Clear, Actionable
              </span>{' '}
              Care Plans
            </h1>

            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--color-muted)',
                lineHeight: 1.7,
                maxWidth: 520,
                marginBottom: '2rem',
              }}
            >
              CareFlow AI automatically extracts medications, follow-ups, referrals, and instructions from 
              doctor–patient conversations — delivering structured, patient-friendly care workflows instantly.
            </p>

            {/* Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.25rem' }}>
              {highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-gray-700)',
                  }}
                >
                  <CheckCircle2 size={16} style={{ color: 'var(--color-green-600)' }} />
                  {h}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem' }}>
              <Button variant="primary" size="lg" as="a" href="#">
                Get Started Free
                <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg" as="a" href="/how-it-works">
                <Play size={16} fill="currentColor" />
                See How It Works
              </Button>
            </div>

            {/* Social proof */}
            <p
              style={{
                marginTop: '1.5rem',
                fontSize: '0.8125rem',
                color: 'var(--color-gray-400)',
              }}
            >
              Trusted by <strong style={{ color: 'var(--color-gray-600)' }}>500+ healthcare providers</strong> across the US
            </p>
          </div>

          {/* Right: UI Mock */}
          <div className="animate-fade-up-delay-2 hero-visual" style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroMockup />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hero-visual { display: none; }
          #hero { padding-top: 4rem; padding-bottom: 4rem; }
        }
      `}</style>
    </section>
  );
}

function HeroMockup() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: 440,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 24px 48px rgba(0,0,0,0.1), 0 4px 12px rgba(37,99,235,0.08)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: 'var(--color-gray-50)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
        }}
      >
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c, opacity: 0.7 }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: '0.5rem',
            height: 24,
            backgroundColor: 'var(--color-gray-200)',
            borderRadius: 6,
            fontSize: '0.7rem',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '0.5rem',
            color: 'var(--color-gray-400)',
          }}
        >
          careflow.ai/patient/care-plan
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            marginBottom: '1rem',
            color: '#fff',
          }}
        >
          <p style={{ fontSize: '0.7rem', opacity: 0.75, marginBottom: 4 }}>Generated Care Plan • Apr 25, 2025</p>
          <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Sarah's Post-Visit Care Plan</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: 4 }}>Dr. Chen · Internal Medicine · Follow-up in 2 weeks</p>
        </div>

        {/* Tasks */}
        {[
          { color: '#dbeafe', dot: 'var(--color-primary-500)', label: 'Medications', val: 'Amoxicillin 500mg · 3×/day · 7 days' },
          { color: '#dcfce7', dot: 'var(--color-green-500)',   label: 'Follow-Up',   val: 'Schedule cardiology referral by May 2' },
          { color: '#fef9c3', dot: '#d97706',                  label: 'Lab Work',    val: 'CBC, Lipid Panel — Quest Diagnostics' },
          { color: '#f3e8ff', dot: '#9333ea',                  label: 'Reminder',    val: 'Take BP reading daily, log results' },
        ].map(({ color, dot, label, val }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              padding: '0.625rem 0.75rem',
              background: color,
              borderRadius: 10,
              marginBottom: '0.5rem',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dot, marginTop: 4, flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)' }}>{val}</p>
            </div>
          </div>
        ))}

        {/* Progress */}
        <div style={{ marginTop: '0.875rem', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-gray-600)' }}>Plan Completion</p>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary-600)' }}>2 / 4 tasks</p>
          </div>
          <div style={{ height: 6, backgroundColor: 'var(--color-gray-100)', borderRadius: 99 }}>
            <div
              style={{
                height: '100%',
                width: '50%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-green-500))',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
