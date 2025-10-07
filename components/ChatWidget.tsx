'use client'

import { FormEvent, useCallback, useEffect, useRef, useState } from 'react'

import { useDeepLinks } from '@/components/chat/hooks'
import { bookingUrl } from '@/lib/booking'
import {
  ChatMessage,
  ChatSession,
  ContactForwardPayload,
  QuickReply,
  createDefaultSession,
  getQuickReplies,
  routeChatMessage,
} from '@/lib/chat/router'

const STORAGE_KEY = 'icarius.chat.history.v1'
const SCHEDULER_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? bookingUrl

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    role,
    content,
    createdAt: Date.now(),
  }
}

const INITIAL_MESSAGE = createMessage(
  'assistant',
  "Hey! I'm the Icarius assistant. Ask anything about our services, case studies, or grab time with the team.",
)

function parseChatSession(input: unknown): ChatSession | undefined {
  if (typeof input !== 'object' || input === null) {
    return undefined
  }

  const session = input as Record<string, unknown>

  return {
    hasOpenedScheduler: Boolean(session.hasOpenedScheduler),
    awaitingContactEmail: Boolean(session.awaitingContactEmail),
    pendingContactSummary:
      typeof session.pendingContactSummary === 'string' ? session.pendingContactSummary : undefined,
  }
}

function parseStoredMessages(input: unknown): ChatMessage[] | undefined {
  if (!Array.isArray(input)) {
    return undefined
  }

  const sanitized: ChatMessage[] = []
  let discardedCount = 0
  let sanitizedCount = 0

  input.forEach((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      discardedCount += 1
      return
    }

    const candidate = entry as Record<string, unknown>
    const role = candidate.role
    const content = candidate.content
    const createdAt = candidate.createdAt

    if (role !== 'assistant' && role !== 'user') {
      discardedCount += 1
      return
    }

    if (typeof content !== 'string') {
      discardedCount += 1
      return
    }

    const roleValue: ChatMessage['role'] = role
    let timestamp: number | undefined

    if (typeof createdAt === 'number' && Number.isFinite(createdAt)) {
      timestamp = createdAt
    } else if (typeof createdAt === 'string') {
      const parsed = Number(createdAt)
      if (Number.isFinite(parsed)) {
        timestamp = parsed
        sanitizedCount += 1
      }
    }

    if (typeof timestamp !== 'number') {
      timestamp = Date.now()
      sanitizedCount += 1
    }

    sanitized.push({
      role: roleValue,
      content,
      createdAt: timestamp,
    })
  })

  if (discardedCount > 0) {
    console.warn(`Discarded ${discardedCount} malformed chat message(s) from storage`)
  }

  if (sanitizedCount > 0) {
    console.warn(`Sanitized ${sanitizedCount} chat message(s) from storage`)
  }

  return sanitized
}

function parseReplies(input: unknown): string[] | undefined {
  if (!Array.isArray(input)) {
    return undefined
  }

  return input.filter((entry): entry is string => typeof entry === 'string')
}

