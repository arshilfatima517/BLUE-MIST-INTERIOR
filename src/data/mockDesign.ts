import type { DesignResult, AIRequest } from '@/types/ai-designer';

export function generateMockDesign(request: AIRequest): DesignResult {
  const styleMap: Record<string, { style: string; description: string; palette: { name: string; hex: string }[] }> = {
    Modern: {
      style: 'Modern Elegance',
      description: 'Clean lines, functional beauty, and a restrained palette that lets each piece breathe.',
      palette: [
        { name: 'Warm White', hex: '#faf8f5' },
        { name: 'Soft Gray', hex: '#d1d0cd' },
        { name: 'Walnut Brown', hex: '#5c4e3d' },
        { name: 'Brushed Gold', hex: '#b8945f' },
      ],
    },
    Minimalist: {
      style: 'Refined Minimalism',
      description: 'A calm, uncluttered space where every element serves a purpose and nothing is excess.',
      palette: [
        { name: 'Pure White', hex: '#ffffff' },
        { name: 'Light Beige', hex: '#e8ded3' },
        { name: 'Charcoal', hex: '#3d3327' },
        { name: 'Sage', hex: '#a8b5a0' },
      ],
    },
    Classic: {
      style: 'Timeless Classic',
      description: 'Symmetrical balance, rich materials, and traditional detailing that never goes out of style.',
      palette: [
        { name: 'Ivory', hex: '#f5f0e8' },
        { name: 'Antique Gold', hex: '#c9a973' },
        { name: 'Mahogany', hex: '#4a2c20' },
        { name: 'Forest Green', hex: '#3d5a4a' },
      ],
    },
    Scandinavian: {
      style: 'Scandinavian Warmth',
      description: 'Light woods, natural textures, and a cozy simplicity inspired by Nordic living.',
      palette: [
        { name: 'Off-White', hex: '#faf8f5' },
        { name: 'Light Oak', hex: '#d4c5b3' },
        { name: 'Soft Blue-Gray', hex: '#b8c5cc' },
        { name: 'Warm Taupe', hex: '#a09080' },
      ],
    },
    Industrial: {
      style: 'Modern Industrial',
      description: 'Raw textures, exposed elements, and a bold interplay of metal and wood.',
      palette: [
        { name: 'Concrete Gray', hex: '#9a9a96' },
        { name: 'Rust', hex: '#8b5e3c' },
        { name: 'Blackened Steel', hex: '#3d3d3d' },
        { name: 'Warm Amber', hex: '#c9a973' },
      ],
    },
    Luxury: {
      style: 'Contemporary Luxury',
      description: 'Sumptuous materials, bespoke detailing, and a sense of understated opulence.',
      palette: [
        { name: 'Champagne', hex: '#e8d5b0' },
        { name: 'Espresso', hex: '#3d3327' },
        { name: 'Antique Brass', hex: '#b8945f' },
        { name: 'Cream Silk', hex: '#f5f0e8' },
      ],
    },
    Japandi: {
      style: 'Japandi Serenity',
      description: 'A harmonious blend of Japanese simplicity and Scandinavian functionality.',
      palette: [
        { name: 'Rice Paper', hex: '#f5f0e8' },
        { name: 'Tea Brown', hex: '#6b5b4a' },
        { name: 'Moss Green', hex: '#8a9a7b' },
        { name: 'Stone Gray', hex: '#b8b5b0' },
      ],
    },
    Transitional: {
      style: 'Transitional Balance',
      description: 'The perfect bridge between traditional warmth and contemporary clean lines.',
      palette: [
        { name: 'Warm Cream', hex: '#f5f0e8' },
        { name: 'Soft Navy', hex: '#3d4a5c' },
        { name: 'Honey Oak', hex: '#c9a973' },
        { name: 'Mushroom', hex: '#b8a898' },
      ],
    },
  };

  const base = styleMap[request.preferredStyle] ?? styleMap.Modern;

  const furnitureByRoom: Record<string, string[]> = {
    'Living Room': [
      'A low-profile linen sofa in a neutral tone',
      'A marble-top coffee table with brass legs',
      'Two accent chairs with textured upholstery',
      'A media console in warm walnut wood',
    ],
    Bedroom: [
      'An upholstered platform bed with a tall headboard',
      'A pair of matching nightstands in light oak',
      'A velvet bench at the foot of the bed',
      'A freestanding wardrobe with matte black hardware',
    ],
    Kitchen: [
      'Custom flat-panel cabinetry in warm white',
      'A marble waterfall island with seating for four',
      'Integrated stainless steel appliances',
      'Pendant lights with brass detailing above the island',
    ],
    'Dining Room': [
      'A solid wood dining table for 6-8 guests',
      'Upholstered dining chairs in a soft neutral fabric',
      'A statement chandelier in aged brass',
      'A sideboard for storage and display',
    ],
    Office: [
      'A solid wood desk with cable management',
      'An ergonomic task chair in premium leather',
      'Floor-to-ceiling shelving in matching wood',
      'A reading nook with an accent armchair',
    ],
    'Full Home': [
      'A cohesive furniture collection across all rooms',
      'Custom built-ins for entryway and living areas',
      'A statement dining table and seating',
      'Bedroom suite with matching case goods',
    ],
  };

  const lightingSuggestions = [
    'Layered ambient lighting with dimmable recessed ceiling fixtures',
    'Task lighting through sculptural table and floor lamps',
    'Accent lighting to highlight architectural features and art',
    'Warm LED strips for under-cabinet and cove illumination',
  ];

  const decorationSuggestions = [
    'A large-scale abstract artwork as a focal point',
    'Layered textiles: wool throws, linen cushions, and a textured area rug',
    'Curated ceramics and sculptural objects on floating shelves',
    'Indoor plants in matte stoneware planters for organic warmth',
  ];

  const budgetMap: Record<string, string> = {
    'Under $5,000': '$3,200 - $4,800',
    '$5,000 - $15,000': '$8,000 - $14,500',
    '$15,000 - $30,000': '$18,000 - $28,000',
    '$30,000 - $50,000': '$35,000 - $48,000',
    '$50,000 - $100,000': '$55,000 - $95,000',
    '$100,000+': '$110,000 - $250,000+',
  };

  const furnitureList = furnitureByRoom[request.roomType] ?? furnitureByRoom['Living Room'];

  const baseBudget = parseInt(request.budget.replace(/[^0-9]/g, '').split('-')[0] || '5000', 10);
  const breakdown = [
    { item: 'Furniture', cost: `$${Math.round(baseBudget * 0.45).toLocaleString()}` },
    { item: 'Lighting', cost: `$${Math.round(baseBudget * 0.15).toLocaleString()}` },
    { item: 'Decor & Accessories', cost: `$${Math.round(baseBudget * 0.12).toLocaleString()}` },
    { item: 'Flooring & Rugs', cost: `$${Math.round(baseBudget * 0.13).toLocaleString()}` },
    { item: 'Window Treatments', cost: `$${Math.round(baseBudget * 0.08).toLocaleString()}` },
    { item: 'Design & Installation', cost: `$${Math.round(baseBudget * 0.07).toLocaleString()}` },
  ];

  const roomImages: Record<string, string> = {
    'Living Room': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    Bedroom: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200',
    Kitchen: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Dining Room': 'https://images.pexels.com/photos/6707631/pexels-photo-6707631.jpeg?auto=compress&cs=tinysrgb&w=1200',
    Office: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=1200',
    Bathroom: 'https://images.pexels.com/photos/3144580/pexels-photo-3144580.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'Full Home': 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
  };

  return {
    recommendedStyle: base.style,
    styleDescription: base.description,
    colorPalette: base.palette,
    furnitureSuggestions: furnitureList,
    lightingSuggestions,
    decorationSuggestions,
    estimatedBudget: budgetMap[request.budget] ?? '$8,000 - $14,500',
    budgetBreakdown: breakdown,
    imageUrl: roomImages[request.roomType] ?? roomImages['Living Room'],
  };
}
