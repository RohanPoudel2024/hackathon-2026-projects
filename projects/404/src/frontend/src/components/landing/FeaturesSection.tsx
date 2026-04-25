import {
  Brain,
  Pill,
  CalendarCheck,
  Users,
  ClipboardList,
  BellRing,
  BarChart3,
  Lock,
} from 'lucide-react';
import { Card, CardTitle, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';

const features = [
  {
    icon: Brain,
    iconBg: 'var(--color-primary-50)',
    iconColor: 'var(--color-primary-600)',
    title: 'AI Care Plan Generation',
    description: 'Automatically extracts structured care plans from consultation transcripts using clinical-grade NLP models.',
    badge: 'Core',
    badgeVariant: 'blue' as const,
  },
  {
    icon: Pill,
    iconBg: '#fef9c3',
    iconColor: '#d97706',
    title: 'Medication Scheduling',
    description: 'Parses medication names, dosages, frequency, and duration into patient-ready schedules with smart reminders.',
    badge: 'Automation',
    badgeVariant: 'gray' as const,
  },
  {
    icon: CalendarCheck,
    iconBg: 'var(--color-green-50)',
    iconColor: 'var(--color-green-700)',
    title: 'Follow-Up Tracking',
    description: 'Tracks scheduled follow-ups, triggers alerts before appointments, and confirms completion.',
    badge: 'Engagement',
    badgeVariant: 'green' as const,
  },
  {
    icon: Users,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    title: 'Referral Guidance',
    description: 'Routes specialist referrals with patient context, urgency flags, and smart scheduling suggestions.',
    badge: 'Coordination',
    badgeVariant: 'gray' as const,
  },
  {
    icon: ClipboardList,
    iconBg: '#fff7ed',
    iconColor: '#ea580c',
    title: 'Patient-Friendly Instructions',
    description: 'Converts complex clinical language into plain-language patient instructions at a 6th-grade reading level.',
    badge: 'Accessibility',
    badgeVariant: 'gray' as const,
  },
  {
    icon: BellRing,
    iconBg: '#fce7f3',
    iconColor: '#db2777',
    title: 'Smart Reminders',
    description: 'Adaptive push, SMS, and email reminders that learn from patient behavior to maximize adherence.',
    badge: 'Engagement',
    badgeVariant: 'gray' as const,
  },
  {
    icon: BarChart3,
    iconBg: 'var(--color-primary-50)',
    iconColor: 'var(--color-primary-700)',
    title: 'Adherence Analytics',
    description: 'Real-time dashboards for care teams showing patient adherence rates, task completion, and risk flags.',
    badge: 'Analytics',
    badgeVariant: 'blue' as const,
  },
  {
    icon: Lock,
    iconBg: 'var(--color-green-50)',
    iconColor: 'var(--color-green-600)',
    title: 'HIPAA-Grade Security',
    description: 'End-to-end encryption, role-based access, audit logs, and full HIPAA compliance built into the core.',
    badge: 'Security',
    badgeVariant: 'green' as const,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{
        padding: '5.5rem 0',
        backgroundColor: '#fff',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <Badge variant="blue" style={{ marginBottom: '1rem' }}>Platform Features</Badge>
          <h2
            id="features-heading"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: '1rem' }}
          >
            Everything You Need for Post-Consultation Care
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.0625rem', maxWidth: 560, marginInline: 'auto' }}>
            A complete suite of AI-powered tools built specifically for the US healthcare workflow.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} hover padding="md">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: f.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} style={{ color: f.iconColor }} />
                  </div>
                  <Badge variant={f.badgeVariant}>{f.badge}</Badge>
                </div>
                <CardTitle style={{ marginBottom: '0.5rem' }}>{f.title}</CardTitle>
                <CardContent>{f.description}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
