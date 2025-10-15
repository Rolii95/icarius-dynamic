import React from 'react'

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ChatWidget } from '@/components/ChatWidget'

const POSITION_STORAGE_KEY = 'icarius:chat:pos'

describe('ChatWidget drag behaviour', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.unstubAllEnvs()
  })

  it('renders drag handle and allows repositioning when feature flag enabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_CHATBOT_DRAG', 'true')
    window.localStorage.setItem('icarius:chat:drag', 'true')

    const user = userEvent.setup()
    render(<ChatWidget />)

    const openButton = await screen.findByRole('button', { name: /chat with us/i })
    await user.click(openButton)

    const handle = await screen.findByRole('button', { name: /drag to move/i })
    const container = document.querySelector('[data-chat-widget]') as HTMLElement

    expect(container).toBeTruthy()

    const pointerId = 1
    fireEvent.pointerDown(handle, { pointerId, clientX: 300, clientY: 300 })
    fireEvent.pointerMove(window, { pointerId, clientX: 250, clientY: 260 })
    fireEvent.pointerUp(window, { pointerId, clientX: 250, clientY: 260 })

    await waitFor(() => {
      expect(container.style.right).toBe('74px')
    })
    expect(container.style.bottom).toBe('64px')

    const stored = window.localStorage.getItem(POSITION_STORAGE_KEY)
    expect(stored).toContain('"right":74')
    expect(stored).toContain('"bottom":64')
  })

  it('does not show drag handle when feature flag disabled', async () => {
    vi.stubEnv('NEXT_PUBLIC_FEATURE_CHATBOT_DRAG', 'false')
    window.localStorage.setItem('icarius:chat:drag', 'false')

    const user = userEvent.setup()
    render(<ChatWidget />)

    const openButton = await screen.findByRole('button', { name: /chat with us/i })
    await user.click(openButton)

    expect(screen.queryByRole('button', { name: /drag to move/i })).toBeNull()
  })
})

describe('ChatWidget minimise flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.unstubAllEnvs()
    vi.stubEnv('NEXT_PUBLIC_FEATURE_CHATBOT_DRAG', 'false')
  })

  it('minimises to dock button and restores on click', async () => {
    const user = userEvent.setup()
    render(<ChatWidget />)

    const openButton = await screen.findByRole('button', { name: /chat with us/i })
    await user.click(openButton)

    const minimiseButton = await screen.findByRole('button', { name: /minimise chat/i })
    await user.click(minimiseButton)

    expect(screen.queryByRole('dialog', { name: /ask icarius/i })).not.toBeInTheDocument()

    const dockButton = await screen.findByRole('button', { name: /open chat/i })
    expect(dockButton).toBeInTheDocument()

    await user.click(dockButton)

    expect(await screen.findByRole('dialog', { name: /ask icarius/i })).toBeInTheDocument()
  })
})
