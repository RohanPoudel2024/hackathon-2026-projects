import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      style={{ padding: '6rem 0', backgroundColor: 'var(--color-gray-50)' }}
    >
      <div className="container">
        <div
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-800) 100%)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2.5rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(37,99,235,0.25)',
          }}
        >
          {/* Background circles */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -80,
              right: -80,
              width: 300,
              height: 300,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.875rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 99,
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Sparkles size={13} />
              Start Today — No Setup Required
            </div>

            <h2
              id="cta-heading"
              style={{
                fontSize: 'clamp(1.875rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
                maxWidth: 680,
                marginInline: 'auto',
              }}
            >
              Start Improving Post-Consultation Care Today
            </h2>

            <p
              style={{
                fontSize: '1.0625rem',
                color: 'rgba(255,255,255,0.75)',
                maxWidth: 520,
                marginInline: 'auto',
                lineHeight: 1.65,
                marginBottom: '2.25rem',
              }}
            >
              Join hundreds of US healthcare providers delivering better care outcomes with CareFlow AI.
              Get set up in minutes — HIPAA-compliant from day one.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <Button
                variant="primary"
                size="lg"
                as="a"
                href="#"
                style={{
                  backgroundColor: '#fff',
                  color: 'var(--color-primary-700)',
                  border: 'none',
                  fontWeight: 700,
                }}
              >
                Get Started Free
                <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                as="a"
                href="/how-it-works"
                style={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#fff',
                }}
              >
                Schedule a Demo
              </Button>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
              No credit card required · Free 30-day trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
