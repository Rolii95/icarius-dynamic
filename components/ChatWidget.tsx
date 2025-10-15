'use client'

import { FormEvent, useCallback, useEffect, useId, useRef, useState } from 'react'
import { GripVertical, MessageCircle, Minus, Send, X } from 'lucide-react'

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
  "Let's get something on the calendar. Book a 30-min call so we can dig in together."

type ChatMode = 'closed' | 'open' | 'minimized'

type ChatPosition = {
  bottom: number
  right: number
}

type DragSnapshot = {
  pointerId: number | null
  startX: number
  startY: number
  initial: ChatPosition
  width: number
  height: number
  viewportWidth: number
  viewportHeight: number
}

const MIN_MARGIN = 12
const KEYBOARD_STEP = 20
const DEFAULT_POSITION: ChatPosition = { bottom: 24, right: 24 }
const DRAG_STORAGE_KEY = 'icarius:chat:drag'
const POSITION_STORAGE_KEY = 'icarius:chat:pos'
const ENV_DRAG_ENABLED = process.env.NEXT_PUBLIC_FEATURE_CHATBOT_DRAG === 'true'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function ChatWidget() {
  const [mode, setMode] = useState<ChatMode>('closed')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', content: initialAssistantMessage },
  ])
  const [inputValue, setInputValue] = useState('')
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSuggestedScheduler, setHasSuggestedScheduler] = useState(false)
  const [position, setPosition] = useState<ChatPosition>(DEFAULT_POSITION)
  const [dragEnabled, setDragEnabled] = useState(ENV_DRAG_ENABLED)

  const isOpen = mode === 'open'
  const isMinimized = mode === 'minimized'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const openButtonRef = useRef<HTMLButtonElement | null>(null)
  const dockButtonRef = useRef<HTMLButtonElement | null>(null)
  const dragHandleButtonRef = useRef<HTMLButtonElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messageCounterRef = useRef(0)
  const dragSnapshotRef = useRef<DragSnapshot>({
    pointerId: null,
    startX: 0,
    startY: 0,
    initial: DEFAULT_POSITION,
    width: 0,
    height: 0,
    viewportWidth: 0,
    viewportHeight: 0,
  })

  const titleId = useId()
  const descriptionId = useId()
  const panelId = `${titleId}-panel`

  const focusTrigger = useCallback(
    (target: 'open' | 'dock') => {
      if (typeof window === 'undefined') {
        return
      }

      const ref = target === 'open' ? openButtonRef : dockButtonRef
      window.setTimeout(() => {
        ref.current?.focus({ preventScroll: true })
      }, 0)
    },
    []
  )

  const clampPositionToViewport = useCallback(
    (
      value: ChatPosition,
      overrides?: {
        width?: number
        height?: number
        viewportWidth?: number
        viewportHeight?: number
      }
    ) => {
      if (typeof window === 'undefined') {
        return value
      }

      const container = containerRef.current
      const fallbackWidth = 320
      const fallbackHeight = 400

      const width =
        overrides?.width ??
        (container && container.offsetWidth > 0 ? container.offsetWidth : fallbackWidth)
      const height =
        overrides?.height ??
        (container && container.offsetHeight > 0 ? container.offsetHeight : fallbackHeight)
      const viewportWidth = overrides?.viewportWidth ?? window.innerWidth
      const viewportHeight = overrides?.viewportHeight ?? window.innerHeight

      const maxRight = Math.max(MIN_MARGIN, viewportWidth - MIN_MARGIN - width)
      const maxBottom = Math.max(MIN_MARGIN, viewportHeight - MIN_MARGIN - height)

      return {
        right: clamp(value.right, MIN_MARGIN, maxRight),
        bottom: clamp(value.bottom, MIN_MARGIN, maxBottom),
      }
    },
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.location.hash === '#chat') {
      setMode('open')
      setError(null)
    }

    const handleOpenEvent = () => {
      setMode('open')
      setError(null)
    }
    window.addEventListener('open-chat-widget', handleOpenEvent)

    return () => {
      window.removeEventListener('open-chat-widget', handleOpenEvent)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const stored = window.localStorage.getItem(DRAG_STORAGE_KEY)
      if (stored === 'true') {
        setDragEnabled(true)
      } else if (stored === 'false') {
        setDragEnabled(false)
      }
    } catch {
      // ignore storage access errors
    }
  }, [])

  useEffect(() => {
    if (!dragEnabled) {
      setPosition(DEFAULT_POSITION)
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    try {
      const raw = window.localStorage.getItem(POSITION_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ChatPosition>
        if (typeof parsed.bottom === 'number' && typeof parsed.right === 'number') {
          setPosition(
            clampPositionToViewport({
              bottom: parsed.bottom,
              right: parsed.right,
            })
          )
          return
        }
      }
    } catch {
      // ignore invalid JSON
    }

    setPosition(DEFAULT_POSITION)
  }, [dragEnabled, clampPositionToViewport])

  useEffect(() => {
    if (!dragEnabled || typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position))
  }, [position, dragEnabled])

  useEffect(() => {
    if (!dragEnabled) {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const snapshot = dragSnapshotRef.current
      if (snapshot.pointerId === null || snapshot.pointerId !== event.pointerId) {
        return
      }

      const dx = event.clientX - snapshot.startX
      const dy = event.clientY - snapshot.startY

      setPosition(
        clampPositionToViewport(
          {
            right: snapshot.initial.right - dx,
            bottom: snapshot.initial.bottom - dy,
          },
          {
            width: snapshot.width,
            height: snapshot.height,
            viewportWidth: snapshot.viewportWidth,
            viewportHeight: snapshot.viewportHeight,
          }
        )
      )
    }

    const handlePointerFinish = (event: PointerEvent) => {
      const snapshot = dragSnapshotRef.current
      if (snapshot.pointerId === null || snapshot.pointerId !== event.pointerId) {
        return
      }

      snapshot.pointerId = null

      const handle = dragHandleButtonRef.current
      if (
        handle &&
        typeof handle.hasPointerCapture === 'function' &&
        typeof handle.releasePointerCapture === 'function' &&
        handle.hasPointerCapture(event.pointerId)
      ) {
        try {
          handle.releasePointerCapture(event.pointerId)
        } catch {
          // ignore release errors
        }
      }
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerFinish)
    window.addEventListener('pointercancel', handlePointerFinish)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerFinish)
      window.removeEventListener('pointercancel', handlePointerFinish)
    }
  }, [dragEnabled, clampPositionToViewport])

  const getNextMessageId = () => {
    messageCounterRef.current += 1
    return messageCounterRef.current
  }

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

    const id = window.setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true })
    }, 150)

    return () => window.clearTimeout(id)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const endNode = messagesEndRef.current

    if (endNode && typeof endNode.scrollIntoView === 'function') {
      endNode.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  const handleOpenButtonClick = () => {
    setError(null)
    setMode('open')
  }

  const closeChat = useCallback(() => {
    setMode('closed')
    setError(null)
    focusTrigger('open')
  }, [focusTrigger])

  const minimizeChat = useCallback(() => {
    setMode('minimized')
    setError(null)
    focusTrigger('dock')
  }, [focusTrigger])

  const handleDockButtonClick = () => {
    setError(null)
    setMode('open')
  }

  const handleDragPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragEnabled || typeof window === 'undefined') {
        return
      }

      if (!containerRef.current) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const container = containerRef.current
      const snapshot = dragSnapshotRef.current

      snapshot.pointerId = event.pointerId
      snapshot.startX = event.clientX
      snapshot.startY = event.clientY
      snapshot.width = container.offsetWidth
      snapshot.height = container.offsetHeight
      snapshot.viewportWidth = window.innerWidth
      snapshot.viewportHeight = window.innerHeight
      snapshot.initial = clampPositionToViewport(
        position,
        {
          width: snapshot.width,
          height: snapshot.height,
          viewportWidth: snapshot.viewportWidth,
          viewportHeight: snapshot.viewportHeight,
        }
      )

      setPosition(snapshot.initial)

      if (typeof event.currentTarget.setPointerCapture === 'function') {
        event.currentTarget.setPointerCapture(event.pointerId)
      }
    },
    [clampPositionToViewport, dragEnabled, position]
  )

  const handleDragHandleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!dragEnabled || typeof window === 'undefined') {
        return
      }

      if (!event.altKey) {
        return
      }

      let deltaRight = 0
      let deltaBottom = 0

      switch (event.key) {
        case 'ArrowLeft':
          deltaRight = KEYBOARD_STEP
          break
        case 'ArrowRight':
          deltaRight = -KEYBOARD_STEP
          break
        case 'ArrowUp':
          deltaBottom = KEYBOARD_STEP
          break
        case 'ArrowDown':
          deltaBottom = -KEYBOARD_STEP
          break
        default:
          return
      }

      event.preventDefault()
      event.stopPropagation()

      setPosition((current) =>
        clampPositionToViewport({
          right: current.right + deltaRight,
          bottom: current.bottom + deltaBottom,
        })
      )
    },
    [clampPositionToViewport, dragEnabled]
  )

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
    <div
      ref={containerRef}
      data-chat-widget
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-4"
      style={
        dragEnabled
          ? { bottom: position.bottom, right: position.right }
          : undefined
      }
    >
      {isOpen ? (
        <section
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 rounded-2xl border border-white/20 bg-slate-950/90 shadow-2xl backdrop-blur-lg"
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/10 px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-start gap-3">
              {dragEnabled ? (
                <button
                  ref={dragHandleButtonRef}
                  type="button"
                  className="chat-drag-handle flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 touch-none"
                  aria-label="Drag to move"
                  title="Drag to move (Alt + arrow keys to nudge)"
                  onPointerDown={handleDragPointerDown}
                  onKeyDown={handleDragHandleKeyDown}
                >
                  <GripVertical className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
              <div>
                <h2 id={titleId} className="text-base sm:text-lg font-semibold text-white">
                  Ask Icarius
                </h2>
                <p id={descriptionId} className="text-xs sm:text-sm text-slate-300">
                  Real-time answers about our services and how we work.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={minimizeChat}
                className="rounded-full border border-white/10 p-1.5 text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                title="Minimise chat"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Minimise chat</span>
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="rounded-full border border-white/10 p-1.5 text-slate-200 transition hover:border-white/30 hover:bg-white/5"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Close chat</span>
              </button>
            </div>
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
                  Book a 30-min call
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

      {mode === 'closed' ? (
        <button
          ref={openButtonRef}
          type="button"
          onClick={handleOpenButtonClick}
          className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-emerald-500 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Chat with us</span>
          <span className="sm:hidden">Chat</span>
        </button>
      ) : null}
      {isMinimized ? (
        <button
          ref={dockButtonRef}
          type="button"
          onClick={handleDockButtonClick}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-slate-950 shadow-lg transition hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          aria-label="Open chat"
          aria-controls={panelId}
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
