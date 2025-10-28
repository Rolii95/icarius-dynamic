import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // You can keep or append UTM params if present on the incoming request
  try {
    const incoming = new URL(request.url)
    const params = incoming.search
    const target = `https://www.icarius-consulting.com/resources/white-paper${params}`
    return NextResponse.redirect(target, 302)
  } catch (e) {
    return NextResponse.redirect('https://www.icarius-consulting.com/resources/white-paper', 302)
  }
}
