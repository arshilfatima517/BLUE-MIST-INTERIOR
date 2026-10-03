export const WHATSAPP_NUMBER = '917819086039';
export const ADMIN_EMAIL = 'arshilfatima517@gmail.com';

export const currencySymbol: Record<string, string> = {
  USD: '$',
  INR: '₹',
};

export const formatPrice = (amount: number, currency: string): string => {
  const symbol = currencySymbol[currency] ?? '₹';
  if (currency === 'INR') {
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  }
  return `${symbol}${amount.toLocaleString('en-US')}`;
};

export const roomTypeSuggestions = [
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Dining Room',
  'Office',
  'Bathroom',
  'Full Home',
  'Balcony',
  'Study Room',
  'Kids Room',
];

export const roomSizeSuggestions = [
  'Small (under 100 sq ft)',
  'Medium (100-200 sq ft)',
  'Large (200-400 sq ft)',
  'Extra Large (400+ sq ft)',
  'Custom size',
];

export const designStyleSuggestions = [
  'Modern',
  'Minimalist',
  'Classic',
  'Transitional',
  'Scandinavian',
  'Japandi',
  'Industrial',
  'Luxury',
  'Bohemian',
  'Contemporary',
  'Not Sure Yet',
];

export const materialSuggestions = [
  { name: 'Solid Wood', priceINR: 25000, priceUSD: 300 },
  { name: 'MDF with Veneer', priceINR: 15000, priceUSD: 180 },
  { name: 'Plywood with Laminate', priceINR: 12000, priceUSD: 145 },
  { name: 'Marble', priceINR: 40000, priceUSD: 480 },
  { name: 'Glass & Metal', priceINR: 18000, priceUSD: 215 },
  { name: 'Rattan / Cane', priceINR: 10000, priceUSD: 120 },
  { name: 'Upholstered Fabric', priceINR: 14000, priceUSD: 170 },
  { name: 'Leather', priceINR: 30000, priceUSD: 360 },
];

export const colorSuggestions = [
  { name: 'Warm White', hex: '#faf8f5' },
  { name: 'Soft Beige', hex: '#e8ded3' },
  { name: 'Walnut Brown', hex: '#5c4e3d' },
  { name: 'Brushed Gold', hex: '#b8945f' },
  { name: 'Sage Green', hex: '#a8b5a0' },
  { name: 'Soft Navy', hex: '#3d4a5c' },
  { name: 'Charcoal', hex: '#3d3327' },
  { name: 'Blush Pink', hex: '#e8c5c5' },
  { name: 'Forest Green', hex: '#3d5a4a' },
  { name: 'Sky Blue', hex: '#b8c5cc' },
  { name: 'Terracotta', hex: '#c47d5a' },
  { name: 'Ivory Cream', hex: '#f5f0e8' },
];
