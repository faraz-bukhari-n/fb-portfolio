import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function luminance(hex) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function nameColor(p) {
  return luminance(p.primary) > 0.62 ? p.text : p.primary
}

const palettes = [
  {
    id: 'Light A',
    name: 'Cream + electric indigo',
    mode: 'light',
    vibe: 'Warm paper, one loud indigo. Editorial, not a dashboard.',
    pair: 'Dark A',
    bg: '#F4F3EB',
    elev: '#FFFEF8',
    elev2: '#EBE8DC',
    text: '#16151A',
    muted: '#6F6B62',
    line: '#DDD8C8',
    primary: '#6A15FF',
    accent: '#4C1D95',
    onPrimary: '#F4F3EB',
  },
  {
    id: 'Light B',
    name: 'Bone + forest',
    mode: 'light',
    vibe: 'Cartographic. Deep green on warm bone, no traffic-light green.',
    pair: 'Dark B',
    bg: '#F3EEE7',
    elev: '#FFFBF6',
    elev2: '#E8E0D4',
    text: '#1A1914',
    muted: '#6B6458',
    line: '#D9D0C4',
    primary: '#154734',
    accent: '#1F6B4A',
    onPrimary: '#F3EEE7',
  },
  {
    id: 'Light C',
    name: 'Fog + lime',
    mode: 'light',
    vibe: 'Brutalist poster. Black type, lime as the only punch.',
    pair: 'Dark B',
    bg: '#F2F1EC',
    elev: '#FFFFFF',
    elev2: '#E7E6DF',
    text: '#141412',
    muted: '#6A6A60',
    line: '#D5D4CB',
    primary: '#C8F000',
    accent: '#4A5200',
    onPrimary: '#141412',
  },
  {
    id: 'Light D',
    name: 'Stone + lake',
    mode: 'light',
    vibe: 'Survey map. Warm stone, deep lake blue — not cyan pop.',
    pair: 'Dark D',
    bg: '#EDE9E1',
    elev: '#F7F4EE',
    elev2: '#E0DBD2',
    text: '#1C1915',
    muted: '#6A645C',
    line: '#D2CCC2',
    primary: '#0B5F73',
    accent: '#0E7A8C',
    onPrimary: '#F7F4EE',
  },
  {
    id: 'Light E',
    name: 'Porcelain + wine',
    mode: 'light',
    vibe: 'Quiet luxury. Burgundy, not traffic-light red, not orange.',
    pair: 'Dark E',
    bg: '#FBF6F3',
    elev: '#FFFFFF',
    elev2: '#F1E8E4',
    text: '#1C1214',
    muted: '#7A6568',
    line: '#E8D9D5',
    primary: '#6B1D36',
    accent: '#8B2E4A',
    onPrimary: '#FBF6F3',
  },
  {
    id: 'Light F',
    name: 'Clay + indigo ink',
    mode: 'light',
    vibe: 'Studio clay. Warm ground, ink-indigo type and buttons.',
    pair: 'Dark F',
    bg: '#E8E0D4',
    elev: '#F4EEE4',
    elev2: '#DDD4C6',
    text: '#1A1612',
    muted: '#6E665C',
    line: '#CFC4B4',
    primary: '#2A2770',
    accent: '#3D3A8C',
    onPrimary: '#F4EEE4',
  },
  {
    id: 'Light G',
    name: 'Mint wash + navy',
    mode: 'light',
    vibe: 'Tinted page, not white. Navy does the work.',
    pair: 'Dark G',
    bg: '#E7F2EE',
    elev: '#F7FBFA',
    elev2: '#D5E8E2',
    text: '#0B1F2A',
    muted: '#4E6A70',
    line: '#C5D9D3',
    primary: '#0B1F2A',
    accent: '#0F6E5C',
    onPrimary: '#E7F2EE',
  },
  {
    id: 'Light H',
    name: 'Sand + steel',
    mode: 'light',
    vibe: 'Instrument panel. Warm sand, cool steel grey-blue.',
    pair: 'Dark H',
    bg: '#F1EBE3',
    elev: '#FAF7F2',
    elev2: '#E5DDD3',
    text: '#1A1814',
    muted: '#6B655C',
    line: '#D4CBC0',
    primary: '#2F4454',
    accent: '#3D5A6E',
    onPrimary: '#FAF7F2',
  },
  {
    id: 'Dark A',
    name: 'Warm black + indigo',
    mode: 'dark',
    vibe: 'Brown-black canvas, electric indigo. Not cool navy.',
    pair: 'Light A',
    bg: '#12100E',
    elev: '#1C1916',
    elev2: '#26221E',
    text: '#F4F1EA',
    muted: '#9A9488',
    line: '#322E28',
    primary: '#8B7CFF',
    accent: '#A99BFF',
    onPrimary: '#12100E',
  },
  {
    id: 'Dark B',
    name: 'Olive night + lime',
    mode: 'dark',
    vibe: 'Terminal, but green-black. Lime is the only light.',
    pair: 'Light C',
    bg: '#12140E',
    elev: '#1A1D14',
    elev2: '#24281A',
    text: '#EEF2E4',
    muted: '#9AA18A',
    line: '#32361F',
    primary: '#C6F542',
    accent: '#D4FF6B',
    onPrimary: '#12140E',
  },
  {
    id: 'Dark C',
    name: 'Bone on black',
    mode: 'dark',
    vibe: 'Ivory buttons on true black. Indigo only as a link.',
    pair: 'Light A',
    bg: '#0B0B0C',
    elev: '#161617',
    elev2: '#202022',
    text: '#F4F3EB',
    muted: '#9A9990',
    line: '#2C2C2E',
    primary: '#F4F3EB',
    accent: '#8B7CFF',
    onPrimary: '#0B0B0C',
  },
  {
    id: 'Dark D',
    name: 'Tide',
    mode: 'dark',
    vibe: 'Green-black water, not slate-navy. One sea-glass accent.',
    pair: 'Light D',
    bg: '#061614',
    elev: '#0C221E',
    elev2: '#14302B',
    text: '#E4F4F0',
    muted: '#7EA8A0',
    line: '#1A3C36',
    primary: '#5FE3C0',
    accent: '#8BEEC8',
    onPrimary: '#061614',
  },
  {
    id: 'Dark E',
    name: 'Wine night',
    mode: 'dark',
    vibe: 'Plum black, dusty rose. Not coral, not orange.',
    pair: 'Light E',
    bg: '#140C0F',
    elev: '#1E1216',
    elev2: '#2A1A20',
    text: '#F6EBEF',
    muted: '#B09098',
    line: '#3A242C',
    primary: '#E8A0B4',
    accent: '#F0C4D0',
    onPrimary: '#140C0F',
  },
  {
    id: 'Dark F',
    name: 'Eggplant',
    mode: 'dark',
    vibe: 'Violet-black studio. Lilac type, no cyan.',
    pair: 'Light F',
    bg: '#140E1C',
    elev: '#1C1428',
    elev2: '#281C36',
    text: '#F0E8FF',
    muted: '#A090B8',
    line: '#342646',
    primary: '#C4B5FD',
    accent: '#DDD6FE',
    onPrimary: '#140E1C',
  },
  {
    id: 'Dark G',
    name: 'Forest dim',
    mode: 'dark',
    vibe: 'Night canopy. Soft mint on deep green-black.',
    pair: 'Light B or Light G',
    bg: '#0E1610',
    elev: '#15201A',
    elev2: '#1C2A22',
    text: '#E6F4EA',
    muted: '#8AAD94',
    line: '#24362C',
    primary: '#8BE0A8',
    accent: '#B4F0C8',
    onPrimary: '#0E1610',
  },
  {
    id: 'Dark H',
    name: 'Steel night',
    mode: 'dark',
    vibe: 'Instrument grey. Cool metal, no neon.',
    pair: 'Light H',
    bg: '#101418',
    elev: '#181E24',
    elev2: '#222A32',
    text: '#E6EEF2',
    muted: '#8A9AA6',
    line: '#2A343C',
    primary: '#8FB4C8',
    accent: '#B4D0DC',
    onPrimary: '#101418',
  },
]

