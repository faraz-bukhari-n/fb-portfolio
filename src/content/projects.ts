import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'plotfinder',
    title: 'PlotFinder',
    year: '2018–2021',
    featured: true,
    href: 'https://www.zameen.com/plotfinder/',
    summary:
      'Map-based society and plot search for Zameen.com — from an R&D prototype to a production WebGIS product.',
    role: 'R&D · prototype, map stack, data team',
    problem:
      'Finding a plot in a housing society meant lists, PDFs, and guesswork. Buyers needed to see societies and plots on a map they could actually search.',
    approach:
      'I built the first PlotFinder prototype in React and Leaflet, then moved the renderer to Mapbox GL. The client sat on Redux and Bootstrap; the API was Node, Express, and GraphQL over Postgres, served through nginx. Turf.js handled the spatial logic in the browser. QGIS, FME, and a team of 18 digitizers and 2 map editors made the inventory trustworthy.',
    outcome:
      'PlotFinder shipped on zameen.com and remains the public plot-search map for the platform.',
    stack: [
      'React',
      'Redux',
      'Bootstrap',
      'Leaflet',
      'Mapbox GL',
      'Turf.js',
      'Node.js',
      'Express',
      'GraphQL',
      'Postgres',
      'nginx',
      'QGIS',
      'FME',
    ],
    categories: ['gis', 'fullstack', 'lead'],
    architecture: [
      { id: 'react', label: 'React / Redux' },
      { id: 'map', label: 'Leaflet → Mapbox GL' },
      { id: 'api', label: 'Node · Express · GraphQL' },
      { id: 'pg', label: 'Postgres' },
      { id: 'data', label: 'QGIS + FME' },
    ],
    lng: 74.3587,
    lat: 31.5204,
  },
  {
    slug: 'drone-progress',
    title: 'Drone progress, in 3D',
    year: '2018–2021',
    featured: true,
    summary:
      'Drone imagery turned into 3D construction-progress views so overseas investors could see the site, not the brochure.',
    role: 'R&D · imagery + 3D progress',
    problem:
      'Remote buyers were asked to trust progress photos and promises. The gap between marketing and the ground was expensive.',
    approach:
      'We captured drone imagery of developments and built 3D progress views so an investor could inspect actual construction instead of an overstated narrative.',
    outcome:
      'Overseas investors could check real site progress — a spatial product in service of trust, not decoration.',
    stack: ['Drone imagery', '3D', 'GIS'],
    categories: ['gis'],
    architecture: [
      { id: 'drone', label: 'Drone capture' },
      { id: 'imagery', label: 'Progress imagery' },
      { id: 'view', label: '3D progress view' },
    ],
    lng: 74.343,
    lat: 31.506,
  },
  {
    slug: 'cesium-listings',
    title: '3D apartment listings',
    year: '2018–2021',
    featured: true,
    summary:
      'A CesiumJS scene for property listings: apartments in the building, and which units were actually available.',
    role: 'R&D · 3D listings',
    problem:
      'A 2D list of apartments does not tell you where a unit sits in the building — or what is still for sale. Buyers were shopping floor numbers in a spreadsheet.',
    approach:
      'We built a CesiumJS listings experience: the building in 3D, apartments as units in the scene, and availability on the model so you could see stock instead of imagining it.',
    outcome:
      'A 3D way to browse apartments and available units — the listing as a building, not a table.',
    stack: ['CesiumJS', 'React', '3D'],
    categories: ['gis', 'fullstack'],
    architecture: [
      { id: 'building', label: 'Building model' },
      { id: 'units', label: 'Apartment units' },
      { id: 'avail', label: 'Availability' },
      { id: 'cesium', label: 'CesiumJS scene' },
    ],
    lng: 74.372,
    lat: 31.534,
  },
]

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function featuredProjects() {
  return projects.filter((project) => project.featured)
}
