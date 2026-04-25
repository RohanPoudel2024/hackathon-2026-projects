import { Link } from 'react-router-dom';
import { Heart, Shield, Lock, Phone } from 'lucide-react';

const productLinks = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Features',     to: '/features' },
  { label: 'About',        to: '/about' },
];

const legalLinks = [
  { label: 'Privacy Policy', to: '#' },
  { label: 'Terms of Service', to: '#' },
  { label: 'HIPAA Notice', to: '#' },
  { label: 'Cookie Policy', to: '#' },
];

const complianceBadges = [
  { icon: Shield, label: 'HIPAA Compliant' },
  { icon: Lock,   label: 'SOC 2 Type II' },
  { icon: Phone,  label: '24/7 Support'  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const sectionTitle: React.CSSProperties = {
    fontSize: '0.8125rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--color-gray-400)',
    marginBottom: '1rem',
  };

  const footerLink: React.CSSProperties = {
    fontSize: '0.9375rem',
    color: 'var(--color-gray-400)',
    transition: 'color 0.15s ease',
    display: 'block',
    marginBottom: '0.5rem',
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-gray-900)',
        color: 'var(--color-gray-300)',
        paddingTop: '4rem',
        paddingBottom: '2rem',
      }}
    >
      <div className="container">
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart size={18} color="#fff" fill="#fff" />
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.03em' }}>
                CareFlow <span style={{ color: 'var(--color-primary-400)' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-400)', lineHeight: 1.65, maxWidth: 260 }}>
              Transforming doctor–patient conversations into structured, patient-friendly care workflows.
            </p>
            {/* Compliance badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              {complianceBadges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 99,
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.7375rem',
                    fontWeight: 600,
                    color: 'var(--color-gray-300)',
                  }}
                >
                  <Icon size={12} style={{ color: 'var(--color-primary-400)' }} />
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <p style={sectionTitle}>Product</p>
            {productLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                style={footerLink}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gray-400)'; }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={sectionTitle}>Legal</p>
            {legalLinks.map((l) => (
              <a
                key={l.label}
                href={l.to}
                style={footerLink}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--color-gray-400)'; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p style={sectionTitle}>Contact</p>
            <p style={{ ...footerLink, marginBottom: '0.25rem' }}>contact@careflow.ai</p>
            <p style={{ ...footerLink, marginBottom: '0.25rem' }}>support@careflow.ai</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: '1rem' }}>
              United States<br />
              Healthcare Technology Division
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-gray-500)' }}>
            © {year} CareFlow AI, Inc. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', maxWidth: 560, lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--color-gray-500)' }}>Medical Disclaimer:</strong>{' '}
            CareFlow AI is a care coordination tool and does not provide medical advice. Always consult a licensed healthcare provider for medical decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
