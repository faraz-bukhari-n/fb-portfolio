export type LayerId = 'hex' | 'heat' | 'arcs' | 'scatter' | 'columns' | 'trips' | 'personal'

export type LayerDef = {
  id: LayerId
  label: string
  note: string
}

export const playgroundLayers: LayerDef[] = [
  {
    id: 'personal',
    label: 'Career / projects',
    note: 'Places from src/content — roles and case studies as globe points.',
  },
  {
    id: 'arcs',
    label: 'Career arcs',
    note: 'Geodesic hops between roles. A lead’s geography, not a flight tracker.',
  },
  {
    id: 'hex',
    label: 'City clusters',
    note: 'Sample event density as squat volumes. Cesium analogue of a hexbin.',
  },
  {
    id: 'heat',
    label: 'Ground heat',
    note: 'Soft ellipses on the globe. Use when points would lie.',
  },
  {
    id: 'columns',
    label: '3D columns',
    note: 'City-scale magnitudes. Tilt the globe; keep names in the info box.',
  },
  {
    id: 'trips',
    label: 'Trips',
    note: 'Time-encoded paths. Driven by the slider.',
  },
  {
    id: 'scatter',
    label: 'Scatter',
    note: 'Raw sample points under the volumes so you can audit the story.',
  },
]

export type BasemapId = 'paper' | 'satellite' | 'terrain' | 'blank'

export const basemaps: { id: BasemapId; label: string }[] = [
  { id: 'paper', label: 'Paper' },
  { id: 'terrain', label: 'Terrain' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'blank', label: 'Globe' },
]
