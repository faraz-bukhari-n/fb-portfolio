import type { AboutChapter } from './types'

export const aboutChapters: AboutChapter[] = [
  {
    id: 'origin',
    index: '01',
    title: 'Origin',
    yearLabel: '2013–2017',
    location: 'NUST Islamabad',
    body: 'I trained as a GeoInformatics engineer at the National University of Sciences and Technology in Islamabad, graduating with a 3.84 CGPA and a silver medal. The degree was GIS, remote sensing, cartography, programming, image processing, WebGIS, and integrated geotech — the mix that still decides how I build software: the map is the product, not a widget bolted on at the end.',
  },
  {
    id: 'engineering',
    index: '02',
    title: 'Engineering',
    yearLabel: '2018–2021',
    location: 'Zameen.com, Lahore',
    body: 'I joined Zameen.com as the company stood up a new R&D department. I built PlotFinder from a prototype into a production map: React, Redux, and Bootstrap on the client; Node, Express, and GraphQL over Postgres; nginx in front; Leaflet, then Mapbox GL, with Turf.js on the geometry. QGIS and FME fed the inventory. It still lives on zameen.com. In the same stretch we took listings off the spreadsheet: a CesiumJS scene of apartments and available units.',
  },
  {
    id: 'leadership',
    index: '03',
    title: 'Leadership',
    yearLabel: '2018–2021',
    location: 'Data + maps team',
    body: 'The map was only as good as the data under it. I managed 18 data digitizers and two map editors: throughput, quality, and the unglamorous work of making a national plot inventory trustworthy enough to search.',
  },
  {
    id: 'gis',
    index: '04',
    title: 'WebGIS',
    yearLabel: '2018–2021',
    location: 'PlotFinder · drone · Cesium',
    body: 'PlotFinder was the whole loop: digitize in QGIS and FME, serve from Postgres, ship a React map, then change the renderer when Leaflet stopped being enough. Turf.js did the geometry in the browser. We also used drone imagery for 3D construction-progress views — so overseas investors could see the site instead of an overstated promise — and CesiumJS when the listing itself needed to be a building: apartments, available units, in 3D.',
  },
  {
    id: 'lua',
    index: '05',
    title: 'Now',
    yearLabel: '2021–',
    location: 'Ideamappers, Islamabad → Lua Group',
    body: 'In 2021 I joined through Ideamappers, a Pakistani firm in Islamabad that contracted separately with Lua Group, a Spanish influencer-marketing startup in Madrid. I was full-stack developer and tech lead on their in-house campaign platform. In 2024 that arrangement ended: we switched to individual contractors, I started billing in dollars, and I kept the same seat — remote, now from Spain. More of the product story as I fill it in.',
  },
]
