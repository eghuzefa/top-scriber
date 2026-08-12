import { useRoute } from './lib/router'
import { Sidebar } from './components/Sidebar'
import { HomeView } from './views/HomeView'
import { SkillView } from './views/SkillView'
import { DrillView } from './views/DrillView'
import { ProgressView } from './views/ProgressView'
import { GeneratorView } from './views/GeneratorView'

export default function App() {
  const route = useRoute()

  // Drills are chrome-free: no sidebar, nothing but the exercise.
  if (route.name === 'drill') {
    return <DrillView sampleId={route.sampleId} />
  }

  return (
    <div className="shell">
      <Sidebar route={route} />
      <main className="content">
        {route.name === 'home' && <HomeView />}
        {route.name === 'skill' && <SkillView key={route.skillId} skillId={route.skillId} />}
        {route.name === 'progress' && <ProgressView />}
        {route.name === 'generate' && <GeneratorView />}
      </main>
    </div>
  )
}
