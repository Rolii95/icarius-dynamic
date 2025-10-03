import { ImageResponse } from 'next/og'

import { OG_IMAGE_SIZE } from './og-image'

type BlogOgImageOptions = {
  title: string
  tagline: string
}

const baseHeaders = {
  'content-type': 'image/png',
  'cache-control': 'public, immutable, no-transform, max-age=86400',
}

export function createBlogOgImage({ title, tagline }: BlogOgImageOptions) {
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
            'radial-gradient(circle at 20% 12%, rgba(107,140,255,0.22), transparent 60%), radial-gradient(circle at 82% 88%, rgba(142,235,255,0.16), transparent 65%), linear-gradient(180deg, #070b18 0%, #0b1020 52%, #070b18 100%)',
          fontFamily: 'Inter, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '40px',
            borderRadius: '44px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 22px',
              borderRadius: '999px',
              backgroundColor: 'rgba(107,140,255,0.16)',
              color: '#8eebff',
              fontSize: '26px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              width: 'fit-content',
            }}
          >
            Icarius Insights
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#B6BFDB',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {tagline}
            </p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '28px',
            color: 'rgba(230,234,248,0.85)',
          }}
        >
          <span style={{ fontWeight: 600 }}>icarius-consulting.com</span>
          <span style={{ color: '#8eebff' }}>HR Transformation Partners</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      headers: baseHeaders,
    }
  )
}
