import type { Route } from '../lib/router'
import { routeHash } from '../lib/router'
import { SKILLS } from '../data/skills'

export function Sidebar({ route }: { route: Route }) {
  const activeSkill = route.name === 'skill' ? route.skillId : null
  return (
    <nav className="sidebar" aria-label="Main">
      <a className="brand" href="#/">
        Top Scriber<span className="brand-dot">.</span>
      </a>
      <div className="nav-section">
        <div className="nav-label">Practice</div>
        {SKILLS.map((s) => (
          <a
            key={s.id}
            className={`nav-item${activeSkill === s.id ? ' active' : ''}`}
            aria-current={activeSkill === s.id ? 'page' : undefined}
            href={routeHash({ name: 'skill', skillId: s.id })}
          >
            {s.short}
          </a>
        ))}
      </div>
      <div className="nav-section">
        <div className="nav-label">More</div>
        <a
          className={`nav-item${route.name === 'generate' ? ' active' : ''}`}
          aria-current={route.name === 'generate' ? 'page' : undefined}
          href={routeHash({ name: 'generate' })}
        >
          AI scenarios
        </a>
        <a
          className={`nav-item${route.name === 'progress' ? ' active' : ''}`}
          aria-current={route.name === 'progress' ? 'page' : undefined}
          href={routeHash({ name: 'progress' })}
        >
          Progress
        </a>
      </div>
    </nav>
  )
}
