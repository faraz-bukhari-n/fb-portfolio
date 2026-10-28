<script setup lang="ts">
import { identity } from '@/content'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')
const open = ref(false)

const catalog = [
  { cmd: 'work', hint: 'selected products' },
  { cmd: 'experience', hint: 'timeline + map' },
  { cmd: 'career', hint: 'career highlights' },
  { cmd: 'skills', hint: 'skills universe' },
  { cmd: 'contact', hint: 'email / phone' },
  { cmd: 'resume', hint: 'print-ready CV' },
  { cmd: 'hire', hint: 'scroll to reach me' },
  { cmd: 'github', hint: 'open GitHub' },
] as const

const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return [...catalog]
  return catalog.filter((item) => item.cmd.startsWith(q) || item.hint.includes(q))
})

function run(cmd = matches.value[0]?.cmd) {
  if (!cmd) return
  query.value = ''
  open.value = false
  if (cmd === 'work') router.push('/work')
  else if (cmd === 'experience') router.push('/experience')
  else if (cmd === 'career') router.push('/highlights')
  else if (cmd === 'skills') router.push({ path: '/', hash: '#skills' })
  else if (cmd === 'contact' || cmd === 'hire') router.push({ path: '/', hash: '#contact' })
  else if (cmd === 'resume') router.push(identity.resumePath)
  else if (cmd === 'github') {
    const href = identity.socials.find((item) => item.id === 'github')?.href
    if (href) window.open(href, '_blank', 'noreferrer')
  }
}
</script>

<template>
  <div class="cmd" :class="{ 'is-open': open }">
    <label class="cmd__label" for="home-cmd">
      <span class="cmd__prompt">~/faraz</span>
      <span class="cmd__caret">❯</span>
    </label>
    <input
      id="home-cmd"
      v-model="query"
      type="text"
      autocomplete="off"
      spellcheck="false"
      placeholder="work · career · skills · hire"
      @focus="open = true"
      @blur="open = false"
      @keydown.enter.prevent="run()"
      @keydown.escape.prevent="open = false"
    />
    <ul v-if="open && matches.length" class="cmd__list">
      <li v-for="item in matches" :key="item.cmd">
        <button type="button" @mousedown.prevent="run(item.cmd)">
          <code>{{ item.cmd }}</code>
          <span>{{ item.hint }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.cmd {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  max-width: 34rem;
  padding: 0.15rem 0.15rem 0.15rem 0.85rem;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--bg-elev);
  box-shadow: var(--glow-cyan);
}

.cmd.is-open {
  border-color: var(--olive);
}

.cmd__label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 0.72rem;
}

.cmd__prompt {
  color: var(--olive);
}

.cmd__caret {
  color: var(--earth);
}

.cmd input {
  border: 0;
  background: transparent;
  padding: 0.72rem 0.7rem 0.72rem 0;
  box-shadow: none;
  font-family: var(--font-mono);
  font-size: 0.86rem;
}

.cmd input:hover,
.cmd input:focus {
  border: 0;
  box-shadow: none;
}

.cmd__list {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.4rem);
  z-index: 4;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--bg-elev);
  box-shadow: var(--glow-cyan);
}

.cmd__list button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.6rem;
  border-radius: var(--radius-sm);
  text-align: left;
}

.cmd__list button:hover {
  background: var(--bg-elev-2);
}

.cmd__list code {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--olive);
}

.cmd__list span {
  font-size: 0.78rem;
  color: var(--muted);
}
</style>
