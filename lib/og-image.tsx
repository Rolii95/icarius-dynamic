import { ImageResponse } from 'next/og'

export const OG_IMAGE_SIZE = { width: 1200, height: 630 }

const featureItems = [
  {
    title: 'HRIT Advisory',
    description: 'Target architecture, integrations, and governance that land.',
  },
  {
    title: 'Project Delivery',
    description: 'RAID discipline, value tracking, and crisp cutover execution.',
  },
  {
    title: 'AI Solutions',
    description: 'Pragmatic automation for HR Ops and knowledge teams.',
  },
]

export function createOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '72px',
          color: '#E8ECF8',
          backgroundColor: '#070b18',
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(107,140,255,0.18), transparent 60%), radial-gradient(circle at 80% 90%, rgba(142,235,255,0.12), transparent 65%), linear-gradient(180deg, #070b18 0%, #0b1020 50%, #070b18 100%)',
          fontFamily: 'Inter, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            borderRadius: '40px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '36px',
              background: 'linear-gradient(135deg, #6b8cff, #8eebff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 30px 80px rgba(107,140,255,0.35)',
            }}
          >
            <div style={{ transform: 'rotate(-16deg)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span
                style={{
                  width: '68px',
                  height: '10px',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  borderRadius: '999px',
                }}
              />
              <span
                style={{
                  width: '64px',
                  height: '9px',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  borderRadius: '999px',
                }}
              />
              <span
                style={{
                  width: '60px',
                  height: '8px',
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  borderRadius: '999px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '64px', fontWeight: 600, letterSpacing: '-0.02em' }}>Icarius Consulting</div>
            <div style={{ fontSize: '30px', color: '#B6BFDB', maxWidth: '760px', lineHeight: 1.35 }}>
              HRIT Advisory • Project Delivery • System Audits • AI Solutions
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: '40px', display: 'flex', gap: '28px' }}>
          {featureItems.map(feature => (
            <div
              key={feature.title}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'linear-gradient(180deg, rgba(21,29,58,0.9), rgba(13,18,40,0.9))',
                borderRadius: '28px',
                padding: '28px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 600 }}>{feature.title}</span>
              <span style={{ fontSize: '22px', color: '#B6BFDB', lineHeight: 1.45 }}>{feature.description}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '26px',
            color: 'rgba(230,234,248,0.85)',
            marginTop: '36px',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                display: 'flex',
                padding: '10px 18px',
                borderRadius: '999px',
                backgroundColor: 'rgba(107,140,255,0.16)',
                color: '#8eebff',
                fontSize: '22px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              HR Transformation Partner
            </span>
          </span>
          <span style={{ fontWeight: 600 }}>icarius-consulting.com</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, immutable, no-transform, max-age=86400',
      },
    }
  )
}
