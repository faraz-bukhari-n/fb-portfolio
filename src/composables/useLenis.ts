import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted, watchEffect } from 'vue'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export function useLenis(enabled: () => boolean) {
  const reduced = usePrefersReducedMotion()
  let lenis: Lenis | undefined
  let ticker: ((time: number) => void) | undefined

  function stop() {
    if (ticker) gsap.ticker.remove(ticker)
    ticker = undefined
    lenis?.destroy()
    lenis = undefined
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  }

  function start() {
    if (lenis) return
    lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenis.on('scroll', ScrollTrigger.update)
    ticker = (time: number) => {
      lenis?.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
  }

  watchEffect((onCleanup) => {
    if (reduced.value || !enabled()) {
      stop()
      return
    }
    start()
    onCleanup(stop)
  })

  onUnmounted(stop)
}
