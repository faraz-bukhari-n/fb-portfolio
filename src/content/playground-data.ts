import { experience } from './experience'
import { projects } from './projects'

export type LngLat = [number, number]

export type ScatterPoint = {
  name: string
  kind: 'project' | 'role'
  lng: number
  lat: number
  year: number
  color: [number, number, number]
}

export type ArcDatum = {
  name: string
  source: LngLat
  target: LngLat
  year: number
}

export type HexPoint = {
  lng: number
  lat: number
  weight: number
}

export type TripPath = {
  name: string
  path: LngLat[]
  timestamps: number[]
  color: [number, number, number]
}

export type ColumnDatum = {
  name: string
  lng: number
  lat: number
  value: number
}

const CITIES: { name: string; lng: number; lat: number }[] = [
  { name: 'London', lng: -0.1276, lat: 51.5072 },
  { name: 'Berlin', lng: 13.405, lat: 52.52 },
  { name: 'Paris', lng: 2.3522, lat: 48.8566 },
  { name: 'New York', lng: -74.006, lat: 40.7128 },
  { name: 'San Francisco', lng: -122.4194, lat: 37.7749 },
  { name: 'Singapore', lng: 103.8198, lat: 1.3521 },
  { name: 'Nairobi', lng: 36.8219, lat: -1.2921 },
  { name: 'Tokyo', lng: 139.6917, lat: 35.6895 },
]

function hash(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

function jitter(lng: number, lat: number, i: number, spread = 0.35): LngLat {
  return [lng + (hash(i) - 0.5) * spread, lat + (hash(i + 7) - 0.5) * spread]
}

export const scatterPoints: ScatterPoint[] = [
  ...projects
    .filter((project) => project.lng !== undefined && project.lat !== undefined)
    .map((project) => ({
      name: project.title,
      kind: 'project' as const,
      lng: project.lng as number,
      lat: project.lat as number,
      year: Number.parseInt(String(project.year), 10),
      color: [162, 101, 61] as [number, number, number],
    })),
  ...experience.map((role) => ({
    name: `${role.org} · ${role.title}`,
    kind: 'role' as const,
    lng: role.lng,
    lat: role.lat,
    year: Number(role.start),
    color: [79, 93, 67] as [number, number, number],
  })),
]

export const careerArcs: ArcDatum[] = experience.slice(0, -1).map((role, index) => {
  const next = experience[index + 1]
  return {
    name: `${role.org} → ${next.org}`,
    source: [role.lng, role.lat],
    target: [next.lng, next.lat],
    year: Number(role.start),
  }
})

export const hexPoints: HexPoint[] = CITIES.flatMap((city, cityIndex) =>
  Array.from({ length: 80 }, (_, i) => {
    const [lng, lat] = jitter(city.lng, city.lat, cityIndex * 100 + i, 1.8)
    return { lng, lat, weight: 1 + hash(cityIndex + i) * 8 }
  }),
)

export const columns: ColumnDatum[] = CITIES.map((city, i) => ({
  name: city.name,
  lng: city.lng,
  lat: city.lat,
  value: 40 + hash(i + 3) * 180,
}))

function catmull(a: LngLat, b: LngLat, steps: number): { path: LngLat[]; timestamps: number[] } {
  const path: LngLat[] = []
  const timestamps: number[] = []
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps
    const lng = a[0] + (b[0] - a[0]) * t
    const lat = a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * 8
    path.push([lng, lat])
    timestamps.push(t * 20)
  }
  return { path, timestamps }
}

export const trips: TripPath[] = CITIES.slice(0, 6).map((city, i) => {
  const other = CITIES[(i + 2) % CITIES.length]
  const { path, timestamps } = catmull([city.lng, city.lat], [other.lng, other.lat], 24)
  return {
    name: `${city.name} → ${other.name}`,
    path,
    timestamps,
    color: i % 2 === 0 ? [79, 93, 67] : [162, 101, 61],
  }
})

export const tripDuration = 20

export const heatmapPoints = hexPoints.map((point) => ({
  lng: point.lng,
  lat: point.lat,
  weight: point.weight,
}))

export const cities = CITIES
