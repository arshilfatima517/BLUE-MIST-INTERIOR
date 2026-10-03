export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  style: string;
  description: string;
  image: string;
}

export type ProjectCategory =
  | 'Living Room'
  | 'Bedroom'
  | 'Kitchen'
  | 'Dining Room'
  | 'Office'
  | 'Full Home';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}
