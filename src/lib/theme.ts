import { useEffect, useState } from 'react'

/**
 * Theme handling: the default follows the system preference; the toggle sets
 * an explicit choice, persisted per browser. index.html applies the stored
 * choice before React loads so dark users never see a light flash.
 */

export type Theme = 'light' | 'dark'

const KEY = 'topscriber.theme.v1'

export function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

function applyTheme(t: Theme | null): void {
  const el = document.documentElement
  if (t) el.dataset.theme = t
  else delete el.dataset.theme
}

function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme(): { effective: Theme; toggle: () => void } {
  const [choice, setChoice] = useState<Theme | null>(() => storedTheme())
  const [system, setSystem] = useState<Theme>(() => systemTheme())

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystem(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    applyTheme(choice)
  }, [choice])

  const effective = choice ?? system
  const toggle = () => {
    const next: Theme = effective === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // theme still applies for this visit; it just won't persist
    }
    setChoice(next)
  }
  return { effective, toggle }
}
