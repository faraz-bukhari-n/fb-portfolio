export type ClimbMilestone = {
  id: string
  at: number
  kicker: string
  title: string
  line: string
}

export type ClimbOffer = {
  id: string
  title: string
  line: string
}

export const climbMilestones: ClimbMilestone[] = [
  {
    id: 'who',
    at: 120,
    kicker: 'Who',
    title: 'Faraz Bukhari',
    line: 'Full-stack · team lead · WebGIS. Remote, Spain.',
  },
  {
    id: 'nust',
    at: 700,
    kicker: '2013–2017',
    title: 'GeoInformatics, NUST',
    line: 'Silver medal. Trained to treat the map as the product.',
  },
  {
    id: 'zameen',
    at: 1400,
    kicker: '2018–2021',
    title: 'PlotFinder, Zameen.com',
    line: 'Associate geomatics engineer. Prototype → production plot search. Led the GIS data team.',
  },
  {
    id: 'webgis',
    at: 2100,
    kicker: 'Craft',
    title: 'Mapbox · Cesium · 3D',
    line: 'Leaflet then Mapbox. Drone progress. Apartments you can inspect in 3D.',
  },
  {
    id: 'lua',
    at: 2800,
    kicker: '2021–now',
    title: 'Team lead, Lua Group',
    line: 'Influencer platform. 30k concurrent → 2M+ users. Remote, Spain.',
  },
  {
    id: 'hire',
    at: 3600,
    kicker: 'Next',
    title: 'What I can do for you',
    line: 'Ship a spatial product. Lead the build. Make the data real.',
  },
]

export const climbOffers: ClimbOffer[] = [
  {
    id: 'ship',
    title: 'Ship a map product',
    line: 'Search, 3D listings, Mapbox or Cesium — from first prototype to a live URL.',
  },
  {
    id: 'lead',
    title: 'Lead the build',
    line: 'Full-stack + team lead. Small teams, production dates, systems that stay up.',
  },
  {
    id: 'data',
    title: 'Make the inventory true',
    line: 'QGIS, FME, Postgres, digitizing. The map is only as good as the data under it.',
  },
]
