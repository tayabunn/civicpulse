import {
  NavLink,
  HeroStat,
  PartnerLogo,
  ServiceOffer,
  FeatureItem,
  RolePlan,
  Testimonial,
} from './types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '#about' },
  { label: 'What We Offer', href: '#services' },
  { label: 'Platform Features', href: '#features' },
  { label: 'Portals', href: '#portals' },
  { label: 'City Telemetry', href: '#telemetry' },
];

export const HERO_STATS: HeroStat[] = [
  {
    value: '108+',
    label: 'Verified Reports',
    sublabel: 'Across 30 municipal clusters',
  },
  {
    value: '30+',
    label: 'Ward Zones',
    sublabel: 'Connected citywide grid',
  },
  {
    value: '94.2%',
    label: 'SLA Resolution Rate',
    sublabel: 'Target met in < 24 hours',
  },
];

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: 'Dhaka North City Corporation', code: 'DNCC', division: 'Municipal Operations' },
  { name: 'Dhaka South City Corporation', code: 'DSCC', division: 'Urban Governance' },
  { name: 'Water Supply & Sewerage Authority', code: 'WASA', division: 'Water & Drainage' },
  { name: 'Roads and Highways Department', code: 'RHD', division: 'Civil Infrastructure' },
  { name: 'Dhaka Electric Supply Company', code: 'DESCO', division: 'Power & Streetlights' },
  { name: 'Bangladesh Road Transport Authority', code: 'BRTA', division: 'Traffic Safety' },
];

