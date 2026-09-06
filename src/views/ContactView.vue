<script setup lang="ts">
import GlowButton from '@/components/ui/GlowButton.vue'
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { identity } from '@/content'
import { useClipboard } from '@vueuse/core'
import { computed, ref } from 'vue'

usePageTitle('Contact')

const name = ref('')
const message = ref('')
const { copy, copied } = useClipboard({ source: identity.email })

const mailto = computed(() => {
  const subject = encodeURIComponent(`Hello from the portfolio, ${name.value || 'there'}`)
  const body = encodeURIComponent(message.value || identity.availability)
  return `mailto:${identity.email}?subject=${subject}&body=${body}`
})

function openMail() {
  window.location.href = mailto.value
}</script>

<template>
  <PageFrame>
    <TerminalHeading index="06" kicker="signal">Contact</TerminalHeading>
    <p class="lede">{{ identity.availability }}</p>

    <div class="contact-grid">
      <section>
        <p class="kicker">direct</p>
        <a class="email" :href="`mailto:${identity.email}`">{{ identity.email }}</a>
        <div class="row">
          <GlowButton variant="ghost" @click="copy()">
            {{ copied ? 'Copied' : 'Copy email' }}
          </GlowButton>
          <GlowButton :to="identity.resumePath" variant="magenta">Resume</GlowButton>
        </div>
        <ul class="socials">
          <li v-for="social in identity.socials" :key="social.id">
            <a :href="social.href" target="_blank" rel="noreferrer">{{ social.label }} ↗</a>
          </li>
        </ul>
      </section>

      <form class="compose" @submit.prevent="openMail">
        <p class="kicker">compose</p>
        <label>
          Name
          <input v-model="name" type="text" autocomplete="name" />
        </label>
        <label>
          Message
          <textarea v-model="message" rows="5" />
        </label>
        <GlowButton :href="mailto">Open mail client</GlowButton>
      </form>
    </div>
  </PageFrame>
</template>

<style scoped>
.lede {
  color: var(--muted);
  max-width: 36rem;
  font-size: 1.1rem;
  line-height: 1.65;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
  min-width: 0;
}

.email {
  display: block;
  font-size: clamp(1.05rem, 4.5vw, 1.6rem);
  letter-spacing: -0.03em;
  color: var(--cyan);
  margin: 0.5rem 0 1rem;
  overflow-wrap: anywhere;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.socials {
  list-style: none;
  padding: 0;
  margin: 1.4rem 0 0;
}

.socials a {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--muted);
}

.socials a:hover {
  color: var(--magenta);
}

.compose {
  display: grid;
  gap: 0.8rem;
  border: 1px solid var(--line);
  padding: 1.2rem;
  background: var(--bg-elev);
}

label {
  display: grid;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

input,
textarea {
  background: var(--bg);
  border: 1px solid var(--line);
  padding: 0.65rem 0.7rem;
  color: var(--text);
}

@media (min-width: 800px) {
  .contact-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
