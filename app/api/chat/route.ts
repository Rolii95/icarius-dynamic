import { NextResponse } from 'next/server'

import { createDefaultSession, routeChatMessage, type ChatSession } from '@/lib/chat/router'

import { getServerSideReplies } from './server-replies'

type ChatRequestBody = {
  message: unknown
  session?: unknown
}

export async function POST(request: Request): Promise<Response> {
  let payload: ChatRequestBody

  try {
    payload = (await request.json()) as ChatRequestBody
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  if (typeof payload.message !== 'string') {
    return NextResponse.json({ error: 'Message must be a string.' }, { status: 400 })
  }

  const session = typeof payload.session === 'object' && payload.session !== null ? payload.session : undefined

  const safeSession: ChatSession = session
    ? {
        hasOpenedScheduler: Boolean((session as any).hasOpenedScheduler),
        awaitingContactEmail: Boolean((session as any).awaitingContactEmail),
        pendingContactSummary:
          typeof (session as any).pendingContactSummary === 'string'
            ? (session as any).pendingContactSummary
            : undefined,
      }
    : createDefaultSession()

  const helperResult = await getServerSideReplies({
    message: payload.message,
    session: safeSession,
  })

  if (helperResult) {
    return NextResponse.json(helperResult)
  }

  const fallbackResult = routeChatMessage({ message: payload.message, session: safeSession })

  return NextResponse.json(fallbackResult)
}