export const WHAT_WE_OFFER: ServiceOffer[] = [
  {
    id: 'road-damage',
    title: 'Road Damage & Pavements',
    description: 'Potholes, cracked asphalt, and hazardous road cavities reported with GPS coordinates and photographic verification.',
    category: 'Civil Infrastructure',
    tag: 'High Priority',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'streetlights',
    title: 'Streetlights & Night Safety',
    description: 'Broken lamp posts, dark corridors, and flickering fixtures repaired by dispatched municipal electrical teams.',
    category: 'Electrical Operations',
    tag: 'Active Grid',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'drainage-problems',
    title: 'Drainage & Waterlogging',
    description: 'Monsoon water accumulation, clogged culvert grates, and blocked stormwater canals tracked and cleared.',
    category: 'Water & Sewerage',
    tag: 'Urgent Response',
    imageUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'footpath-damage',
    title: 'Footpaths & Pedestrian Access',
    description: 'Cracked pedestrian sidewalks, broken tactile paving, and unsafe walking corridors restored for accessibility.',
    category: 'Pedestrian Safety',
    tag: 'Community Care',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'waste-management',
    title: 'Waste & Public Cleanliness',
    description: 'Uncollected domestic refuse, overflowing commercial bins, and illegal roadside dumping cleared on schedule.',
    category: 'Sanitation Division',
    tag: 'Clean City',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'public-infrastructure',
    title: 'Public Parks & Amenities',
    description: 'Damaged community park benches, broken playground equipment, and roadside safety guardrails repaired.',
    category: 'Civic Amenities',
    tag: 'Public Living',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
];

export const MAIN_FEATURES: FeatureItem[] = [
  {
    id: 'gis-telemetry',
    number: '01',
    title: 'Precision GIS & GPS Telemetry',
    subtitle: 'Real-time spatial incident clustering',
    description: 'Citizens pinpoint problems with live GPS coordinates, while our automated Haversine radar detects duplicate submissions within a 50-meter radius.',
    bullets: [
      'Sub-meter GPS coordinate tagging with interactive Leaflet map',
      'Automatic 50m proximity duplicate detection prevents task overload',
      'Encrypted photographic resolution evidence stored permanently',
    ],
    badge: 'Geospatial Radar',
  },
  {
    id: 'triage-dispatch',
    number: '02',
    title: 'Automated Triage & Routing',
    subtitle: 'From citizen report to department in minutes',
    description: 'Incoming incident reports are automatically categorized, scored by urgency, and routed to the corresponding department manager dashboard for triage.',
    bullets: [
      'Department-specific dispatch hubs for roads, lighting, and water',
      'Configurable SLA benchmark countdowns with escalation triggers',
      'Cryptographically signed audit logs for every state transition',
    ],
    badge: 'Workflow Engine',
  },
  {
    id: 'field-operations',
    number: '03',
    title: 'Mobile Work Orders & Navigation',
    subtitle: 'Empowering field maintenance crews',
    description: 'Maintenance teams receive real-time job orders on their mobile devices with Google Maps turn-by-turn routing and before/after verification photo tools.',
    bullets: [
      'Mobile-responsive task board with offline location caching',
      'Direct turn-by-turn navigation to incident coordinates',
      'Instant repair progress updates and photo proof upload',
    ],
    badge: 'Field Ops Hub',
  },
  {
    id: 'data-analytics',
    number: '04',
    title: 'Predictive Citywide BI Analytics',
    subtitle: 'Evidence-based municipal governance',
    description: 'Transform daily citizen complaints into predictive urban intelligence. Spot recurring infrastructure bottlenecks and allocate seasonal municipal budgets efficiently.',
    bullets: [
      'Live department performance scorecards and SLA rankings',
      'Geographical problem heatmaps across all 30 city wards',
      'Citizen satisfaction ratings recorded on case closure',
    ],
    badge: 'GovTech Intelligence',
  },
];

export const ROLE_PLANS: RolePlan[] = [
  {
    role: 'citizen',
    title: 'Citizens',
    badge: 'Public Portal',
    tagline: 'Spot. Report. Track.',
    description: 'Empowering city residents to report infrastructure problems, track progress in real time, and verify fixes.',
    features: [
      'Report issues with photos and precise GPS location',
      '50m duplicate detection radar alerts',
      'Live timeline status updates (Submitted → Resolved)',
      'Direct 5-star citizen satisfaction rating',
    ],
    cta: 'Open Citizen Portal',
    href: '/citizen',
  },
  {
    role: 'manager',
    title: 'Department Managers',
    badge: 'Dispatch Hub',
    tagline: 'Triage. Assign. Monitor.',
    description: 'Unified command center for department dispatchers to review incoming incidents and orchestrate repair crews.',
    features: [
      'Real-time incident verification and priority triage',
      'Assign tasks to field maintenance technicians',
      'Track active workloads and crew capacity',
      'SLA countdown and bottleneck warning alerts',
    ],
    cta: 'Access Dispatch Hub',
    href: '/manager',
    popular: true,
  },
  {
    role: 'staff',
    title: 'Maintenance Staff',
    badge: 'Field Crew',
    tagline: 'Navigate. Repair. Verify.',
    description: 'Mobile-first tool for on-ground repair technicians to receive assignments and submit completion evidence.',
    features: [
      'Mobile task queue with prioritized work orders',
      'Turn-by-turn navigation to GPS coordinates',
      'One-tap progress status updates (In Progress / Completed)',
      'Upload before-and-after photographic evidence',
    ],
    cta: 'Field Work Orders',
    href: '/staff',
  },
  {
    role: 'admin',
    title: 'Administrators',
    badge: 'GovTech BI',
    tagline: 'Govern. Benchmark. Optimize.',
    description: 'System-wide governance platform for municipal directors, ward commissioners, and city leadership.',
    features: [
      'Citywide executive analytics and incident heatmaps',
      'Department SLA compliance benchmarks & rankings',
      'Manage user roles, credentials, and access rules',
      'Export auditable CSV and PDF municipal reports',
    ],
    cta: 'Executive Dashboard',
    href: '/admin',
  },
];

export const TESTIMONIAL: Testimonial = {
  quote:
    'CivicPulse has transformed how our municipality operates. Issues that previously took weeks of paper bureaucracy now reach field crews within minutes, and citizens can follow every step with complete transparency.',
  author: 'Eng. Rafiqul Islam',
  role: 'Chief Urban Infrastructure Coordinator',
  organization: 'Municipal Civil Infrastructure Division',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
};
