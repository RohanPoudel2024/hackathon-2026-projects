import { Shield, Lock, Server, Eye, CheckCircle2 } from 'lucide-react';
import Badge from '../ui/Badge';

const trustItems = [
  {
    icon: Shield,
    title: 'HIPAA Compliant by Design',
    desc: 'Built from the ground up to meet HIPAA Privacy and Security Rules. BAA available for all enterprise plans.',
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    desc: 'All patient data is encrypted in transit (TLS 1.3) and at rest (AES-256). Zero plaintext storage.',
  },
  {
    icon: Server,
    title: 'SOC 2 Type II Certified',
    desc: 'Independently audited security controls, availability, and confidentiality — renewed annually.',
  },
  {
    icon: Eye,
    title: 'Privacy-First Architecture',
    desc: 'Minimal data retention, patient data isolation, and full deletion capabilities on request.',
  },
];

const stats = [
  { value: '99.9%',  label: 'Platform uptime SLA' },
  { value: '256-bit', label: 'AES encryption at rest' },
  { value: '<500ms', label: 'Care plan generation' },
  { value: '0',      label: 'PHI sold or shared' },
];

export default function TrustSection() {
  return (
    <section
      id="trust"
      aria-labelledby="trust-heading"
      style={{
        padding: '5.5rem 0',
        background: 'linear-gradient(180deg, var(--color-primary-900) 0%, var(--color-gray-900) 100%)',
        color: '#fff',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge
            variant="blue"
            style={{
              marginBottom: '1rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'var(--color-primary-300)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            Security & Compliance
          </Badge>
          <h2
            id="trust-heading"
            style={{
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              color: '#fff',
              marginBottom: '1rem',
            }}
          >
            Healthcare-Grade Security, Built In
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.0625rem', maxWidth: 520, marginInline: 'auto' }}>
            We meet the highest standards of US healthcare data privacy and security — so your team can focus on care.
          </p>
        </div>

        {/* Trust cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: 'rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Icon size={20} style={{ color: 'var(--color-primary-300)' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary-300)', letterSpacing: '-0.04em' }}>
                {value}
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.25rem' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {['HIPAA', 'SOC 2 Type II', 'HITECH', 'HL7 FHIR', '21st Century Cures'].map((cert) => (
            <span
              key={cert}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.375rem 1rem',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 99,
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <CheckCircle2 size={13} style={{ color: 'var(--color-green-500)' }} />
              {cert}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
