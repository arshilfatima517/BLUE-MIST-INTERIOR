import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type CSSProperties } from 'react';
import { Armchair, BedDouble, LampDesk, Move3d, Plus, RotateCw, Trash2, Tv, Utensils, X, ImageIcon, Sparkles } from 'lucide-react';

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  label: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  rotation: number;
  color: string;
}

type FurnitureType = 'sofa' | 'bed' | 'table' | 'lamp' | 'tv';

interface CatalogEntry {
  type: FurnitureType;
  label: string;
  icon: typeof Armchair;
  width: number;
  depth: number;
  color: string;
  accent: string;
}

const furnitureCatalog: CatalogEntry[] = [
  { type: 'sofa', label: 'Sofa', icon: Armchair, width: 24, depth: 12, color: '#b8945f', accent: '#a07f4a' },
  { type: 'bed', label: 'Bed', icon: BedDouble, width: 22, depth: 30, color: '#a8b5a0', accent: '#8e9c83' },
  { type: 'table', label: 'Table', icon: Utensils, width: 18, depth: 18, color: '#8c6e53', accent: '#6f5640' },
  { type: 'lamp', label: 'Lamp', icon: LampDesk, width: 9, depth: 9, color: '#c9a973', accent: '#a88a52' },
  { type: 'tv', label: 'TV Unit', icon: Tv, width: 22, depth: 8, color: '#5c4e3d', accent: '#46382b' },
];

const defaultItems: FurnitureItem[] = [
  { id: 'sofa-1', type: 'sofa', label: 'Sofa', x: 28, y: 22, width: 24, depth: 12, rotation: 0, color: '#b8945f' },
  { id: 'table-1', type: 'table', label: 'Coffee Table', x: 42, y: 55, width: 18, depth: 18, rotation: 0, color: '#8c6e53' },
  { id: 'tv-1', type: 'tv', label: 'TV Unit', x: 38, y: 83, width: 22, depth: 8, rotation: 0, color: '#5c4e3d' },
];

function matchFurnitureType(suggestion: string): FurnitureType | null {
  const s = suggestion.toLowerCase();
  if (s.includes('sofa') || s.includes('sectional') || s.includes('couch')) return 'sofa';
  if (s.includes('bed')) return 'bed';
  if (s.includes('lamp') || s.includes('light')) return 'lamp';
  if (s.includes('tv') || s.includes('media') || s.includes('entertainment')) return 'tv';
  if (s.includes('table') || s.includes('desk') || s.includes('dining') || s.includes('counter') || s.includes('shelf') || s.includes('cabinet') || s.includes('wardrobe') || s.includes('nightstand') || s.includes('chair') || s.includes('stool') || s.includes('rack')) return 'table';
  return null;
}

function itemsFromSuggestions(suggestions: string[]): FurnitureItem[] {
  const result: FurnitureItem[] = [];
  const positions = [
    { x: 28, y: 22 },
    { x: 55, y: 30 },
    { x: 40, y: 55 },
    { x: 22, y: 65 },
    { x: 65, y: 68 },
    { x: 45, y: 80 },
    { x: 30, y: 40 },
    { x: 60, y: 45 },
  ];
  let posIdx = 0;

  for (const sug of suggestions) {
    const type = matchFurnitureType(sug);
    if (!type) continue;
    const catalog = furnitureCatalog.find((c) => c.type === type)!;
    const pos = positions[posIdx % positions.length];
    posIdx++;
    result.push({
      id: `${type}-${Date.now()}-${posIdx}`,
      type,
      label: sug.length > 22 ? catalog.label : sug,
      x: pos.x,
      y: pos.y,
      width: catalog.width,
      depth: catalog.depth,
      rotation: 0,
      color: catalog.color,
    });
  }
  return result.length > 0 ? result : defaultItems;
}

