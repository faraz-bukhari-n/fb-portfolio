export type CareerHighlight = {
  id: string
  year: string
  kicker: string
  title: string
  line: string
  detail: string
  featured?: boolean
  href?: string
}

export const highlights: CareerHighlight[] = [
  {
    id: 'lua-ai',
    year: '2024–now',
    kicker: 'AI',
    title: 'The hunting team works a queue',
    line: 'Bedrock (Claude Haiku) on the mailbox. Rekognition on creator media — 95% after we tuned it.',
    detail:
      'Campaign labels, then interested / not interested / in negotiation. Liveness on the media so a profile is worth booking. The biggest campaign we have run closed on time.',
    featured: true,
    href: '/work/lua-ai',
  },
  {
    id: 'outreach',
    year: '2021–now',
    kicker: 'Outreach',
    title: 'Invites that do not read as a blast',
    line: 'Cold email for campaigns — customised, personal, sent in bulk so creators do not treat it as spam.',
    detail:
      'Backbone of Lua. The hunting team writes to people, not to a list. Replies land in the same inbox Bedrock labels.',
    featured: true,
    href: '/work/lua-platforms',
  },
  {
    id: 'live',
    year: '2021–now',
    kicker: 'Live',
    title: 'The brief stays in the product',
    line: 'Firestore chat for client, creator, and admin on one campaign. Staff notifications on Postgres and Socket.io — live.',
    detail:
      'A campaign request is a thread, not a DM trail. Lua employees see tasks, campaigns, and assignments as they land. Two systems; both have to stay up.',
    featured: true,
    href: '/work/lua-platforms',
  },
  {
    id: 'scale',
    year: '2021–now',
    kicker: 'Scale',
    title: '2M+ users, under 3 seconds',
    line: 'Lua’s campaign platform used to time out at 30k concurrent. I re-engineered the database so it did not.',
    detail:
      'Query timeouts at 30k concurrent users. Same product now serves 2M+ with sub-3-second responses — Postgres, Redis, and the jobs taken off the request path.',
    href: '/work/lua-platforms',
  },
  {
    id: 'plotfinder',
    year: '2018–2021',
    kicker: 'Shipped',
    title: 'PlotFinder, on zameen.com',
    line: 'Map-based society and plot search. R&D prototype to a live WebGIS product covering Pakistan.',
    detail:
      'React, Leaflet then Mapbox GL, Node and PostGIS. Still the public plot-search map. The inventory under it was the other half of the work.',
    href: '/work/plotfinder',
  },
  {
    id: 'lead',
    year: '2018–now',
    kicker: 'Lead',
    title: 'Teams that ship',
    line: 'GIS data squad first — 18 digitizers, 2 map editors. Then full-stack engineering: reviews, dates, systems that stay up.',
    detail:
      'Team lead since Zameen. The map is only as good as the inventory; the product is only as good as the people who can keep it in production.',
    href: '/experience',
  },
  {
    id: 'lua-surfaces',
    year: '2021–now',
    kicker: 'Platform',
    title: 'Four surfaces, one campaign product',
    line: 'Website, admin portal, influencer app, client portal — Instagram and TikTok in one place.',
    detail:
      'PERN stack, Firestore campaign chat, Socket.io staff feed, Temporal, Bull. Built from Islamabad, led from Spain. The work is the product staying up, not the stack list.',
    href: '/work/lua-platforms',
  },
  {
    id: 'webgis-3d',
    year: '2018–2021',
    kicker: 'WebGIS',
    title: 'Listings you can stand in',
    line: 'Cesium apartment units with availability on the model. Drone progress in 3D so remote buyers saw the site.',
    detail:
      'A 2D list of apartments does not tell you where a unit sits. Progress photos do not tell you what is on the ground. Both products were spatial on purpose.',
    href: '/work/cesium-listings',
  },
  {
    id: 'spain',
    year: '2021–now',
    kicker: 'Product',
    title: 'Care booking and AI listings, Spain',
    line: 'Yayooking for nursing homes, day care, and home care. Habily for real estate with Bedrock and OpenAI in the workflow.',
    detail:
      'Spanish-language platforms, not demos. Booking and ops as one product; generative AI as part of listings, not a slide.',
    href: '/work/yayooking',
  },
  {
    id: 'inventory',
    year: '2018–2021',
    kicker: 'Data',
    title: 'The map is the inventory',
    line: 'QGIS, FME, Python, PostGIS. Digitizing so PlotFinder was not guessing at societies and plots.',
    detail:
      'Eighteen digitizers and two map editors. Georeferencing, raster, vector, spatial analysis. A live map with bad data is marketing.',
    href: '/work/plotfinder',
  },
  {
    id: 'fyp',
    year: '2017',
    kicker: 'FYP',
    title: 'Islamabad Dashboard, NUST',
    line: 'Final year project. E-governance dashboard on spatial ETL — the first map product I took to a finish.',
    detail:
      'Geoinformatics capstone at NUST, not a client job. City GIS as a dashboard, before the work moved into production at Zameen.',
    href: '/work/islamabad-dashboard',
  },
]

export function featuredHighlights() {
  return highlights.filter((item) => item.featured)
}
