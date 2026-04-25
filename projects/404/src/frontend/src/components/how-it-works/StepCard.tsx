import React from 'react';

interface StepCardProps {
  stepNumber: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  isLast?: boolean;
  accentColor?: string;
  accentBg?: string;
}

export default function StepCard({
  stepNumber,
  icon,
  title,
  description,
  details,
  isLast = false,
  accentColor = 'var(--color-primary-600)',
  accentBg = 'var(--color-primary-50)',
}: StepCardProps) {
  return (
    <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
      {/* Timeline spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        {/* Step circle */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 0 6px ${accentBg}, 0 4px 12px rgba(0,0,0,0.12)`,
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            flexShrink: 0,
            zIndex: 1,
            position: 'relative',
          }}
        >
          {icon}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div
            style={{
              width: 2,
              flex: 1,
              minHeight: 48,
              marginTop: 4,
              background: `linear-gradient(180deg, ${accentColor}44 0%, transparent 100%)`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          paddingBottom: isLast ? 0 : '3rem',
          paddingTop: '0.5rem',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: accentColor,
            marginBottom: '0.5rem',
          }}
        >
          Step {stepNumber}
        </span>

        <h3
          style={{
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--color-gray-900)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h3>

        <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, marginBottom: '1.25rem', fontSize: '1rem' }}>
          {description}
        </p>

        <div
          style={{
            backgroundColor: accentBg,
            border: `1px solid ${accentColor}22`,
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
          }}
        >
          {details.map((d) => (
            <div
              key={d}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  marginTop: 7,
                  flexShrink: 0,
                }}
              />
              <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-700)', lineHeight: 1.55 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
