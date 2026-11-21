export interface CategoryIconConfig {
  color: string;
  label: string;
  iconName: string;
}

export function getCategoryIconConfig(category: string): CategoryIconConfig {
  switch (category) {
    case 'road_damage':
      return {
        color: '#D6A900', // Yellow-amber
        label: 'Road Damage',
        iconName: 'AlertTriangle',
      };
    case 'streetlight':
      return {
        color: '#FFD447', // Signal Yellow
        label: 'Streetlight',
        iconName: 'Zap',
      };
    case 'drainage':
      return {
        color: '#168C83', // Cyan/Teal
        label: 'Drainage & Sewage',
        iconName: 'Droplets',
      };
    case 'footpath':
      return {
        color: '#8A63C7', // Purple
        label: 'Footpath & Walkway',
        iconName: 'Footprints',
      };
    case 'waste_management':
      return {
        color: '#24613B', // Green
        label: 'Waste Management',
        iconName: 'Trash2',
      };
    case 'public_infrastructure':
    default:
      return {
        color: '#315CFF', // Electric Cobalt
        label: 'Public Infrastructure',
        iconName: 'Building2',
      };
  }
}

/**
 * Creates custom SVG HTML for Leaflet DivIcon
 */
export function createCustomMarkerHtml(category: string, priority?: string, isSelected?: boolean): string {
  const config = getCategoryIconConfig(category);
  const isCritical = priority === 'critical';
  const pinColor = isCritical ? '#A1262D' : config.color;
  const haloHtml = isSelected
    ? `<div class="absolute -inset-2 rounded-full border-2 border-brand-yellow animate-ping opacity-75"></div>`
    : '';

  return `
    <div class="relative flex items-center justify-center cursor-pointer group">
      ${haloHtml}
      <div style="background-color: ${pinColor}; box-shadow: 0 4px 12px rgba(0,0,0,0.25);" 
           class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white font-bold transition-transform group-hover:scale-110">
        <span style="font-size: 11px;">●</span>
      </div>
      <div style="border-top-color: ${pinColor};" 
           class="w-0 h-0 border-x-4 border-x-transparent border-t-6 absolute -bottom-1"></div>
    </div>
  `;
}
