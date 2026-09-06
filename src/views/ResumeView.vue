<script setup lang="ts">
import PageFrame from '@/components/ui/PageFrame.vue'
import TerminalHeading from '@/components/ui/TerminalHeading.vue'
import { usePageTitle } from '@/composables/usePageTitle'
import { education, experience, identity, projects, skillGroupLabel, skills } from '@/content'

usePageTitle('Resume')

function printPage() {
  window.print()
}
</script>

<template>
  <PageFrame>
    <div class="resume-bar no-print">
      <TerminalHeading index="CV" kicker="print">Resume</TerminalHeading>
      <button type="button" class="print-btn" @click="printPage">Print / save PDF</button>
    </div>

    <header class="resume-head">
      <div>
        <h1>{{ identity.name }}</h1>
        <p>{{ identity.role }}</p>
      </div>
      <ul>
        <li>{{ identity.location }}</li>
        <li>{{ identity.email }}</li>
        <li v-for="social in identity.socials" :key="social.id">
          <a :href="social.href">{{ social.label }}</a>
        </li>
      </ul>
    </header>

    <p class="summary">{{ identity.summary }}</p>

    <section>
      <h2>Education</h2>
      <article v-for="item in education" :key="item.id" class="role">
        <div class="role__meta">
          <strong>{{ item.degree }}</strong>
          <span>{{ item.start }} — {{ item.end }}</span>
        </div>
        <p>{{ item.org }} · {{ item.location }}</p>
        <p v-if="item.gpa || item.honors">
          {{ [item.gpa, item.honors].filter(Boolean).join(' · ') }}
        </p>
        <p>{{ item.focus.join(' · ') }}</p>
      </article>
    </section>

    <section>
      <h2>Experience</h2>
      <article v-for="role in experience" :key="role.id" class="role">
        <div class="role__meta">
          <strong>{{ role.title }}</strong>
          <span>{{ role.start }} — {{ role.end }}</span>
        </div>
        <p>{{ role.org }} · {{ role.location }}</p>
        <ul>
          <li v-for="bullet in role.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
        <p>{{ role.stack.join(' · ') }}</p>
      </article>
    </section>

    <section>
      <h2>Selected work</h2>
      <article v-for="project in projects" :key="project.slug" class="role">
        <div class="role__meta">
          <strong>{{ project.title }}</strong>
          <span>{{ project.year }}</span>
        </div>
        <p>{{ project.summary }}</p>
        <p v-if="project.href">
          <a :href="project.href" target="_blank" rel="noreferrer">Live product ↗</a>
        </p>
      </article>
    </section>

    <section>
      <h2>Skills</h2>
      <p v-for="group in (['fullstack', 'webgis', 'leadership', 'cloud'] as const)" :key="group" class="skill-line">
        <span>{{ skillGroupLabel[group] }}</span>
        {{ skills.filter((skill) => skill.group === group).map((skill) => skill.name).join(' · ') }}
      </p>
    </section>
  </PageFrame>
</template>

<style scoped>
.resume-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.print-btn {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--cyan);
  color: var(--cyan);
  padding: 0.5rem 0.8rem;
  margin-top: 0.4rem;
}

.resume-head {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--line);
  padding-top: 1.4rem;
}

h1 {
  margin: 0;
  font-size: clamp(1.7rem, 8vw, 2.4rem);
  letter-spacing: -0.04em;
}

.resume-head p,
.resume-head li {
  margin: 0.25rem 0 0;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: 0.82rem;
  overflow-wrap: anywhere;
}

.resume-head ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.role__meta {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem 1rem;
  flex-wrap: wrap;
}

.skill-line span {
  display: block;
  margin-bottom: 0.15rem;
  color: var(--magenta);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 720px) {
  .resume-head ul {
    text-align: right;
  }

  .skill-line span {
    display: inline-block;
    min-width: 8.5rem;
    margin-bottom: 0;
  }
}

.summary {
  max-width: 44rem;
  color: var(--muted);
  line-height: 1.65;
}

h2 {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cyan);
  border-bottom: 1px solid var(--line);
  padding-bottom: 0.4rem;
}

.role {
  margin: 1rem 0 1.4rem;
}

.role p,
.role li {
  color: var(--muted);
  line-height: 1.55;
}

.skill-line {
  color: var(--muted);
  line-height: 1.6;
}

@media print {
  h1,
  h2,
  strong {
    color: #111;
  }
}
</style>
