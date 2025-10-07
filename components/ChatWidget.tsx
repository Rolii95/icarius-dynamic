'use client'

import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'

import type { ChatSession, ContactForwardPayload } from '@/lib/chat/router'
import { ContactModalTrigger } from '@/components/ContactModal'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  content: string
}

type ChatResponse = {
  replies: string[]
  session: ChatSession
  openScheduler?: boolean
  forwardContact?: ContactForwardPayload
}

const initialAssistantMessage =
  "Hi! I'm the Icarius assistant. Ask about our HRIT advisory, HR systems audits, AI delivery, or how to start a project."

const schedulerCtaCopy =
  "Let's get something on the calendar. Book a quick intro call so we can dig in together."

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', content: initialAssistantMessage },
  ])
  const [inputValue, setInputValue] = useState('')
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSuggestedScheduler, setHasSuggestedScheduler] = useState(false)

  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messageCounterRef = useRef(0)

  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.location.hash === '#chat') {
      setIsOpen(true)
    }

    const handleOpenEvent = () => setIsOpen(true)
    window.addEventListener('open-chat-widget', handleOpenEvent)

    return () => {
      window.removeEventListener('open-chat-widget', handleOpenEvent)
    }
  }, [])

  const getNextMessageId = () => {
    messageCounterRef.current += 1
    return messageCounterRef.current
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const id = window.setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true })
    }, 150)

    return () => window.clearTimeout(id)
  }, [isOpen])

  useEffect(() => {
    const lastId = messages[messages.length - 1]?.id ?? 0
    if (lastId > messageCounterRef.current) {
      messageCounterRef.current = lastId
    }
  }, [messages])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleToggle = () => {
    setIsOpen((current) => {
      if (current) {
        window.setTimeout(() => {
          triggerButtonRef.current?.focus({ preventScroll: true })
        }, 0)
      }
      return !current
    })
    setError(null)
  }

  const handleClose = () => {
    setIsOpen(false)
    window.setTimeout(() => {
      triggerButtonRef.current?.focus({ preventScroll: true })
    }, 0)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSending) {
      return
    }

    const trimmed = inputValue.trim()

    if (!trimmed) {
      return
    }

    setInputValue('')
    setError(null)

    const userMessage: ChatMessage = {
      id: getNextMessageId(),
      role: 'user',
      content: trimmed,
    }

    setMessages((previous) => [...previous, userMessage])
    setIsSending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          session: session ?? undefined,
        }),
      })

      if (!response.ok) {
        throw new Error(`Chat request failed with status ${response.status}`)
      }

      const payload = (await response.json()) as ChatResponse | { error?: string }

      if ('error' in payload && payload.error) {
        throw new Error(payload.error)
      }

      if (!('replies' in payload) || !Array.isArray(payload.replies) || !('session' in payload)) {
        throw new Error('Invalid response from chat service')
      }

      const data = payload as ChatResponse

      const assistantMessages = (data.replies ?? []).map<ChatMessage>((reply) => ({
        id: getNextMessageId(),
        role: 'assistant',
        content: reply,
      }))

      setMessages((previous) => [...previous, ...assistantMessages])
      setSession(data.session)

      if (data.openScheduler) {
        setHasSuggestedScheduler(true)
      }
    } catch (requestError) {
      console.error('Unable to send chat message', requestError)
      setError('Sorry, something went wrong. Please try again in a moment.')
    } finally {
      setIsSending(false)
    }
  }

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      formRef.current?.requestSubmit()
    }
  }

  return (
    <div data-chat-widget className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-4">
      {isOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 rounded-2xl border border-white/20 bg-slate-950/90 shadow-2xl backdrop-blur-lg"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 sm:px-5 py-3 sm:py-4">
            <div>
              <h2 id={titleId} className="text-base sm:text-lg font-semibold text-white">
                Ask Icarius
              </h2>
              <p id={descriptionId} className="text-xs sm:text-sm text-slate-300">
                Real-time answers about our services and how we work.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-white/10 p-1.5 text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Close chat</span>
            </button>
          </div>

          <div className="flex max-h-[18rem] sm:max-h-[22rem] flex-col gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      message.role === 'user'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-white/5 text-slate-100'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[80%] rounded-2xl bg-white/5 px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-200">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </p>
            )}

            {hasSuggestedScheduler && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 sm:p-4 text-xs sm:text-sm text-emerald-100">
                <p className="mb-2 sm:mb-3 font-medium text-emerald-200">{schedulerCtaCopy}</p>
                <ContactModalTrigger className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">
                  Book a call
                </ContactModalTrigger>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="grid gap-2">
              <label htmlFor={`${titleId}-input`} className="sr-only">
                Message Icarius
              </label>
              <textarea
                ref={textareaRef}
                id={`${titleId}-input`}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="Ask about services, pricing, or timelines…"
                rows={2}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
              />
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">Press Enter to send · Shift + Enter for a new line</span>
                <span className="text-[10px] text-slate-400 sm:hidden">Enter to send</span>
                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      <button
        ref={triggerButtonRef}
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        aria-expanded={isOpen}
        aria-controls={isOpen ? titleId : undefined}
      >
        <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Chat with us</span>
        <span className="sm:hidden">Chat</span>
      </button>
    </div>
  )
}
