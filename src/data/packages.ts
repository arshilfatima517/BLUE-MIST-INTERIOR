import type { Package } from '@/types';

export const packages: Package[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: '$2,500',
    description:
      'Perfect for single-room refreshes and focused design guidance.',
    features: [
      'One-room design concept',
      'Mood board and color palette',
      'Furniture and decor sourcing list',
      '1 revision round',
      'Email support for 30 days',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: '$8,500',
    description:
      'Our most popular package for multi-room projects with full design support.',
    features: [
      'Up to 3 rooms fully designed',
      'Detailed floor plans and 3D renders',
      'Custom furniture and material selection',
      'Lighting and window treatment design',
      '3 revision rounds',
      'Priority support for 90 days',
    ],
    highlighted: true,
  },
  {
    id: 'luxury',
    name: 'Luxury Full Home',
    price: '$25,000+',
    description:
      'Complete home transformation with white-glove project management.',
    features: [
      'Full home design and execution',
      'Bespoke custom cabinetry and millwork',
      'Dedicated project manager',
      'Vendor coordination and installation',
      'Unlimited revisions during design phase',
      '12 months of post-completion support',
    ],
  },
];
