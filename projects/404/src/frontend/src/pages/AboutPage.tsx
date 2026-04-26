import { Heart, Target, Users, Shield, ArrowRight } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { Card, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/PublicButton';
import CTASection from '../components/landing/CTASection';

const values = [
  {
    icon: Heart,
    iconColor: '#ef4444',
    iconBg: '#fee2e2',
    title: 'Patient-Centered Design',
    description:
      'Every product decision begins with one question: does this help patients follow through on their care? We build for outcomes, not for complexity.',
  },
  {
    icon: Target,
    iconColor: 'var(--color-primary-600)',
    iconBg: 'var(--color-primary-50)',
    title: 'Clinical Accuracy First',
    description:
      'We partner with physicians, nurses, and care coordinators to ensure our AI models meet the rigorous accuracy standards required in healthcare settings.',
  },
  {
    icon: Users,
    iconColor: 'var(--color-green-600)',
    iconBg: 'var(--color-green-50)',
    title: 'Inclusive & Accessible',
    description:
      'Our platform supports multi-language output, plain-language instructions, and accessibility standards — healthcare is for everyone.',
  },
  {
    icon: Shield,
    iconColor: '#9333ea',
    iconBg: '#f3e8ff',
    title: 'Privacy as a Promise',
    description:
      'We will never sell, share, or monetize patient data. HIPAA compliance isn\'t a checkbox — it\'s a core architectural commitment.',
  },
];

const team = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Chief Medical Officer',
    bio: 'Board-certified internist with 15+ years in clinical practice and digital health innovation at UCSF.',
    initials: 'PS',
    color: 'var(--color-primary-600)',
  },
  {
    name: 'Marcus Reid',
    role: 'CEO & Co-Founder',
    bio: 'Former health-tech product lead at Epic Systems. Built care coordination tools used by 200+ hospitals.',
    initials: 'MR',
    color: '#9333ea',
  },
  {
    name: 'Lin Wei, PhD',
    role: 'Head of AI Research',
    bio: 'Clinical NLP researcher, formerly at Stanford Medicine. Specializes in healthcare-specific language models.',
    initials: 'LW',
    color: 'var(--color-green-600)',
  },
  {
    name: 'Anika Osei',
    role: 'Chief Compliance Officer',
    bio: 'Healthcare attorney and HIPAA expert. Formerly led compliance at Athenahealth and Optum.',
    initials: 'AO',
    color: '#d97706',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-primary-50) 0%, #fff 100%)',
          padding: '5rem 0 4rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <Badge variant="blue" style={{ marginBottom: '1rem' }}>About CareFlow AI</Badge>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              maxWidth: 720,
              marginInline: 'auto',
            }}
          >
            We Believe Every Patient Deserves a Clear Path to Recovery
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--color-muted)',
              maxWidth: 580,
              marginInline: 'auto',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            CareFlow AI was founded by clinicians and technologists who experienced firsthand how care breaks down
            the moment a patient leaves the clinic. We built the platform we wished existed.
          </p>
          <Button variant="primary" size="lg" as="a" href="#">
            Join Our Mission <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* Mission */}
      <section style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <Badge variant="gray" style={{ marginBottom: '1rem' }}>Our Mission</Badge>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', marginBottom: '1.125rem' }}>
                Closing the Post-Consultation Care Gap
              </h2>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, marginBottom: '1.25rem', fontSize: '1.0625rem' }}>
                Millions of clinical consultations happen every day across the United States. But the structured knowledge 
                transferred in those 15-minute appointments is largely lost the moment the patient walks out.
              </p>
              <p style={{ color: 'var(--color-muted)', lineHeight: 1.75, fontSize: '1.0625rem' }}>
                CareFlow AI bridges that gap with technology — turning every conversation into a living, actionable 
                care plan that follows the patient home, adapts to their progress, and keeps the care team informed.
              </p>
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {[
                { v: '500+',  l: 'Healthcare providers', c: 'var(--color-primary-600)' },
                { v: '2M+',   l: 'Care plans generated', c: 'var(--color-green-600)'   },
                { v: '94%',   l: 'Patient adherence rate', c: '#9333ea'                 },
                { v: '2023',  l: 'Founded in San Francisco', c: '#d97706'               },
              ].map(({ v, l, c }) => (
                <div
                  key={l}
                  style={{
                    background: 'var(--color-gray-50)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '2rem', fontWeight: 800, color: c, letterSpacing: '-0.04em', marginBottom: 4 }}>
                    {v}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        style={{
          padding: '5rem 0',
          backgroundColor: 'var(--color-gray-50)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="gray" style={{ marginBottom: '1rem' }}>Our Values</Badge>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>What Drives Everything We Build</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {values.map(({ icon: Icon, iconColor, iconBg, title, description }) => (
              <Card key={title} hover padding="lg">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.125rem',
                  }}
                >
                  <Icon size={22} style={{ color: iconColor }} />
                </div>
                <CardTitle style={{ marginBottom: '0.625rem' }}>{title}</CardTitle>
                <CardContent>{description}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '5rem 0', backgroundColor: '#fff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Badge variant="blue" style={{ marginBottom: '1rem' }}>Leadership Team</Badge>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>Built by Clinicians and Technologists</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {team.map(({ name, role, bio, initials, color }) => (
              <Card key={name} hover padding="lg">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '1rem',
                      flexShrink: 0,
                    }}
                  >
                    {initials}
                  </div>
                  <div>
                    <CardTitle style={{ fontSize: '0.9375rem' }}>{name}</CardTitle>
                    <p style={{ fontSize: '0.8125rem', color: color, fontWeight: 600 }}>{role}</p>
                  </div>
                </div>
                <CardContent style={{ fontSize: '0.875rem' }}>{bio}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
