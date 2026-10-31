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
    at: 140,
    kicker: 'Who',
    title: 'Faraz Bukhari',
    line: 'Full-stack · team lead · WebGIS. Remote, Spain.',
  },
  {
    id: 'nust',
    at: 520,
    kicker: '2013–2017',
    title: 'GeoInformatics, NUST',
    line: 'Silver medal. Trained to treat the map as the product.',
  },
  {
    id: 'fyp',
    at: 900,
    kicker: 'FYP',
    title: 'Islamabad Dashboard, NUST',
    line: 'Final year project. E-governance dashboard on spatial ETL — the first map product I finished.',
  },
  {
    id: 'plotfinder',
    at: 1280,
    kicker: 'Shipped',
    title: 'PlotFinder, on zameen.com',
    line: 'Map-based society and plot search. R&D prototype to a live WebGIS product covering Pakistan.',
  },
  {
    id: 'webgis',
    at: 1660,
    kicker: 'WebGIS',
    title: 'Listings you can stand in',
    line: 'Cesium apartment units with availability on the model. Drone progress in 3D.',
  },
  {
    id: 'lead',
    at: 2040,
    kicker: 'Lead',
    title: 'Teams that ship',
    line: 'GIS data squad first — 18 digitizers, 2 map editors. Then full-stack engineering.',
  },
  {
    id: 'surfaces',
    at: 2420,
    kicker: 'Platform',
    title: 'Four surfaces, one campaign product',
    line: 'Website, admin, influencer app, client portal — Instagram and TikTok in one place.',
  },
  {
    id: 'scale',
    at: 2800,
    kicker: 'Scale',
    title: '2M+ users, under 3 seconds',
    line: 'Lua used to time out at 30k concurrent. I re-engineered the database so it did not.',
  },
  {
    id: 'outreach',
    at: 3180,
    kicker: 'Outreach',
    title: 'Invites that do not read as a blast',
    line: 'Cold email for campaigns — customised, personal, sent in bulk.',
  },
  {
    id: 'live',
    at: 3560,
    kicker: 'Live',
    title: 'The brief stays in the product',
    line: 'Firestore campaign chat. Staff notifications on Postgres and Socket.io.',
  },
  {
    id: 'lua-ai',
    at: 3940,
    kicker: 'AI',
    title: 'The hunting team works a queue',
    line: 'Bedrock (Claude Haiku) on the mailbox. Rekognition on creator media — 95%.',
  },
  {
    id: 'hire',
    at: 4320,
    kicker: 'Next',
    title: 'What I can do for you',
    line: 'Ship a spatial product. Lead the build. Put AI in the ops loop.',
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
    id: 'ops',
    title: 'Put AI in the ops loop',
    line: 'Inbox triage, liveness, personalised invites, live chat — the campaign desk, not a demo.',
  },
]
