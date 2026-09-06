import type { ExperienceRole } from './types'

export const experience: ExperienceRole[] = [
  {
    id: 'lua',
    title: 'Full-Stack Developer & Tech Lead',
    org: 'Lua Group',
    start: '2021',
    end: 'Now',
    location: 'Remote · Madrid',
    lng: -3.7038,
    lat: 40.4168,
    summary:
      'Spanish influencer-marketing startup. I work remotely as a full-stack developer and tech lead on the in-house platform that runs campaigns.',
    bullets: [
      'Joined in 2021 as full-stack developer and tech lead — still here.',
      'Help build and lead the product engineering behind Lua Group’s influencer-marketing platform: the software agencies and brands use to run campaigns.',
    ],
    stack: ['Full-stack', 'Tech lead'],
  },
  {
    id: 'zameen',
    title: 'R&D Engineer',
    org: 'Zameen.com',
    start: '2018',
    end: '2021',
    location: 'Lahore',
    lng: 74.3587,
    lat: 31.5204,
    summary:
      'Helped stand up a new R&D department: PlotFinder on the public site, drone progress in 3D, and Cesium listings for apartments and available units.',
    bullets: [
      'Prototyped PlotFinder, then shipped it to production as a map-based society and plot search tool.',
      'Managed a team of 18 data digitizers and 2 map editors so the inventory on the map was real.',
      'Built the client in React with Leaflet, then moved the map stack to Mapbox GL.',
      'Worked on drone imagery for 3D construction-progress views, so overseas investors could see actual site progress instead of overstated promises.',
      'Built a CesiumJS property-listings experience that showed apartments and available units in 3D.',
      'Worked the full stack: React, Redux, and Bootstrap on the client; Node, Express, and GraphQL over Postgres; nginx in front; Turf.js on the geometry; QGIS and FME on the data.',
    ],
    stack: [
      'React',
      'Redux',
      'Bootstrap',
      'Node.js',
      'Express',
      'GraphQL',
      'Postgres',
      'nginx',
      'Leaflet',
      'Mapbox GL',
      'CesiumJS',
      'Turf.js',
      'QGIS',
      'FME',
    ],
  },
]
