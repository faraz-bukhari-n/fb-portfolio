<script setup lang="ts">
import CareerClimb from '@/components/game/CareerClimb.vue'
import CaseCard from '@/components/ui/CaseCard.vue'
import ChamferLink from '@/components/ui/ChamferLink.vue'
import GlowButton from '@/components/ui/GlowButton.vue'
import HeroEditor from '@/components/ui/HeroEditor.vue'
import WindowPane from '@/components/ui/WindowPane.vue'
import GithubContributions from '@/components/viz/GithubContributions.vue'
import HighlightCard from '@/components/viz/HighlightCard.vue'
import SkillsShowcase from '@/components/viz/SkillsShowcase.vue'
import { githubAvatarUrl } from '@/composables/useGithubContributions'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { featuredHighlights, featuredProjects, identity } from '@/content'
import { useClipboard } from '@vueuse/core'
import { computed, ref } from 'vue'

usePageTitle('')
const reduced = usePrefersReducedMotion()
const { copy, copied } = useClipboard({ source: identity.email })
const sender = ref('')
const message = ref('')

const mailto = computed(() => {
  const subject = encodeURIComponent(`Hello from the portfolio, ${sender.value || 'there'}`)
  const body = encodeURIComponent(message.value || identity.availability)
  return `mailto:${identity.email}?subject=${subject}&body=${body}`
})

function openMail() {
  window.location.href = mailto.value
}

const github = identity.socials.find((item) => item.id === 'github')
const localAvatar = `${import.meta.env.BASE_URL}avatar.jpg`.replace(/\/{2,}/g, '/')
const photo = ref(githubAvatarUrl(160) || localAvatar)

function onPhotoError() {
  if (photo.value !== localAvatar) photo.value = localAvatar
}

const stats = [
  { value: '08', label: 'years building' },
  { value: '20+', label: 'projects shipped' },
  { value: '18', label: 'people led' },
  { value: 'PERN', label: 'primary stack' },
]

const stack = ['React', 'Node', 'Postgres', 'Socket.io', 'Temporal', 'Bedrock']
const featuredWork = featuredProjects().slice(0, 3)
const featuredCareer = featuredHighlights()
</script>

<template>
  <section class="home page-grid">
    <header id="hero" class="home__hero" :class="{ 'is-static': reduced }">
      <div class="home__intro">
        <div class="home__identity hero-in" style="--d: 0s">
          <img
            class="home__photo"
            :src="photo"
            :alt="identity.name"
            width="96"
            height="96"
            @error="onPhotoError"
          />
          <div class="home__identity-copy">
            <p class="home__kernel">
              <span class="home__kernel-dot" aria-hidden="true"><i /></span>
              SYSTEM.KERNEL :: v8.0 ONLINE
            </p>
            <h1 :aria-label="`Hello I'm ${identity.name}`">
              <span class="home__hello">Hello I'm</span>
              <span class="home__name">{{ identity.name }}</span>
            </h1>
            <p class="home__role">
              <em>&lt;SeniorFullStack /&gt;</em>
              <span>// Team Lead · WebGIS</span>
            </p>
          </div>
        </div>
        <p class="home__summary hero-in" style="--d: 0.3s">{{ identity.summary }}</p>
        <div class="home__cta-row hero-in is-fade" style="--d: 0.4s">
          <ChamferLink class="home__wget" :to="identity.resumePath" tall fill glow="cool">
            <span class="home__wget-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </span>
            <span class="home__wget-body">
              <span class="home__wget-top">
                <strong>Download Resume</strong>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </span>
              <span class="home__wget-bar" aria-hidden="true"><i class="home__wget-fill" /></span>
              <span class="home__wget-meta">
                <small>&gt; wget resume.pdf</small>
                <em>PDF</em>
              </span>
            </span>
          </ChamferLink>
          <ChamferLink v-if="github" class="home__git" :href="github.href" tall glow="warm">
            <svg class="home__git-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span class="home__git-copy">
              <small>Check out</small>
              <strong>GitHub</strong>
            </span>
          </ChamferLink>
        </div>
        <p class="home__loaded hero-in" style="--d: 0.5s">
          <span>LOADED_MODULES:</span>
          <b v-for="(item, index) in stack" :key="item" :style="{ '--d': `${0.05 * index}s` }">{{ item }}</b>
        </p>
        <p class="home__loop hero-in" style="--d: 0.6s">
          while (shipping) { lead() }<i />
        </p>
      </div>
      <HeroEditor :reduced="reduced" />
    </header>

    <WindowPane title="metrics.json" prompt="$ cat">
      <ul class="home__stats">
        <li v-for="stat in stats" :key="stat.label">
          <b>{{ stat.value }}</b>
          <span>{{ stat.label }}</span>
        </li>
      </ul>
    </WindowPane>

    <div id="commits" class="home__commits">
      <p class="home__section">
        <span>&gt;_</span>
        $ git log
      </p>
      <WindowPane title="contributions.grid" prompt="$ git">
        <GithubContributions />
      </WindowPane>
    </div>

    <div id="highlights" class="home__highlights">
      <div class="home__highlights-head">
        <p class="home__section">
          <span>&gt;_</span>
          $ cat highlights.md
        </p>
        <GlowButton to="/highlights" variant="ghost">View all highlights</GlowButton>
      </div>
      <div class="home__highlights-grid">
        <HighlightCard v-for="item in featuredCareer" :key="item.id" :highlight="item" />
      </div>
    </div>

    <div id="skills" class="home__skills">
      <h2 class="home__skills-title">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2" />
            <path d="M15 20v2" />
            <path d="M20 15h2" />
            <path d="M20 9h2" />
            <path d="M2 15h2" />
            <path d="M2 9h2" />
            <path d="M9 2v2" />
            <path d="M9 20v2" />
          </svg>
        </span>
        # Skills.json
      </h2>
      <SkillsShowcase />
    </div>

    <div id="climb" class="home__play">
      <p class="home__section">
        <span>&gt;_</span>
        $ ./career-climb
      </p>
      <WindowPane title="career-climb.ts" prompt="$ drive" flush>
        <CareerClimb :reduced="reduced" />
      </WindowPane>
    </div>

    <div class="home__work">
      <div class="home__work-head">
        <p class="home__section">
          <span>&gt;_</span>
          $ ls ~/work
        </p>
        <GlowButton to="/work" variant="ghost">View all work</GlowButton>
      </div>
      <div class="home__work-grid">
        <CaseCard v-for="project in featuredWork" :key="project.slug" :project="project" />
      </div>
    </div>

    <div id="contact" class="home__reach">
      <p class="home__section">
        <span>&gt;_</span>
        $ ./contact
      </p>
      <p class="home__avail">{{ identity.availability }}</p>
      <div class="home__reach-grid">
        <WindowPane title="contact.json" prompt="open_to_work">
          <pre class="home__json"><code><span class="k">status</span>: <span class="s">"open"</span>
