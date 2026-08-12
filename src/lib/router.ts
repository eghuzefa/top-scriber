import { useEffect, useState } from 'react'
import type { SkillId } from './types'

const SKILL_IDS: readonly SkillId[] = ['typing', 'listen', 'vocab', 'format', 'adapt', 'endurance']

export type Route =
  | { name: 'home' }
  | { name: 'skill'; skillId: SkillId }
  | { name: 'drill'; sampleId: string }
  | { name: 'progress' }
  | { name: 'generate' }

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts.length === 0) return { name: 'home' }
  if (parts[0] === 'skill' && SKILL_IDS.includes(parts[1] as SkillId)) {
    return { name: 'skill', skillId: parts[1] as SkillId }
  }
  if (parts[0] === 'drill' && parts[1]) {
    return { name: 'drill', sampleId: decodeURIComponent(parts[1]) }
  }
  if (parts[0] === 'progress') return { name: 'progress' }
  if (parts[0] === 'generate') return { name: 'generate' }
  return { name: 'home' }
}

export function routeHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'skill':
      return `#/skill/${route.skillId}`
    case 'drill':
      return `#/drill/${encodeURIComponent(route.sampleId)}`
    case 'progress':
      return '#/progress'
    case 'generate':
      return '#/generate'
  }
}

export function navigate(route: Route): void {
  location.hash = routeHash(route)
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash))
  useEffect(() => {
    const onHash = () => {
      setRoute(parseHash(location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}