const roles = [
  ['bg', 'bg'],
  ['elev', 'elev'],
  ['elev2', 'elev-2'],
  ['text', 'text'],
  ['muted', 'muted'],
  ['line', 'line'],
  ['primary', 'primary'],
  ['accent', 'accent'],
  ['onPrimary', 'on-primary'],
]

function slug(id) {
  return id.toLowerCase().replace(' ', '-')
}

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function stripSvg(p) {
  const w = 720
  const h = 56
  const n = roles.length
  const sw = w / n
  const rects = roles
    .map(([key], i) => `<rect x="${i * sw}" y="0" width="${sw}" height="${h}" fill="${p[key]}"/>`)
    .join('')
  const labels = roles
    .map(([, label], i) => {
      const fill = i < 3 || i === 5 || i === 8 ? p.text : p.bg
      const x = i * sw + sw / 2
      return `<text x="${x}" y="34" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="9" fill="${fill}">${label}</text>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(p.id)} ${escapeXml(p.name)}">${rects}${labels}</svg>\n`
}

function cardSvg(p) {
  const w = 720
  const h = 220
  const swatches = roles
    .map(([key, label], i) => {
      const x = 24 + i * 76
      return `
        <rect x="${x}" y="58" width="64" height="40" rx="6" fill="${p[key]}" stroke="${p.line}"/>
        <text x="${x + 32}" y="114" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="9" fill="${p.muted}">${label}</text>
        <text x="${x + 32}" y="128" text-anchor="middle" font-family="ui-monospace, monospace" font-size="8" fill="${p.text}">${p[key]}</text>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeXml(p.id)} preview">
  <rect width="${w}" height="${h}" rx="16" fill="${p.bg}" stroke="${p.line}"/>
  <rect x="16" y="16" width="${w - 32}" height="${h - 32}" rx="12" fill="${p.elev}" stroke="${p.line}"/>
  <text x="32" y="44" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" font-weight="700" fill="${nameColor(p)}">${escapeXml(p.id)} — ${escapeXml(p.name)}</text>
  ${swatches}
  <rect x="32" y="150" width="120" height="36" rx="8" fill="${p.primary}"/>
  <text x="92" y="172" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" fill="${p.onPrimary}">Primary</text>
  <text x="168" y="172" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" fill="${p.accent}">Accent link</text>
  <text x="280" y="172" font-family="ui-sans-serif, system-ui, sans-serif" font-size="13" fill="${p.muted}">Muted copy</text>
</svg>\n`
}

function cardHtml(p) {
  const chips = roles
    .map(
      ([key, label]) => `
            <div class="chip">
              <span class="chip__swatch" style="background:${p[key]};border-color:${p.line}"></span>
              <span class="chip__label">${label}</span>
              <code>${p[key]}</code>
            </div>`,
    )
    .join('')
  return `
      <article class="card" id="${slug(p.id)}" style="background:${p.bg};color:${p.text};border-color:${p.line}">
        <header class="card__head">
          <p class="kicker" style="color:${nameColor(p)}">${p.id}</p>
          <h2>${p.name}</h2>
          <p class="vibe" style="color:${p.muted}">${p.vibe} Pair with ${p.pair}.</p>
        </header>
        <div class="mock" style="background:${p.elev};border-color:${p.line}">
          <span class="pill" style="color:${nameColor(p)};border-color:${nameColor(p)};background:${p.elev2}">SYSTEM.KERNEL :: ONLINE</span>
          <p class="hello" style="color:${p.text}">Hello I'm</p>
          <p class="name" style="color:${nameColor(p)}">Faraz Bukhari</p>
          <p class="role" style="color:${p.accent}">&lt;SeniorFullStack /&gt; <span style="color:${p.muted}">// Team Lead · WebGIS</span></p>
          <div class="actions">
            <span class="btn" style="background:${p.primary};color:${p.onPrimary}">Download Resume</span>
            <span class="btn ghost" style="border-color:${p.line};color:${p.text};background:${p.elev2}">GitHub</span>
          </div>
        </div>
        <div class="chips">${chips}</div>
      </article>`
}

function htmlPage() {

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Theme palettes — Faraz Bukhari</title>
  <style>
    :root { font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #111; color: #eee; }
    .page { max-width: 1180px; margin: 0 auto; padding: 2rem 1.2rem 4rem; }
    h1 { margin: 0 0 0.4rem; font-size: 1.8rem; }
    .lede { color: #9aa3ad; max-width: 42rem; line-height: 1.5; }
    nav { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.4rem 0 2rem; }
    nav a { color: #c9d2dc; font-size: 0.82rem; padding: 0.28rem 0.6rem; border: 1px solid #333; border-radius: 999px; text-decoration: none; }
    nav a:hover { border-color: #888; }
    h1 + .lede + nav + h2, .grid + h2 { margin-top: 2.2rem; }
    h2.section { font-size: 1.1rem; letter-spacing: 0.12em; text-transform: uppercase; color: #9aa3ad; }
    .grid { display: grid; gap: 1.4rem; }
    @media (min-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
    .card { border: 1px solid; border-radius: 18px; padding: 1.1rem; }
    .kicker { margin: 0; font-family: ui-monospace, monospace; font-size: 0.72rem; letter-spacing: 0.12em; }
    .card h2 { margin: 0.2rem 0 0.35rem; font-size: 1.25rem; }
    .vibe { margin: 0 0 0.9rem; font-size: 0.88rem; line-height: 1.4; }
    .mock { border: 1px solid; border-radius: 12px; padding: 1rem 1.1rem 1.15rem; }
    .pill { display: inline-block; font-family: ui-monospace, monospace; font-size: 0.62rem; letter-spacing: 0.1em; padding: 0.22rem 0.55rem; border: 1px solid; border-radius: 999px; }
    .hello { margin: 0.7rem 0 0; font-size: 0.95rem; }
    .name { margin: 0; font-size: 1.7rem; font-weight: 700; letter-spacing: -0.04em; }
    .role { margin: 0.25rem 0 0.85rem; font-family: ui-monospace, monospace; font-size: 0.78rem; }
    .actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; min-height: 2.1rem; padding: 0.35rem 0.85rem; border-radius: 8px; font-size: 0.82rem; font-weight: 600; }
    .btn.ghost { border: 1px solid; }
    .chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.45rem; margin-top: 0.9rem; }
    .chip { display: grid; gap: 0.12rem; }
    .chip__swatch { display: block; height: 28px; border-radius: 6px; border: 1px solid; }
    .chip__label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; opacity: 0.8; }
    .chip code { font-size: 0.68rem; }
  </style>
</head>
<body>
  <div class="page">
    <h1>Theme palettes — set 2</h1>
    <p class="lede">The first set was all cool SaaS (zinc, navy, GitHub blue). These are different on purpose: cream paper, forest, lime, wine, clay, steel. Pick one light ID and one dark ID. The live portfolio will not change until you choose.</p>
    <nav>
      ${palettes.map((p) => `<a href="#${slug(p.id)}">${p.id}</a>`).join('')}
    </nav>
    <h2 class="section">Light</h2>
    <div class="grid">${palettes.filter((p) => p.mode === 'light').map(cardHtml).join('')}</div>
    <h2 class="section">Dark</h2>
    <div class="grid">${palettes.filter((p) => p.mode === 'dark').map(cardHtml).join('')}</div>
  </div>
</body>
</html>
`
}

const outDir = join(root, 'palettes')
mkdirSync(outDir, { recursive: true })
mkdirSync(join(root, 'public'), { recursive: true })

for (const p of palettes) {
  writeFileSync(join(outDir, `${slug(p.id)}.svg`), cardSvg(p))
  writeFileSync(join(outDir, `${slug(p.id)}-strip.svg`), stripSvg(p))
}

writeFileSync(join(root, 'public/theme-palettes.html'), htmlPage())
console.log(`Wrote ${palettes.length} cards + public/theme-palettes.html`)
