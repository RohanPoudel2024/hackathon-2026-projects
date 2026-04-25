import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

const problems = [
  {
    icon: AlertTriangle,
    iconColor: '#f59e0b',
    iconBg:  '#fef9c3',
    title: 'Patients Forget Post-Visit Instructions',
    description:
      'Studies show patients forget up to 80% of medical information immediately after a consultation. Critical instructions for medications, diet, and follow-ups are lost.',
    stat: '80%',
    statLabel: 'of instructions forgotten',
  },
  {
    icon: Clock,
    iconColor: '#ef4444',
    iconBg:  '#fee2e2',
    title: 'No Post-Visit Continuity',
    description:
      'Physicians lack efficient tools to ensure patients actually follow through on care plans. The gap between consultation and patient action leads to poor health outcomes.',
    stat: '35%',
    statLabel: 'of referrals never completed',
  },
  {
    icon: TrendingDown,
    iconColor: 'var(--color-primary-600)',
    iconBg:  'var(--color-primary-50)',
    title: 'Poor Adherence Worsens Outcomes',
    description:
      'Non-adherence to post-consultation care costs the US healthcare system $300B+ annually and contributes to preventable hospital readmissions.',
    stat: '$300B+',
    statLabel: 'annual cost of non-adherence',
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      style={{
        padding: '5rem 0',
        backgroundColor: 'var(--color-gray-50)',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="gray" style={{ marginBottom: '1rem' }}>The Problem</Badge>
          <h2
            id="problem-heading"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem' }}
          >
            Post-Consultation Care Is Broken
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.0625rem', maxWidth: 560, marginInline: 'auto' }}>
            The moment a patient walks out of the clinic, the care coordination chain breaks down — with serious consequences.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <Card key={p.title} hover padding="lg">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: p.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <Icon size={22} style={{ color: p.iconColor }} />
                </div>
                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: 'var(--color-gray-900)',
                    marginBottom: '0.625rem',
                  }}
                >
                  {p.title}
                </h3>
                <CardContent>{p.description}</CardContent>
                <div
                  style={{
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: p.iconColor,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {p.stat}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>{p.statLabel}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
