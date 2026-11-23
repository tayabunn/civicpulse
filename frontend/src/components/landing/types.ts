export interface NavLink {
  label: string;
  href: string;
}

export interface HeroStat {
  value: string;
  label: string;
  sublabel: string;
}

export interface PartnerLogo {
  name: string;
  code: string;
  division: string;
}

export interface ServiceOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  tag: string;
}

export interface FeatureItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  badge: string;
}

export interface RolePlan {
  role: 'citizen' | 'manager' | 'staff' | 'admin';
  title: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  organization: string;
  avatarUrl: string;
}