<span class="k">role</span>: <span class="s">"team_lead"</span>
<span class="k">location</span>: <span class="s">"{{ identity.location }}"</span>
<span class="k">email</span>: <span class="s">"{{ identity.email }}"</span>
<span class="k">phone</span>: <span class="s">"{{ identity.phone }}"</span></code></pre>
          <a class="home__email" :href="`mailto:${identity.email}`">{{ identity.email }}</a>
          <a v-if="identity.phone" class="home__phone" :href="`tel:${identity.phone}`">{{ identity.phone }}</a>
          <div class="home__cta">
            <GlowButton variant="ghost" @click="copy()">{{ copied ? 'Copied' : 'Copy email' }}</GlowButton>
            <GlowButton :to="identity.resumePath">Resume</GlowButton>
          </div>
          <ul class="home__socials">
            <li v-for="social in identity.socials" :key="social.id">
              <a :href="social.href" target="_blank" rel="noreferrer">{{ social.label }} ↗</a>
            </li>
          </ul>
        </WindowPane>
        <WindowPane title="compose.tsx" prompt="$ send">
          <form class="home__compose" @submit.prevent="openMail">
            <label>
              Name
              <input v-model="sender" type="text" autocomplete="name" placeholder="NAME" />
            </label>
            <label>
              Message
              <textarea v-model="message" rows="5" placeholder="MESSAGE" />
            </label>
            <GlowButton :href="mailto">Open mail client</GlowButton>
          </form>
        </WindowPane>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home {
  padding: calc(var(--nav-h) + 1.4rem) var(--page-pad) 4rem;
  display: grid;
  gap: 3.2rem;
}

.home__hero {
  position: relative;
  display: grid;
  gap: 2rem;
  align-items: start;
  padding-top: 1.2rem;
  overflow: visible;
  scroll-margin-top: calc(var(--nav-h) + 0.6rem);
}

.hero-in {
  animation: slideUp 0.6s ease-out both;
  animation-delay: var(--d, 0s);
}

.hero-in.is-fade {
  animation-name: fadeIn;
}

.home__badge {
  position: absolute;
  top: 0.4rem;
  right: 0;
  z-index: 2;
  width: 2.4rem;
  height: 2.4rem;
  display: grid;
  place-items: center;
  border: 1px dashed var(--earth);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--earth);
  animation: float 4s ease-in-out infinite;
}

