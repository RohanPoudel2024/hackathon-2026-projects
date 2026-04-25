import { Pill, CalendarCheck, Users, FileText, ArrowRight, Zap } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const outcomes = [
  { icon: Pill,          label: 'Medication Schedules', desc: 'Precise dosing, frequency, and duration extracted automatically' },
  { icon: CalendarCheck, label: 'Follow-Up Reminders',  desc: 'Timely alerts for check-ups, labs, and monitoring' },
  { icon: Users,         label: 'Specialist Referrals', desc: 'Referral routing with context and urgency classification' },
  { icon: FileText,      label: 'Care Instructions',    desc: 'Plain-language patient instructions from clinical notes' },
];

export default function SolutionSection() {
  return (
    <section
      id="solution"
      aria-labelledby="solution-heading"
      style={{
        padding: '5.5rem 0',
        background: 'linear-gradient(180deg, #ffffff 0%, var(--color-primary-50) 100%)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* Left: copy */}
          <div>
            <Badge variant="blue" style={{ marginBottom: '1rem' }}>
              <Zap size={12} />
              The Solution
            </Badge>
            <h2
              id="solution-heading"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1.125rem' }}
            >
              AI That Bridges the Gap Between Consultation and Care
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              CareFlow AI listens to—or reads—doctor–patient interactions and instantly transforms them into
              structured, executable care workflows. No manual effort. No missed instructions.
            </p>
            <Button variant="primary" size="md" as="a" href="/how-it-works">
              See How It Works
              <ArrowRight size={16} />
            </Button>
          </div>

          {/* Right: outcome grid */}
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {outcomes.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  style={{
                    background: '#fff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-xs)',
                    transition: 'box-shadow 0.2s ease, transform 0.18s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-xs)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: 'var(--color-primary-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.875rem',
                    }}
                  >
                    <Icon size={20} style={{ color: 'var(--color-primary-600)' }} />
                  </div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-gray-900)', marginBottom: '0.375rem' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', lineHeight: 1.55 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
