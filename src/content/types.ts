export type SocialLink = {
  id: string
  label: string
  href: string
}

export type Identity = {
  name: string
  shortName: string
  firstName: string
  role: string
  location: string
  email: string
  availability: string
  summary: string
  resumePath: string
  socials: SocialLink[]
}

export type AboutChapter = {
  id: string
  index: string
  title: string
  yearLabel: string
  location?: string
  body: string
}

export type Education = {
  id: string
  degree: string
  org: string
  start: string
  end: string
  location: string
  honors?: string
  gpa?: string
  focus: string[]
}

export type ExperienceRole = {
  id: string
  title: string
  org: string
  start: string
  end: string
  location: string
  lng: number
  lat: number
  summary: string
  bullets: string[]
  stack: string[]
}

export type ProjectCategory = 'gis' | 'platform' | 'lead' | 'fullstack'

export type ArchitectureNode = {
  id: string
  label: string
}

export type Project = {
  slug: string
  title: string
  year: string
  summary: string
  role: string
  problem: string
  approach: string
  outcome: string
  stack: string[]
  categories: ProjectCategory[]
  featured?: boolean
  href?: string
  architecture: ArchitectureNode[]
  lng?: number
  lat?: number
}

export type SkillGroup = 'fullstack' | 'webgis' | 'leadership' | 'cloud'

export type Skill = {
  id: string
  name: string
  group: SkillGroup
  level: number
  years: number
  blurb: string
  relatedProjects: string[]
  links: string[]
}

export type Article = {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  body: string
}

export const skillGroupLabel: Record<SkillGroup, string> = {
  fullstack: 'Full-stack',
  webgis: 'WebGIS',
  leadership: 'Leadership',
  cloud: 'Cloud / DevEx',
}

export const skillGroupColor: Record<SkillGroup, string> = {
  fullstack: '#a2653d',
  webgis: '#4f5d43',
  leadership: '#c4a574',
  cloud: '#6d7c62',
}

export const categoryLabel: Record<ProjectCategory, string> = {
  gis: 'GIS',
  platform: 'Platform',
  lead: 'Lead',
  fullstack: 'Full-stack',
}
