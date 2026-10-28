import type { Project } from './types'

export const projects: Project[] = [
  {
    slug: 'lua-platforms',
    title: 'Lua Platforms',
    year: '2021–now',
    featured: true,
    summary:
      'One-stop influencer marketing for Instagram and TikTok: website, admin portal, influencer app, and client portal.',
    role: 'Senior software developer · team lead',
    problem:
      'Brands and creators were stitching campaigns together across spreadsheets, DMs, and ads managers. The platform had to be one place — and it had to stay up at scale.',
    approach:
      'I led full-stack delivery of Lua’s campaign platform: public site, admin, influencer app, and client portal. When query timeouts hit 30k concurrent users, I re-engineered the database architecture so the same product could serve 2M+ users with sub-3-second responses.',
    outcome:
      'A live influencer-marketing platform used at scale — 2M+ users, sub-3-second responses, four surfaces in production.',
    stack: [
      'React',
      'Node.js',
      'Express',
      'Sequelize',
      'PostgreSQL',
      'Redis',
      'Socket.io',
      'Temporal.io',
      'Bull',
      'AWS',
      'Firebase',
    ],
    categories: ['platform', 'fullstack', 'lead'],
    architecture: [
      { id: 'web', label: 'Website' },
      { id: 'admin', label: 'Admin portal' },
      { id: 'app', label: 'Influencer app' },
      { id: 'client', label: 'Client portal' },
      { id: 'db', label: 'Postgres at scale' },
    ],
    lng: -3.7038,
    lat: 40.4168,
  },
  {
    slug: 'yayooking',
    title: 'Yayooking',
    year: '2021–now',
    featured: true,
    summary:
      'Spanish booking and management platform for nursing homes, day-care centres, and home-care services.',
    role: 'Full-stack · platform',
    problem:
      'Care providers were booking beds, day care, and home visits across disconnected tools. Families needed one place to find and manage care.',
    approach:
      'Built booking and operations for nursing homes, day-care centres, and home-care services as a single Spanish-language platform.',
    outcome: 'First Spanish booking and management platform in that care niche.',
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    categories: ['platform', 'fullstack'],
    architecture: [
      { id: 'homes', label: 'Nursing homes' },
      { id: 'day', label: 'Day care' },
      { id: 'home', label: 'Home care' },
      { id: 'book', label: 'Booking + ops' },
    ],
    lng: -3.7038,
    lat: 40.4168,
  },
  {
    slug: 'habily',
    title: 'Habily',
    year: '2021–now',
    featured: true,
    summary: 'Spanish real-estate platform with AI in the loop.',
    role: 'Full-stack · AI',
    problem: 'Spanish property search still behaved like a classifieds list. Listings needed intelligence, not another filter bar.',
    approach:
      'Shipped a Spanish real-estate product with generative AI in the workflow — AWS Bedrock and OpenAI on a full-stack core.',
    outcome: 'A live real-estate platform that uses AI as part of the product, not a demo.',
    stack: ['React', 'Node.js', 'AWS Bedrock', 'OpenAI', 'PostgreSQL'],
    categories: ['platform', 'fullstack'],
    architecture: [
      { id: 'listings', label: 'Listings' },
      { id: 'ai', label: 'Bedrock + OpenAI' },
      { id: 'app', label: 'Full-stack app' },
    ],
    lng: -3.7038,
    lat: 40.4168,
  },
  {
    slug: 'plotfinder',
    title: 'PlotFinder',
    year: '2018–2021',
    featured: true,
    href: 'https://www.zameen.com/plotfinder/',
    summary:
      'Map-based society and plot search for Zameen.com — from an R&D prototype to a production WebGIS product covering societies across Pakistan.',
    role: 'Associate geomatics engineer · team lead',
    problem:
      'Finding a plot in a housing society meant lists, PDFs, and guesswork. Buyers needed to see societies and plots on a map they could actually search.',
    approach:
      'I built the first PlotFinder prototype in React and Leaflet, then moved the renderer to Mapbox GL. The API was Node, Express, and Sequelize over PostGIS. Turf.js handled spatial logic in the browser. QGIS, FME, Python, and a team of 18 digitizers and 2 map editors made the inventory trustworthy.',
    outcome:
      'PlotFinder shipped on zameen.com and remains the public plot-search map for the platform.',
    stack: [
      'React',
      'Redux',
      'Leaflet',
      'Mapbox GL',
      'Turf.js',
      'Node.js',
      'Express',
      'Sequelize',
      'PostGIS',
      'Python',
      'QGIS',
      'FME',
    ],
    categories: ['gis', 'fullstack', 'lead'],
    architecture: [
      { id: 'react', label: 'React / Redux' },
      { id: 'map', label: 'Leaflet → Mapbox GL' },
      { id: 'api', label: 'Node · Express · Sequelize' },
      { id: 'pg', label: 'PostGIS' },
      { id: 'data', label: 'QGIS + FME + Python' },
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
    stack: ['Drone imagery', '3D', 'GIS', 'CesiumJS'],
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
  {
    slug: 'islamabad-dashboard',
    title: 'Islamabad Dashboard',
    year: '2017–2018',
    featured: false,
    summary: 'E-governance dashboard for Islamabad using smart geotechnologies.',
    role: 'GIS administrator · spatial ETL',
    problem: 'City operations sat in files and silos. Officials needed a live geographic picture, not another report.',
    approach:
      'Implemented an e-governance dashboard on spatial ETL: extract, transform, and load society and city GIS so the map could drive decisions.',
    outcome: 'A geotech dashboard for Islamabad administration, built while GIS administrator at KECHS.',
    stack: ['QGIS', 'ArcGIS', 'ETL', 'GIS'],
    categories: ['gis'],
    architecture: [
      { id: 'etl', label: 'Spatial ETL' },
      { id: 'dash', label: 'E-governance dashboard' },
      { id: 'gis', label: 'City GIS' },
    ],
    lng: 73.0479,
    lat: 33.6844,
  },
]

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export function featuredProjects() {
  return projects.filter((project) => project.featured)
}
