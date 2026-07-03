import { AnimatePresence } from 'motion/react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { appConfig } from './app/appConfig'
import { LoginScreen } from './features/auth/LoginScreen'
import { OpeningHero } from './features/opening/OpeningHero'
import { AmbientBackground } from './shared/components/AmbientBackground'
import { ChapterCurtain } from './shared/components/ChapterCurtain'
import { CinematicTransitionProvider } from './shared/components/CinematicTransition'
import { FloatingHeartMenu } from './shared/components/FloatingHeartMenu'
import { FullscreenToggle } from './shared/components/FullscreenToggle'
import { ScreenTransition } from './shared/components/ScreenTransition'
import { usePersistentBoolean } from './shared/hooks/usePersistentBoolean'
import {
  HeartLockerProvider,
  useHeartLocker,
} from './features/heartLocker/HeartLockerContext'
import { HeartLockerPrompt } from './features/heartLocker/HeartLockerPrompt'

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
const HeartLocker = lazy(() =>
  import('./sections/HeartLocker/HeartLocker').then((module) => ({
    default: module.HeartLocker,
  })),
)

/** The Heart Locker route is only reachable while the locker is unlocked. */
function HeartLockerRoute() {
  const { isUnlocked } = useHeartLocker()
  return isUnlocked ? <HeartLocker /> : <Navigate to="/journey" replace />
}

function SectionLoading() {
  return (
    <main className="flex min-h-svh items-center justify-center px-5 text-starlight">
      <p className="type-script text-glow text-moon">
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
    <CinematicTransitionProvider>
      <HeartLockerProvider>
        {/* overflow-x-clip (not hidden): clips without creating a scroll container,
            so position:sticky keeps working inside the Heart Locker scroll cinema. */}
        <div className="relative min-h-svh overflow-x-clip">
          <AmbientBackground />
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
                      <Route path="/heart-locker" element={<HeartLockerRoute />} />
                      <Route path="*" element={<Navigate to="/journey" replace />} />
                    </Routes>
                  </Suspense>
                </ScreenTransition>
              ) : (
                <ScreenTransition screenKey="login" variant="fade">
                  <LoginScreen onUnlock={handleUnlock} />
                </ScreenTransition>
              )}
            </AnimatePresence>
            {isUnlocked && location.pathname !== '/' ? <FloatingHeartMenu /> : null}
            {isUnlocked ? <FullscreenToggle /> : null}
            {isUnlocked ? <HeartLockerPrompt /> : null}
            {isUnlocked ? <ChapterCurtain /> : null}
          </div>
        </div>
      </HeartLockerProvider>
    </CinematicTransitionProvider>
  )
}

export default App
