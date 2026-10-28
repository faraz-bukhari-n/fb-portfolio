import { identity } from '@/content'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export type ContributionDay = {
  date: string
  count: number
  level: ContributionLevel
}

type ApiResponse = {
  total?: Record<string, number>
  contributions?: Array<{
    date?: string
    count?: number
    level?: number
  }>
  error?: string
}

const API = 'https://github-contributions-api.jogruber.de/v4'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function githubUsernameFromHref(href: string): string {
  try {
    return new URL(href).pathname.split('/').filter(Boolean)[0] ?? ''
  } catch {
    return ''
  }
}

export function githubProfile(href?: string) {
  const link = href ?? identity.socials.find((item) => item.id === 'github')?.href ?? ''
  const username = githubUsernameFromHref(link)
  return { href: link, username }
}

export function githubAvatarUrl(size = 80) {
  const { username } = githubProfile()
  return username ? `https://github.com/${username}.png?size=${size}` : ''
}

function clampLevel(value: number | undefined): ContributionLevel {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value
  return 0
}

function utcParts(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return { year, month: (month ?? 1) - 1, day: day ?? 1 }
}

export function weekdaySunday(date: string): number {
  const { year, month, day } = utcParts(date)
  return new Date(Date.UTC(year, month, day)).getUTCDay()
}

export function formatContributionDate(date: string): string {
  const { year, month, day } = utcParts(date)
  return new Date(Date.UTC(year, month, day)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function contributionLabel(day: ContributionDay): string {
  const when = formatContributionDate(day.date)
  if (day.count === 1) return `1 contribution on ${when}`
  return `${day.count.toLocaleString('en-US')} contributions on ${when}`
}

export function toWeeks(days: ContributionDay[]): ContributionDay[][] {
  if (!days.length) return []

  const weeks: ContributionDay[][] = []
  let week: ContributionDay[] = []
  const pad = weekdaySunday(days[0].date)
  for (let i = 0; i < pad; i += 1) {
    week.push({ date: '', count: 0, level: 0 })
  }

  for (const day of days) {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  if (week.length) {
    while (week.length < 7) week.push({ date: '', count: 0, level: 0 })
    weeks.push(week)
  }

  return weeks
}

export function monthLabels(weeks: ContributionDay[][]): string[] {
  const labels = weeks.map(() => '')
  let previous = -1

  weeks.forEach((week, index) => {
    const first = week.find((day) => day.date)
    if (!first) return
    const month = utcParts(first.date).month
    if (month === previous) return
    previous = month
    labels[index] = MONTHS[month] ?? ''
    if (index > 0 && labels[index - 1]) labels[index - 1] = ''
  })

  return labels
}

export type ContributionRange = 'last' | number

function parseDays(data: ApiResponse): ContributionDay[] {
  return (data.contributions ?? [])
    .filter((item): item is { date: string; count?: number; level?: number } => Boolean(item.date))
    .map((item) => ({
      date: item.date,
      count: item.count ?? 0,
      level: clampLevel(item.level),
    }))
}

function yearKeys(total: Record<string, number> | undefined): number[] {
  return Object.keys(total ?? {})
    .filter((key) => /^\d{4}$/.test(key))
    .map(Number)
    .sort((a, b) => b - a)
}

function sumDays(list: ContributionDay[]): number {
  return list.reduce((sum, day) => sum + day.count, 0)
}

export function useGithubContributions() {
  const profile = githubProfile()
  const days = ref<ContributionDay[]>([])
  const total = ref(0)
  const totals = ref<Record<string, number>>({})
  const years = ref<number[]>([])
  const selected = ref<ContributionRange>('last')
  const loading = ref(Boolean(profile.username))
  const switching = ref(false)
  const error = ref<string | null>(profile.username ? null : 'No GitHub profile linked.')

  const weeks = computed(() => toWeeks(days.value))
  const months = computed(() => monthLabels(weeks.value))
  const currentYear = new Date().getUTCFullYear()
  const rangeLabel = computed(() =>
    selected.value === 'last' ? 'in the last year' : `in ${selected.value}`,
  )

  const cache = new Map<string, ContributionDay[]>()
  let abort: AbortController | undefined
  let allAbort: AbortController | undefined

  function rememberTotals(next: Record<string, number> | undefined) {
    if (!next) return
    totals.value = { ...totals.value, ...next }
    const keys = yearKeys(totals.value)
    if (keys.length) years.value = keys
  }

  function show(key: ContributionRange, list: ContributionDay[]) {
    days.value = list
    if (key === 'last') {
      total.value = totals.value.lastYear ?? sumDays(list)
    } else {
      total.value = totals.value[String(key)] ?? sumDays(list)
    }
  }

  async function fetchRange(
    key: ContributionRange | 'all',
    controller: AbortController,
    timeoutMs: number,
  ) {
    const query = key === 'all' ? '' : `?y=${key}`
    let timedOut = false
    const timer = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)

    try {
      const response = await fetch(`${API}/${profile.username}${query}`, { signal: controller.signal })
      const data = (await response.json()) as ApiResponse
      if (!response.ok) {
        throw new Error(data.error || `GitHub contributions failed (${response.status})`)
      }
      const next = parseDays(data)
      rememberTotals(data.total)
      cache.set(String(key), next)
      if (key === 'all') {
        yearKeys(data.total).forEach((year) => {
          if (!cache.has(String(year))) {
            cache.set(
              String(year),
              next.filter((day) => day.date.startsWith(`${year}-`)),
            )
          }
        })
      }
      return next
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError' && !timedOut) {
        return null
      }
      throw err
    } finally {
      window.clearTimeout(timer)
    }
  }

  async function load() {
    if (!profile.username) return

    abort?.abort()
    allAbort?.abort()
    abort = new AbortController()
    allAbort = new AbortController()
    loading.value = true
    error.value = null
    if (!years.value.length) years.value = [currentYear]

    const lastPromise = fetchRange('last', abort, 8000)
    const allPromise = fetchRange('all', allAbort, 12000)

    try {
      const last = await lastPromise
      if (last) {
        selected.value = 'last'
        show('last', last)
      } else if (!days.value.length) {
        throw new Error('empty')
      }
    } catch {
      days.value = []
      total.value = 0
      error.value = 'Couldn’t load the contribution graph.'
    } finally {
      loading.value = false
    }

    try {
      await allPromise
    } catch {
      // Year tabs stay at whatever we already have from the last-year payload.
    }
  }

  async function selectYear(year: ContributionRange) {
    if (!profile.username || year === selected.value) return

    const cached = cache.get(String(year))
    if (cached) {
      selected.value = year
      show(year, cached)
      return
    }

    abort?.abort()
    abort = new AbortController()
    switching.value = true
    error.value = null
    try {
      const next = await fetchRange(year, abort, 8000)
      if (!next) return
      selected.value = year
      show(year, next)
    } catch {
      error.value = 'Couldn’t load that year.'
    } finally {
      switching.value = false
    }
  }

  function isYearOn(year: number) {
    if (selected.value === 'last') return year === (years.value[0] ?? currentYear)
    return selected.value === year
  }

  onMounted(load)
  onUnmounted(() => {
    abort?.abort()
    allAbort?.abort()
  })

  return {
    username: profile.username,
    href: profile.href,
    days,
    weeks,
    months,
    total,
    years,
    selected,
    rangeLabel,
    loading,
    switching,
    error,
    selectYear,
    isYearOn,
  }
}