function parseForwardContact(input: unknown): ContactForwardPayload | undefined {
  if (typeof input !== 'object' || input === null) {
    return undefined
  }

  const payload = input as Record<string, unknown>
  const name = typeof payload.name === 'string' ? payload.name : undefined
  const email = typeof payload.email === 'string' ? payload.email : undefined
  const message = typeof payload.message === 'string' ? payload.message : undefined

  if (!name || !email || !message) {
    return undefined
  }

  return { name, email, message }
}

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [session, setSession] = useState<ChatSession>(createDefaultSession)
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>(() => getQuickReplies(session))
  const [input, setInput] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [isSendingContact, setIsSendingContact] = useState(false)
  const deepLink = useDeepLinks()
  const sessionRef = useRef<ChatSession>(session)
  const mountedRef = useRef(false)

  useEffect(() => {
    sessionRef.current = session
  }, [session])

  useEffect(() => {
    if (typeof window === 'undefined' || mountedRef.current) {
      return
    }

    mountedRef.current = true

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as {
          messages?: ChatMessage[]
          session?: unknown
        }
        const restoredMessages = parseStoredMessages(parsed.messages)
        const restoredSession = parseChatSession(parsed.session)

        let usedFallback = false

        if (restoredMessages) {
          if (restoredMessages.length > 0) {
            setMessages(restoredMessages)
          } else {
            usedFallback = true
            console.warn('No valid chat messages found in storage. Resetting to defaults.')
            const fallbackSession = createDefaultSession()
            setMessages([INITIAL_MESSAGE])
            setSession(fallbackSession)
            sessionRef.current = fallbackSession
            setQuickReplies(getQuickReplies(fallbackSession))
          }
        }

        if (!usedFallback && restoredSession) {
          setSession(restoredSession)
          sessionRef.current = restoredSession
          setQuickReplies(getQuickReplies(restoredSession))
        }
      }
    } catch (error) {
      console.warn('Failed to restore chat history from local storage', error)
      const fallbackSession = createDefaultSession()
      setMessages([INITIAL_MESSAGE])
      setSession(fallbackSession)
      sessionRef.current = fallbackSession
      setQuickReplies(getQuickReplies(fallbackSession))
    }

    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return
    }

    const snapshot = {
      messages,
      session,
      quickReplies,
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      console.warn('Failed to persist chat history', error)
    }
  }, [messages, session, quickReplies, hydrated])

  const appendMessages = useCallback((entries: ChatMessage[]) => {
    setMessages((current) => {
      const next = [...current, ...entries]
      return next.slice(-40)
    })
  }, [])

  const forwardContact = useCallback(async (payload: ContactForwardPayload) => {
    setIsSendingContact(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          message: payload.message,
        }),
      })

      if (!response.ok) {
        throw new Error(`Contact request failed with status ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to forward contact request from chat widget', error)
      appendMessages([
        createMessage(
          'assistant',
          "Hmm, I couldn't send that to the team just now. Feel free to book a call or try again in a moment.",
        ),
      ])
    } finally {
      setIsSendingContact(false)
    }
  }, [appendMessages])

  const applyResult = useCallback(
    async (result: {
      replies: string[]
      session: ChatSession
      openScheduler?: boolean
      forwardContact?: ContactForwardPayload
    }) => {
      sessionRef.current = result.session
      setSession(result.session)
      setQuickReplies(getQuickReplies(result.session))

      if (result.replies.length > 0) {
        const assistantMessages = result.replies.map((reply) => createMessage('assistant', reply))
        appendMessages(assistantMessages)
      }

      if (result.openScheduler && typeof window !== 'undefined') {
        deepLink(SCHEDULER_URL)
      }

      if (result.forwardContact) {
        await forwardContact(result.forwardContact)
      }
    },
    [appendMessages, deepLink, forwardContact],
  )

  const send = useCallback(
    async (trimmed: string) => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            session: sessionRef.current,
          }),
        })

        const data = (await response.json().catch(() => null)) as unknown

        if (response.ok && data && typeof data === 'object') {
          const payload = data as Record<string, unknown>
          const replies = parseReplies(payload.replies)
          const nextSession = parseChatSession(payload.session)

          if (replies && nextSession) {
            const forwardContactPayload = parseForwardContact(payload.forwardContact)

            await applyResult({
              replies,
              session: nextSession,
              openScheduler: payload.openScheduler === true ? true : undefined,
              forwardContact: forwardContactPayload,
            })
            return
          }
        }

        if (!response.ok) {
          console.error(`Chat request failed with status ${response.status}`)
        } else {
          console.error('Chat request returned unexpected payload', data)
        }
      } catch (error) {
        console.error('Failed to send chat message', error)
      }

      const fallbackResult = routeChatMessage({ message: trimmed, session: sessionRef.current })
      await applyResult({
        replies: fallbackResult.replies,
        session: fallbackResult.session,
        openScheduler: fallbackResult.openScheduler,
        forwardContact: fallbackResult.forwardContact,
      })
    },
    [applyResult],
  )

  const handleSend = useCallback(
    async (rawInput: string) => {
      const trimmed = rawInput.trim()
      if (!trimmed) {
        return
      }

      const userMessage = createMessage('user', trimmed)
      appendMessages([userMessage])

      await send(trimmed)
    },
    [appendMessages, send],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const pending = input
      setInput('')
      void handleSend(pending)
    },
    [handleSend, input],
  )

  const handleQuickReply = useCallback(
    (value: string) => {
      setInput('')
      void handleSend(value)
    },
    [handleSend],
  )

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left">
      <div
        role="log"
        aria-live={hydrated ? 'polite' : 'off'}
        aria-relevant="additions"
        className="space-y-3 text-sm text-slate-200"
      >
        {messages.map((message, index) => (
          <p key={`${message.createdAt}-${index}`} className={message.role === 'assistant' ? 'text-slate-300' : 'text-white'}>
            {message.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="chat-widget-message" className="sr-only">
          Message Icarius Assistant
        </label>
        <input
          type="text"
          id="chat-widget-message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-md border border-[rgba(255,255,255,.12)] bg-transparent px-3 py-2 text-sm"
          disabled={isSendingContact}
        />
        <button
          type="submit"
          className="rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!input.trim() || isSendingContact}
        >
          Send
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply) => (
          <button
            key={reply.id}
            type="button"
            className="rounded-full border border-[rgba(255,255,255,.12)] px-3 py-1 text-xs text-slate-200"
            onClick={() => handleQuickReply(reply.value)}
            disabled={isSendingContact}
          >
            {reply.label}
          </button>
        ))}
      </div>

      {session.hasOpenedScheduler && (
        <div className="rounded-lg border border-[rgba(255,255,255,.12)] bg-slate-950/80 p-3 text-sm text-slate-200">
          <p>
            Booking link:{' '}
            <a href={SCHEDULER_URL} className="text-[color:var(--primary)]" target="_blank" rel="noreferrer noopener">
              Book a call
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export { useDeepLinks }
