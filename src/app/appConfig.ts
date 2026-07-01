export const appConfig = {
  storageKeys: {
    softGateUnlocked: 'our-little-universe:phase-one-unlocked',
    /** Per-tab (sessionStorage) expiry timestamp for the revealed Heart Locker card. */
    heartLockerRevealedUntil: 'our-little-universe:heart-locker-revealed',
    /** Per-tab (sessionStorage) flag: the password has been entered this session. */
    heartLockerEntered: 'our-little-universe:heart-locker-entered',
  },
  timings: {
    loginUnlockDelayMs: 850,
    screenTransitionSeconds: 0.55,
    heartLockerUnlockMs: 30 * 60 * 1000,
    heartLockerHoldMs: 5000,
  },
} as const
