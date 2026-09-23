<script setup lang="ts">
import CaseCard from '@/components/ui/CaseCard.vue'
import GlowButton from '@/components/ui/GlowButton.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { featuredProjects, identity } from '@/content'
import { defineAsyncComponent } from 'vue'

const HeroScene = defineAsyncComponent(() => import('@/components/three/HeroScene.vue'))

usePageTitle('')
const reduced = usePrefersReducedMotion()
const featured = featuredProjects()
</script>

<template>
  <section class="home">
    <div class="home__stage">
      <HeroScene :reduced="reduced" />
      <div class="home__vignette" />

      <div class="home__hud">
        <p class="kicker">Portfolio</p>
        <h1>{{ identity.name }}</h1>
        <p class="home__role">{{ identity.role }}</p>
        <p class="home__summary">{{ identity.summary }}</p>
        <div class="home__cta">
          <GlowButton to="/work">Work</GlowButton>
          <GlowButton to="/contact" variant="magenta">Contact</GlowButton>
        </div>
      </div>
    </div>

    <div class="home__strip">
      <div class="home__strip-head">
        <p class="kicker">featured</p>
        <RouterLink to="/work">All work →</RouterLink>
      </div>
      <div class="home__cards">
        <CaseCard v-for="project in featured" :key="project.slug" :project="project" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  overflow-x: clip;
}

.home__stage {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.home__vignette {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(var(--bg-rgb) / 0.28) 0%,
    rgb(var(--bg-rgb) / 0.72) 42%,
    var(--bg) 100%
  );
  /* backdrop-filter: blur(14px); */
  /* -webkit-backdrop-filter: blur(14px); */
}

.home__hud {
  position: relative;
  z-index: 2;
  max-width: 40rem;
  padding: calc(var(--nav-h) + 1.25rem) var(--page-pad) 2rem;
  min-width: 0;
  margin-top: auto;
  pointer-events: none;
}

.home__cta,
.home__cta :deep(a),
.home__cta :deep(button) {
  pointer-events: auto;
}

.home__hud .kicker,
.home__hud h1,
.home__role,
.home__summary {
  text-shadow:
    0 0 10px var(--bg),
    0 0 22px var(--bg),
    0 0 42px rgb(var(--bg-rgb) / 0.95),
    1px 0 0 var(--bg),
    -1px 0 0 var(--bg),
    0 1px 0 var(--bg),
    0 -1px 0 var(--bg);
}

h1 {
  margin: 0.35rem 0 0.5rem;
  font-size: clamp(2rem, 11vw, 6.2rem);
  letter-spacing: -0.04em;
  line-height: 1.08;
  color: var(--text);
  overflow-wrap: break-word;
}

.home__role {
  color: var(--earth);
  font-size: 0.98rem;
  line-height: 1.45;
}

.home__summary {
  max-width: 38rem;
  color: var(--muted);
  line-height: 1.65;
  margin: 0.85rem 0 0;
}

.home__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1.2rem;
}

.home__cta :deep(.glow-btn) {
  flex: 1 1 9rem;
}

.home__strip {
  position: relative;
  z-index: 2;
  padding: 1.5rem var(--page-pad) 2.5rem;
}

.home__strip-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.home__strip-head a {
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--earth);
  white-space: nowrap;
}

.home__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.85rem;
}

@media (min-width: 720px) {
  .home__stage {
    justify-content: flex-start;
    overflow: hidden;
    height: 100dvh;
    min-height: 100dvh;
    padding-bottom: 0;
  }

  .home__vignette {
    background: linear-gradient(
      90deg,
      var(--bg) 0%,
      rgb(var(--bg-rgb) / 0.82) 26%,
      rgb(var(--bg-rgb) / 0.2) 48%,
      transparent 68%
    );
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .home__hud {
    padding: calc(var(--nav-h) + 5vh) var(--page-pad) 0;
  }

  .home__role {
    font-size: clamp(1rem, 2vw, 1.2rem);
  }

  .home__strip {
    padding: 2rem var(--page-pad) 3rem;
  }
}

@media (min-width: 980px) {
  .home__cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
