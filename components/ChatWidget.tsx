'use client'

import { FormEvent, useCallback, useState } from 'react'
import { bookingUrl } from '@/lib/booking'

const bookingPhrases = [
  'book a call',
  'book an intro call',
  'book a meeting',
  'book time',
  'schedule a call',
  'schedule an intro call',
  'schedule time',
  'schedule a meeting',
  'calendar link',
  'calendly',
  'cal.com',
  'booking link',
]

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const keyword = (phrase: string) => escapeRegExp(phrase.trim().toLowerCase()).replace(/\s+/g, '\\s+')

const openSched = new RegExp(`\\b(?:${bookingPhrases.map(keyword).join('|')})\\b`, 'i')

type MessageAuthor = 'assistant' | 'user'

type Message = {
  id: number
  author: MessageAuthor
  text: string
}

type QuickReply = {
  label: string
  value: string
}

const quickReplies: QuickReply[] = [
  { label: 'Book a call', value: 'Can we book a call?' },
  { label: 'Share capabilities', value: 'What does Icarius help with?' },
  { label: 'Case studies', value: 'Can you point me to relevant case studies?' },
]

const BOT_RESPONSE_DELAY_MS = 600

export function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      author: 'assistant',
      text: "Hey! I'm the Icarius assistant. Ask anything about our services or book time with the team.",
    },
  ])
  const [input, setInput] = useState('')
  const [showScheduler, setShowScheduler] = useState(false)

  const addMessage = useCallback((text: string, author: MessageAuthor) => {
    setMessages((current) => [...current, { id: current.length, author, text }])
  }, [])

  const queueAssistantMessage = useCallback(
    (text: string) => {
      const schedule = typeof window !== 'undefined' ? window.setTimeout.bind(window) : setTimeout

      schedule(() => {
        addMessage(text, 'assistant')
      }, BOT_RESPONSE_DELAY_MS)
    },
    [addMessage],
  )

  const handleSend = (text: string) => {
    const normalized = text.trim()
    if (!normalized) {
      return
    }

    addMessage(normalized, 'user')

    if (openSched.test(normalized)) {
      if (typeof window !== 'undefined') {
        window.open(bookingUrl, '_blank', 'noopener,noreferrer')
      }

      setShowScheduler(true)
      queueAssistantMessage('Great! You can grab time with us here: ' + bookingUrl)
      return
    }

    queueAssistantMessage(
      "I'll share links and context based on your question. You can also choose a quick reply below.",
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const pending = input
    setInput('')
    handleSend(pending)
  }

  const handleQuickReply = (value: string) => {
    setInput('')
    handleSend(value)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left">
      <div className="space-y-3 text-sm text-slate-200">
        {messages.map((message) => (
          <p key={message.id} className={message.author === 'assistant' ? 'text-slate-300' : 'text-white'}>
            {message.text}
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
        />
        <button
          type="submit"
          className="rounded-md bg-[color:var(--primary)] px-3 py-2 text-sm font-medium text-slate-950"
        >
          Send
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {quickReplies.map((reply) => (
          <button
            key={reply.label}
            type="button"
            className="rounded-full border border-[rgba(255,255,255,.12)] px-3 py-1 text-xs text-slate-200"
            onClick={() => handleQuickReply(reply.value)}
          >
            {reply.label}
          </button>
        ))}
      </div>

      {showScheduler && (
        <div className="rounded-lg border border-[rgba(255,255,255,.12)] bg-slate-950/80 p-3 text-sm text-slate-200">
          <p>
            Booking link:{' '}
            <a href={bookingUrl} className="text-[color:var(--primary)]" target="_blank" rel="noreferrer noopener">
              Book a call
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export { openSched }