function FurniturePiece({
  item,
  isSelected,
  onSelect,
  onDragStart,
}: {
  item: FurnitureItem;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: ReactPointerEvent<HTMLButtonElement>) => void;
}) {
  const catalogItem = furnitureCatalog.find((entry) => entry.type === item.type);
  const Icon = catalogItem?.icon ?? Armchair;
  const accent = catalogItem?.accent ?? item.color;
  const iconSize = Math.max(16, Math.min(30, item.width * 0.9));

  const wrapperStyle: CSSProperties = {
    left: `${item.x}%`,
    top: `${item.y}%`,
    width: `${item.width}%`,
    height: `${item.depth}%`,
    ['--rot' as string]: `${item.rotation}deg`,
    transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
  };

  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        onDragStart(e);
      }}
      onClick={(e) => e.stopPropagation()}
      className={`furniture-3d absolute touch-none select-none rounded-md ${isSelected ? 'is-selected' : ''}`}
      style={wrapperStyle}
      aria-label={`Move ${item.label}`}
    >
      <div
        className="furniture-top flex flex-col items-center justify-center gap-1 w-full h-full rounded-md"
        style={{
          background: `linear-gradient(155deg, ${item.color} 0%, ${item.color} 40%, ${accent} 100%)`,
          color: item.type === 'lamp' ? '#3d3327' : '#fff',
          border: `1px solid ${accent}`,
          boxShadow: isSelected
            ? '0 0 0 2px rgba(184,148,95,0.55), 0 8px 22px -4px rgba(61,51,39,0.4)'
            : '0 6px 18px -4px rgba(61,51,39,0.3)',
        }}
      >
        <Icon size={iconSize} strokeWidth={1.6} />
        <span className="font-sans-ui text-[10px] font-medium tracking-wide drop-shadow-sm">{item.label}</span>
      </div>
      <div
        className="furniture-side rounded-b-md"
        style={{ background: `linear-gradient(180deg, ${accent}, ${accent}dd)` }}
      />
      <div className="furniture-shadow" />
    </button>
  );
}

interface RoomEditorProps {
  imageUrl: string;
  roomTypeLabel?: string;
  furnitureSuggestions?: string[];
  onItemsChange?: (items: FurnitureItem[]) => void;
}

