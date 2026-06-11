import { AnimatePresence } from 'motion/react'
import { appConfig } from './app/appConfig'
import { LoginScreen } from './features/auth/LoginScreen'
import { OpeningHero } from './features/opening/OpeningHero'
import { AmbientBackground } from './shared/components/AmbientBackground'
import { ScreenTransition } from './shared/components/ScreenTransition'
import { usePersistentBoolean } from './shared/hooks/usePersistentBoolean'

function App() {
  const [isUnlocked, setIsUnlocked] = usePersistentBoolean(
    appConfig.storageKeys.softGateUnlocked,
  )

  function handleUnlock() {
    setIsUnlocked(true)
  }

  return (
    <div className="relative min-h-svh overflow-x-hidden">
      <AmbientBackground />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isUnlocked ? (
            <ScreenTransition screenKey="hero">
              <OpeningHero />
            </ScreenTransition>
          ) : (
            <ScreenTransition screenKey="login">
              <LoginScreen onUnlock={handleUnlock} />
            </ScreenTransition>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