.home__intro {
  display: grid;
  justify-items: start;
  gap: 0.9rem;
  min-width: 0;
}

.home__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.15rem;
  min-width: 0;
}

.home__photo {
  width: clamp(4.6rem, 11vw, 7rem);
  height: clamp(4.6rem, 11vw, 7rem);
  flex-shrink: 0;
  border: 2px solid rgb(var(--olive-rgb) / 0.45);
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 0 0 4px rgb(var(--cyan-rgb) / 0.12);
}

.home__identity-copy {
  display: grid;
  justify-items: start;
  gap: 0.7rem;
  min-width: 0;
}

.home__kernel {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.38rem 0.85rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.3);
  border-radius: 999px;
  background: rgb(var(--olive-rgb) / 0.08);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--olive);
  animation-name: fadeIn;
  animation-duration: 0.8s;
}

.home__kernel-dot {
  position: relative;
  width: 0.4rem;
  height: 0.4rem;
  flex-shrink: 0;
}

.home__kernel-dot i {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: var(--olive);
  animation: pulse 2s ease-in-out infinite;
}

.home__kernel-dot::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--olive);
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.home__hero h1 {
  display: grid;
  gap: 0.05em;
  margin: 0;
  font-size: clamp(1.9rem, 6vw, 4rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.home__hello {
  color: var(--text);
}

.home__name {
  width: max-content;
  max-width: 100%;
  background: linear-gradient(90deg, var(--olive) 0%, var(--cyan) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  letter-spacing: -0.045em;
}

.home__role {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.7rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.92rem;
}

.home__role em {
  font-style: normal;
  color: var(--cyan);
}

.home__role span {
  color: var(--muted);
}

.home__summary {
  margin: 0;
  max-width: 32rem;
  color: var(--muted);
  line-height: 1.7;
  font-family: var(--font-mono);
  font-size: 0.84rem;
}

.home__cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: 0.9rem;
  width: 100%;
  max-width: 36rem;
  margin-top: 0.15rem;
}

.home__wget {
  flex: 1 1 16rem;
}

.home__wget :deep(.cut__face) {
  justify-content: flex-start;
}

.home__wget-icon {
  width: 2.5rem;
  height: 2.5rem;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 4px;
  border: 1px solid rgb(var(--olive-rgb) / 0.22);
  background: rgb(var(--olive-rgb) / 0.1);
  color: var(--olive);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.home__wget-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.home__wget:hover .home__wget-icon {
  border-color: rgb(var(--olive-rgb) / 0.5);
  transform: scale(1.05);
}

.home__wget-body {
  display: grid;
  gap: 0.28rem;
  min-width: 0;
  flex: 1;
}

.home__wget-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.home__wget-top strong {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text);
  transition: color 0.2s ease;
}

.home__wget-top svg {
  width: 0.75rem;
  height: 0.75rem;
  flex-shrink: 0;
  color: var(--muted);
  transition: color 0.2s ease;
}

.home__wget:hover .home__wget-top strong,
.home__wget:hover .home__wget-top svg {
  color: var(--olive);
}

.home__wget-bar {
  display: block;
  height: 4px;
  border-radius: 99px;
  background: rgb(var(--text-rgb) / 0.12);
  overflow: hidden;
}

.home__wget-fill {
  display: block;
  width: 60%;
  height: 100%;
  border-radius: 99px;
  background: var(--olive);
  position: relative;
  overflow: hidden;
  transition: width 0.7s ease-out;
}

.home__wget-fill::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgb(255 255 255 / 0.3);
  animation: pulse 2s ease-in-out infinite;
}

.home__wget:hover .home__wget-fill {
  width: 90%;
}

.home__wget-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.58rem;
  color: var(--muted);
}

.home__wget-meta em {
  font-style: normal;
  color: var(--olive);
}

.home__wget:hover .home__wget-meta em {
  animation: pulse 1s ease-in-out infinite;
}

.home__git {
  flex: 0 0 auto;
  min-width: 7.5rem;
}

.home__git-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text);
  transition: color 0.2s ease;
}

.home__git-copy {
  display: grid;
  gap: 0.15rem;
  text-align: left;
}

.home__git-copy small {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1;
  color: var(--muted);
}

.home__git-copy strong {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text);
  transition: color 0.2s ease;
}

.home__git:hover .home__git-icon,
.home__git:hover .home__git-copy strong {
  color: var(--cyan);
}

.home__loaded {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  animation-name: fadeIn;
  animation-duration: 0.8s;
}

