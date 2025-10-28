import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const utm_source = searchParams.get('utm_source');
  const utm_medium = searchParams.get('utm_medium');
  const utm_campaign = searchParams.get('utm_campaign');
  
  // NOTE: Be GDPR-aware: don't store IP without consent unless required.
  // Example: post to a logging endpoint or your CRM
  
  // TODO: add server-side logging here (analytics or CRM)
  // Example logging (commented out for privacy compliance):
  /*
  console.log('White paper download:', {
    utm_source,
    utm_medium,
    utm_campaign,
    timestamp: new Date().toISOString(),
    // ip: request.ip, // Only if GDPR compliant
  });
  */
  
  // Redirect to the PDF
  return NextResponse.redirect(new URL('/resources/white-paper.pdf', request.url), 302);
}