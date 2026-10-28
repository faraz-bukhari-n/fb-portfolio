import type { Certification, Education } from './types'

export const education: Education[] = [
  {
    id: 'nust-igis',
    degree: 'Bachelors in Geoinformatics Engineering',
    org: 'National University of Sciences and Technology (NUST)',
    start: '2013',
    end: '2017',
    location: 'Islamabad',
    gpa: '3.84 CGPA',
    honors: 'Silver medal',
    focus: [
      'GIS',
      'Remote Sensing',
      'Cartography',
      'Programming',
      'Image Processing',
      'WebGIS',
      'Integrated GeoTech',
    ],
  },
]

export const certifications: Certification[] = [
  { id: 'esri', org: 'Esri', label: '11 certifications' },
  { id: 'udemy', org: 'Udemy', label: '4 certifications' },
]