.home__loaded b {
  padding: 0.18rem 0.5rem;
  border: 1px solid rgb(var(--olive-rgb) / 0.22);
  border-radius: 4px;
  background: rgb(var(--olive-rgb) / 0.1);
  font-weight: 500;
  color: var(--olive);
  animation: fadeIn 0.3s ease-out both;
  animation-delay: var(--d, 0s);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.home__loaded b:nth-of-type(even) {
  border-color: rgb(var(--cyan-rgb) / 0.28);
  background: rgb(var(--cyan-rgb) / 0.1);
  color: var(--cyan);
}

.home__loaded b:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgb(var(--olive-rgb) / 0.3);
}

.home__loaded b:nth-of-type(even):hover {
  box-shadow: 0 0 8px rgb(var(--cyan-rgb) / 0.3);
}

.home__loop {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-style: italic;
  color: rgb(var(--text-rgb) / 0.45);
  animation-name: fadeIn;
}

.home__loop i {
  width: 0.45rem;
  height: 0.95em;
  background: var(--earth);
  animation: blink 1s step-end infinite;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.home__hero.is-static .hero-in,
.home__hero.is-static .home__loaded b,
.home__hero.is-static .home__badge,
.home__hero.is-static .home__kernel-dot i,
.home__hero.is-static .home__kernel-dot::after,
.home__hero.is-static .home__wget-fill::after,
.home__hero.is-static .home__loop i {
  animation: none !important;
  opacity: 1;
  transform: none;
}

.home__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.2rem;
}

.home__play,
.home__commits,
.home__skills {
  scroll-margin-top: calc(var(--nav-h) + 0.8rem);
}

.home__skills-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin: 0 0 1.6rem;
  font-family: var(--font-display);
  font-size: clamp(1.55rem, 4.2vw, 2.15rem);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.home__skills-title span {
  display: grid;
  color: var(--olive);
}

.home__skills-title svg {
  width: 1.75rem;
  height: 1.75rem;
}

.home__stats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.2rem;
}

.home__stats li {
  display: grid;
  gap: 0.2rem;
  padding: 0.55rem 0.4rem;
}

.home__stats b {
  font-family: var(--font-display);
  font-size: 1.55rem;
  letter-spacing: -0.04em;
}

.home__stats span {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.home__section {
  display: flex;
  align-items: baseline;
  gap: 0.55rem;
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.04em;
}

.home__section span {
  font-family: var(--font-mono);
  font-size: 0.78em;
  color: var(--earth);
}

.home__play :deep(.climb) {
  border: 0;
  border-radius: 0;
  box-shadow: none;
  background: transparent;
}

.home__highlights {
  scroll-margin-top: calc(var(--nav-h) + 1rem);
}

.home__highlights-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem 1.2rem;
  margin-bottom: 1rem;
}

.home__highlights-head .home__section {
  margin: 0;
}

.home__highlights-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}

.home__work {
  scroll-margin-top: calc(var(--nav-h) + 1rem);
}

.home__work-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem 1.2rem;
  margin-bottom: 1rem;
}

.home__work-head .home__section {
  margin: 0;
}

.home__work-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
}

.home__reach {
  scroll-margin-top: calc(var(--nav-h) + 1rem);
}

.home__reach-grid {
  display: grid;
  gap: 1.4rem;
}

.home__json {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.7;
  color: var(--muted);
  overflow-x: auto;
}

.home__json .k {
  color: var(--olive);
}

.home__json .s {
  color: var(--cyan);
}

.home__avail {
  margin: 0 0 1.4rem;
  max-width: 34rem;
  color: var(--muted);
}

.home__email {
  display: block;
  margin: 0.85rem 0 0.35rem;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 4vw, 1.85rem);
  letter-spacing: -0.04em;
  color: var(--olive);
  overflow-wrap: anywhere;
}

.home__phone {
  display: block;
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--muted);
}

.home__compose {
  display: grid;
  gap: 0.8rem;
}

.home__compose label {
  display: grid;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.home__socials {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0 0;
  padding: 0;
}

.home__socials a {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--muted);
}

.home__socials a:hover {
  color: var(--earth);
}

@media (max-width: 979px) {
  .home__hero {
    min-height: 0;
  }
}

@media (min-width: 800px) {
  .home {
    gap: 4.2rem;
    padding-bottom: 5.5rem;
  }

  .home__stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .home__work-grid,
  .home__highlights-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .home__reach-grid {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: start;
    gap: 2rem;
  }
}

@media (min-width: 980px) {
  .home__hero {
    grid-template-columns: minmax(0, 1.08fr) minmax(280px, 0.92fr);
    gap: 2.4rem 2.8rem;
    padding-top: 1.4rem;
  }
}
</style>
