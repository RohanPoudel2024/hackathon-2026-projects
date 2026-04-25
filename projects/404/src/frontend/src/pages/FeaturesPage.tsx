import {
  Brain, Pill, CalendarCheck, Users, ClipboardList,
  BellRing, BarChart3, Lock, Workflow, Globe, HeartPulse, Zap,
} from 'lucide-react';
import { Card, CardTitle, CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CTASection from '../components/landing/CTASection';

const categories = [
  {
    label: 'AI & Automation',
    color: 'var(--color-primary-600)',
    bg: 'var(--color-primary-50)',
    features: [
      {
        icon: Brain,
        title: 'Clinical NLP Engine',
        description: 'Trained on US healthcare datasets, our model extracts care items with physician-level accuracy.',
      },
      {
        icon: Zap,
        title: 'Sub-500ms Generation',
        description: 'Care plans generated and ready for physician review in under 500 milliseconds.',
      },
      {
        icon: Workflow,
        title: 'Workflow Automation',
        description: 'Auto-routes tasks to patients, care coordinators, and specialists based on urgency.',
      },
    ],
  },
  {
    label: 'Patient Engagement',
    color: 'var(--color-green-600)',
    bg: 'var(--color-green-50)',
    features: [
      {
        icon: Pill,
        title: 'Medication Scheduling',
        description: 'Structured schedules with dosage, frequency, and patient-friendly timing instructions.',
      },
      {
        icon: BellRing,
        title: 'Adaptive Reminders',
        description: 'Push, SMS, and email reminders that adapt to patient behavior and time zones.',
      },
      {
        icon: ClipboardList,
        title: 'Plain-Language Plans',
        description: 'Instructions written at a 6th-grade reading level, with multi-language support.',
      },
    ],
  },
  {
    label: 'Care Coordination',
    color: '#9333ea',
    bg: '#f3e8ff',
    features: [
      {
        icon: CalendarCheck,
        title: 'Follow-Up Management',
        description: 'Tracks appointment scheduling, sends reminders, and confirms completion.',
      },
      {
        icon: Users,
        title: 'Referral Intelligence',
        description: 'Routes specialist referrals with context, urgency classification, and scheduling suggestions.',
      },
      {
        icon: HeartPulse,
        title: 'Vitals & Monitoring',
        description: 'Integrates with patient-reported data for ongoing care monitoring between visits.',
      },
    ],
  },
  {
    label: 'Security & Compliance',
    color: '#d97706',
    bg: '#fef9c3',
    features: [
      {
        icon: Lock,
        title: 'HIPAA Compliance',
        description: 'Built from day one for HIPAA, with BAAs available for all enterprise customers.',
      },
      {
        icon: BarChart3,
        title: 'Audit Logging',
        description: 'Full audit trail of all data access, modifications, and user actions.',
      },
      {
        icon: Globe,
        title: 'EHR Integration',
        description: 'Native integrations with Epic, Cerner, Athena, and FHIR-compliant systems.',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-primary-50) 0%, #fff 100%)',
          padding: '5rem 0 4rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <Badge variant="blue" style={{ marginBottom: '1rem' }}>Platform Features</Badge>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.125rem',
              letterSpacing: '-0.03em',
            }}
          >
            A Complete Post-Consultation Care Platform
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-muted)', maxWidth: 580, marginInline: 'auto', lineHeight: 1.65 }}>
            Every feature purpose-built for US healthcare workflows, patient engagement, and clinical compliance.
          </p>
        </div>
      </section>

      {/* Feature categories */}
      <section style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          {categories.map((cat, ci) => (
            <div
              key={cat.label}
              style={{ marginBottom: ci < categories.length - 1 ? '4rem' : 0 }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    height: 32,
                    width: 4,
                    borderRadius: 99,
                    backgroundColor: cat.color,
                  }}
                />
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-gray-900)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {cat.label}
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {cat.features.map(({ icon: Icon, title, description }) => (
                  <Card key={title} hover padding="md">
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: cat.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                      }}
                    >
                      <Icon size={20} style={{ color: cat.color }} />
                    </div>
                    <CardTitle style={{ marginBottom: '0.5rem' }}>{title}</CardTitle>
                    <CardContent>{description}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
