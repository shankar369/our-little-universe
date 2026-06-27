import { AnimatePresence } from 'motion/react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { appConfig } from './app/appConfig'
import { siteContent } from './content/siteContent'
import { LoginScreen } from './features/auth/LoginScreen'
import { OpeningHero } from './features/opening/OpeningHero'
import { AmbientBackground } from './shared/components/AmbientBackground'
import { FloatingHeartMenu } from './shared/components/FloatingHeartMenu'
import { ScreenTransition } from './shared/components/ScreenTransition'
import { usePersistentBoolean } from './shared/hooks/usePersistentBoolean'

const JourneyHub = lazy(() =>
  import('./sections/JourneyHub/JourneyHub').then((module) => ({
    default: module.JourneyHub,
  })),
)
const MemoryTimeline = lazy(() =>
  import('./sections/MemoryTimeline/MemoryTimeline').then((module) => ({
    default: module.MemoryTimeline,
  })),
)
const PhotoUniverse = lazy(() =>
  import('./sections/PhotoUniverse/PhotoUniverse').then((module) => ({
    default: module.PhotoUniverse,
  })),
)
const OurLittleAtlas = lazy(() =>
  import('./sections/OurLittleAtlas/OurLittleAtlas').then((module) => ({
    default: module.OurLittleAtlas,
  })),
)

function SectionLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 text-starlight">
      <p className="type-quote text-glow text-lg text-moon">
        opening the next little universe&hellip;
      </p>
    </main>
  )
}

function App() {
  const location = useLocation()
  const [isUnlocked, setIsUnlocked] = usePersistentBoolean(
    appConfig.storageKeys.softGateUnlocked,
  )

  function handleUnlock() {
    setIsUnlocked(true)
  }

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AmbientBackground words={siteContent.ambientWords} />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            <ScreenTransition screenKey={location.pathname}>
              <Suspense fallback={<SectionLoading />}>
                <Routes location={location}>
                  <Route path="/" element={<OpeningHero />} />
                  <Route path="/journey" element={<JourneyHub />} />
                  <Route path="/memory-timeline" element={<MemoryTimeline />} />
                  <Route path="/photo-universe" element={<PhotoUniverse />} />
                  <Route path="/our-little-atlas" element={<OurLittleAtlas />} />
                  <Route path="*" element={<Navigate to="/journey" replace />} />
                </Routes>
              </Suspense>
            </ScreenTransition>
          ) : (
            <ScreenTransition screenKey="login">
              <LoginScreen onUnlock={handleUnlock} />
            </ScreenTransition>
          )}
        </AnimatePresence>
        {isUnlocked && location.pathname !== '/' ? <FloatingHeartMenu /> : null}
      </div>
    </div>
  )
}

export default App
