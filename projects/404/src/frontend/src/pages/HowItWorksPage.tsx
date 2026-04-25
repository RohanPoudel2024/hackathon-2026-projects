import { Mic, Cpu, FileCheck, CheckSquare, ArrowRight } from 'lucide-react';
import StepCard from '../components/how-it-works/StepCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import CTASection from '../components/landing/CTASection';

const steps = [
  {
    icon: <Mic size={24} />,
    title: 'Capture the Consultation',
    description:
      'The process begins during or immediately after the patient visit. CareFlow AI accepts audio transcripts, EHR clinical notes, or direct text input from the physician — whatever fits your existing workflow.',
    details: [
      'Supports audio transcription via secure API integration',
      'Compatible with major EHR systems (Epic, Cerner, Athena)',
      'Accepts structured FHIR data or free-form clinical notes',
      'End-to-end encryption from the moment data enters the system',
    ],
    accentColor: 'var(--color-primary-600)',
    accentBg: 'var(--color-primary-50)',
  },
  {
    icon: <Cpu size={24} />,
    title: 'AI Processes and Extracts',
    description:
      'Our clinical NLP engine analyzes the conversation to identify and classify all actionable care items — medications, instructions, follow-up needs, and specialist referrals — with high precision.',
    details: [
      'Clinical-grade NLP trained on US healthcare datasets',
      'Extracts medication names, dosages, frequency, and duration',
      'Identifies follow-up timeframes and urgency levels',
      'Flags specialist referrals with routing context',
      'Detects patient education needs and language preferences',
    ],
    accentColor: '#9333ea',
    accentBg: '#f3e8ff',
  },
  {
    icon: <FileCheck size={24} />,
    title: 'Care Plan is Generated',
    description:
      'Within seconds, a structured, patient-friendly care plan is created. Physicians review and approve the plan with a single click before it is delivered to the patient.',
    details: [
      'Auto-generated care plan ready in under 500ms',
      'Physician review and e-signature workflow built in',
      'Plain-language patient instructions (6th-grade reading level)',
      'Supports multi-language output (Spanish, Mandarin, and more)',
      'Integrates directly into patient portal or mobile app',
    ],
    accentColor: 'var(--color-green-600)',
    accentBg: 'var(--color-green-50)',
  },
  {
    icon: <CheckSquare size={24} />,
    title: 'Patient Executes the Plan',
    description:
      'The patient receives their personalized care plan with step-by-step tasks, smart reminders, and progress tracking — dramatically improving adherence and outcomes.',
    details: [
      'Push, SMS, and email reminders with adaptive timing',
      'Task completion tracking visible to the care team',
      'Real-time adherence analytics dashboard for providers',
      'Automated escalation alerts for missed critical tasks',
      'Two-way messaging for patient questions and updates',
    ],
    accentColor: '#d97706',
    accentBg: '#fef9c3',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Page header */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-primary-50) 0%, #fff 100%)',
          padding: '5rem 0 4rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <Badge variant="blue" style={{ marginBottom: '1rem' }}>How It Works</Badge>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '1.125rem',
              letterSpacing: '-0.03em',
            }}
          >
            From Conversation to Care — In Seconds
          </h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-muted)', maxWidth: 560, marginInline: 'auto', lineHeight: 1.65 }}>
            A simple four-step workflow that transforms any doctor–patient interaction into a structured, patient-ready care plan.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '5rem 0', backgroundColor: '#fff' }}>
        <div className="container">
          <div style={{ maxWidth: 780, marginInline: 'auto' }}>
            {steps.map((step, i) => (
              <StepCard
                key={step.title}
                stepNumber={i + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
                details={step.details}
                isLast={i === steps.length - 1}
                accentColor={step.accentColor}
                accentBg={step.accentBg}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bridge to CTA */}
      <section
        style={{
          backgroundColor: 'var(--color-gray-50)',
          padding: '3rem 0',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.875rem' }}>Ready to See It in Action?</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem', maxWidth: 440, marginInline: 'auto' }}>
            Connect with our team for a personalized demo tailored to your practice or health system.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" as="a" href="#">
              Get Started Free <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="lg" as="a" href="#">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
