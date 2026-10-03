export interface DesignResult {
  recommendedStyle: string;
  styleDescription: string;
  colorPalette: { name: string; hex: string }[];
  furnitureSuggestions: string[];
  lightingSuggestions: string[];
  decorationSuggestions: string[];
  estimatedBudget: string;
  budgetBreakdown: { item: string; cost: string }[];
  imageUrl?: string;
}

export interface AIRequest {
  roomType: string;
  roomSize: string;
  preferredStyle: string;
  preferredColors: string;
  budget: string;
  furnitureRequirements: string;
}