export default function RoomEditor({ imageUrl, roomTypeLabel, furnitureSuggestions, onItemsChange }: RoomEditorProps) {
  const [items, setItems] = useState<FurnitureItem[]>(defaultItems);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.id === selectedId);

  useEffect(() => {
    if (furnitureSuggestions && furnitureSuggestions.length > 0) {
      setItems(itemsFromSuggestions(furnitureSuggestions));
      setSelectedId(null);
    }
  }, [furnitureSuggestions]);

  useEffect(() => {
    if (onItemsChange) onItemsChange(items);
  }, [items, onItemsChange]);

  const addFurniture = (type: FurnitureType) => {
    const catalogItem = furnitureCatalog.find((item) => item.type === type);
    if (!catalogItem) return;
    const newItem: FurnitureItem = {
      id: `${type}-${Date.now()}`,
      type,
      label: catalogItem.label,
      x: 38,
      y: 42,
      width: catalogItem.width,
      depth: catalogItem.depth,
      rotation: 0,
      color: catalogItem.color,
    };
    setItems((current) => [...current, newItem]);
    setSelectedId(newItem.id);
    setShowCatalog(false);
  };

  const startDrag = (event: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const startX = event.clientX;
    const startY = event.clientY;
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const rect = canvas.getBoundingClientRect();
    const startItemX = item.x;
    const startItemY = item.y;

    const handleMove = (moveEvent: PointerEvent) => {
      const nextX = startItemX + ((moveEvent.clientX - startX) / rect.width) * 100;
      const nextY = startItemY + ((moveEvent.clientY - startY) / rect.height) * 100;
      setItems((current) => current.map((entry) => entry.id === id
        ? { ...entry, x: Math.max(5, Math.min(95, nextX)), y: Math.max(5, Math.min(95, nextY)) }
        : entry));
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const updateSelected = (field: 'width' | 'depth' | 'rotation', value: number) => {
    if (!selectedId) return;
    setItems((current) => current.map((item) => item.id === selectedId ? { ...item, [field]: value } : item));
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((current) => current.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#b8945f]/10 border border-[#b8945f]/20 rounded-md">
          <Move3d size={16} className="text-[#b8945f]" />
          <span className="font-sans-ui text-xs tracking-[0.2em] uppercase text-[#b8945f]">
            Interactive AI Render — Drag Furniture to Rearrange
          </span>
        </div>
        <p className="font-sans-ui text-xs text-[#5c4e3d]/55">{items.length} pieces — drag, resize & rotate</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_240px] items-start">
        <div>
          <div
            ref={canvasRef}
            onPointerDown={() => setSelectedId(null)}
            className="relative aspect-[4/3] min-h-[460px] overflow-hidden rounded-lg border border-[#cbbba8] shadow-[0_24px_50px_rgba(61,51,39,0.22)]"
          >
            <img
              src={imageUrl}
              alt="AI generated room render"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-black/15" />

            {items.map((item) => (
              <FurniturePiece
                key={item.id}
                item={item}
                isSelected={selectedId === item.id}
                onSelect={() => setSelectedId(item.id)}
                onDragStart={(e) => startDrag(e, item.id)}
              />
            ))}

            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded">
              <Sparkles size={14} className="text-[#c9a973]" />
              <span className="font-sans-ui text-xs tracking-[0.15em] uppercase text-white">AI Render + Live 3D</span>
            </div>

            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_50%_40%,transparent_55%,rgba(0,0,0,0.18)_100%)]" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setShowCatalog((current) => !current)}
              className="inline-flex items-center gap-2 bg-[#b8945f] px-5 py-3 font-sans-ui text-sm text-white rounded-md hover:bg-[#a07f4a] transition-all hover:shadow-md"
            >
              <Plus size={17} /> Add Furniture
            </button>
            <p className="font-sans-ui text-xs text-[#5c4e3d]/55">
              {roomTypeLabel ? `${roomTypeLabel} • ` : ''}{items.length} pieces in your room
            </p>
          </div>
          {showCatalog && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white border border-[#e8ded3] p-3 rounded-md animate-fade-in">
              {furnitureCatalog.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => addFurniture(item.type)}
                    className="flex flex-col items-center gap-2 border border-[#e8ded3] p-3 rounded-md text-[#5c4e3d] hover:border-[#b8945f] hover:text-[#b8945f] hover:shadow-sm transition-all"
                  >
                    <Icon size={22} />
                    <span className="font-sans-ui text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="bg-white border border-[#e8ded3] p-5 min-h-[180px] rounded-md">
          {selectedItem ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <p className="font-sans-ui text-xs tracking-[0.15em] uppercase text-[#b8945f]">Selected Piece</p>
                <button onClick={() => setSelectedId(null)} aria-label="Deselect furniture" className="text-[#5c4e3d]/40 hover:text-[#3d3327]"><X size={16} /></button>
              </div>
              <h3 className="font-serif text-xl text-[#3d3327] mb-5">{selectedItem.label}</h3>
              <label className="block font-sans-ui text-xs text-[#5c4e3d]/70 mb-2">Width</label>
              <input type="range" min="8" max="35" value={selectedItem.width} onChange={(event) => updateSelected('width', Number(event.target.value))} className="w-full accent-[#b8945f]" />
              <label className="block font-sans-ui text-xs text-[#5c4e3d]/70 mt-4 mb-2">Depth</label>
              <input type="range" min="6" max="35" value={selectedItem.depth} onChange={(event) => updateSelected('depth', Number(event.target.value))} className="w-full accent-[#b8945f]" />
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => updateSelected('rotation', (selectedItem.rotation + 15) % 360)} className="inline-flex items-center gap-2 font-sans-ui text-xs text-[#b8945f] hover:text-[#a07f4a]"><RotateCw size={15} /> Rotate 15°</button>
                <button onClick={removeSelected} className="inline-flex items-center gap-2 font-sans-ui text-xs text-red-500 hover:text-red-700"><Trash2 size={15} /> Remove</button>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[150px] flex-col items-center justify-center text-center">
              <ImageIcon size={26} className="text-[#b8945f] mb-3" />
              <p className="font-sans-ui text-sm text-[#3d3327]">Drag furniture on the image</p>
              <p className="font-sans-ui text-xs text-[#5c4e3d]/55 mt-1">Tap any piece to resize or rotate it.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
