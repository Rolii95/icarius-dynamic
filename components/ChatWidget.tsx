'use client'

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useDeepLinks } from '@/components/chat/hooks'
import { bookingUrl } from '@/lib/booking'
import {
  ChatMessage,
  ChatSession,
  ContactForwardPayload,
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

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE])
  const [session, setSession] = useState<ChatSession>(createDefaultSession)
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
        const parsed = JSON.parse(raw) as { messages?: ChatMessage[]; session?: ChatSession }
        const restoredMessages = Array.isArray(parsed.messages) && parsed.messages.length > 0 ? parsed.messages : undefined
        const restoredSession = parsed.session

        if (restoredMessages) {
          setMessages(
            restoredMessages.map((message) => ({
              ...message,
              createdAt: typeof message.createdAt === 'number' ? message.createdAt : Date.now(),
            })),
          )
        }

        if (restoredSession) {
          const nextSession: ChatSession = {
            hasOpenedScheduler: Boolean(restoredSession.hasOpenedScheduler),
            awaitingContactEmail: Boolean(restoredSession.awaitingContactEmail),
            pendingContactSummary: restoredSession.pendingContactSummary,
          }

          setSession(nextSession)
          sessionRef.current = nextSession
        }
      }
    } catch (error) {
      console.warn('Failed to restore chat history from local storage', error)
      const fallbackSession = createDefaultSession()
      setMessages([INITIAL_MESSAGE])
      setSession(fallbackSession)
      sessionRef.current = fallbackSession
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
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    } catch (error) {
      console.warn('Failed to persist chat history', error)
    }
  }, [messages, session, hydrated])

  const quickReplies = useMemo(() => getQuickReplies(session), [session])

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

  const handleSend = useCallback(
    async (rawInput: string) => {
      const text = rawInput.trim()
      if (!text) {
        return
      }

      const userMessage = createMessage('user', text)
      appendMessages([userMessage])

      const result = routeChatMessage({ message: text, session: sessionRef.current })

      sessionRef.current = result.session
      setSession(result.session)

      const assistantMessages = result.replies.map((reply) => createMessage('assistant', reply))
      if (assistantMessages.length > 0) {
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
      <div className="space-y-3 text-sm text-slate-200">
        {messages.map((message, index) => (
          <p key={`${message.createdAt}-${index}`} className={message.role === 'assistant' ? 'text-slate-300' : 'text-white'}>
            {message.content}
          </p>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
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
