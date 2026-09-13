export interface GameTheme {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  unlockRequirement: string;
  milestoneScore: number;
  // CSS Colors
  background: string;
  surface: string;
  surfaceElevated: string;
  board: string;
  cell: string;
  cellHover: string;
  cellBorder: string;
  text: string;
  textSecondary: string;
  mutedText: string;
  accent: string;
  accentGlow: string;
  borderSubtle: string;
  borderFocus: string;
  // Block Palette for Polyominoes (8 colors)
  blockColors: string[];
}

export const THEMES: GameTheme[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    subtitle: 'Classic Obsidian',
    description: 'Deep charcoal surfaces with high-contrast glowing jewel blocks.',
    unlockRequirement: 'Default Theme',
    milestoneScore: 0,
    background: '#0e1117',
    surface: '#161b22',
    surfaceElevated: '#1f242d',
    board: '#12161f',
    cell: '#1a202c',
    cellHover: '#222938',
    cellBorder: 'rgba(255, 255, 255, 0.05)',
    text: '#f3f4f6',
    textSecondary: '#9ca3af',
    mutedText: '#6b7280',
    accent: '#3b82f6',
    accentGlow: 'rgba(59, 130, 246, 0.35)',
    borderSubtle: 'rgba(255, 255, 255, 0.08)',
    borderFocus: 'rgba(59, 130, 246, 0.5)',
    blockColors: [
      '#3B82F6', // Sapphire Blue
      '#F59E0B', // Amber
      '#10B981', // Emerald
      '#EF4444', // Coral Red
      '#8B5CF6', // Purple
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#EC4899', // Pink
    ],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    subtitle: 'Marine Abyss',
    description: 'Deep aquatic blues, cyan highlights, and seafoam tones.',
    unlockRequirement: 'Clear entire board or reach 1,000 pts',
    milestoneScore: 1000,
    background: '#071324',
    surface: '#0d1e38',
    surfaceElevated: '#132b4f',
    board: '#09182d',
    cell: '#102544',
    cellHover: '#16335e',
    cellBorder: 'rgba(56, 189, 248, 0.08)',
    text: '#f0f9ff',
    textSecondary: '#93c5fd',
    mutedText: '#60a5fa',
    accent: '#06b6d4',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    borderSubtle: 'rgba(56, 189, 248, 0.12)',
    borderFocus: 'rgba(6, 182, 212, 0.55)',
    blockColors: [
      '#0284C7', // Ocean Blue
      '#06B6D4', // Cyan
      '#14B8A6', // Teal
      '#38BDF8', // Sky Blue
      '#2DD4BF', // Seafoam
      '#6366F1', // Indigo Wave
      '#0EA5E9', // Light Azure
      '#22D3EE', // Aquamarine
    ],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    subtitle: 'Twilight Horizon',
    description: 'Warm dusk twilight with radiant coral, magenta, and amber blocks.',
    unlockRequirement: 'Clear entire board or reach 2,500 pts',
    milestoneScore: 2500,
    background: '#1a0f1e',
    surface: '#26162d',
    surfaceElevated: '#341f3e',
    board: '#1e1124',
    cell: '#2b1834',
    cellHover: '#382043',
    cellBorder: 'rgba(244, 63, 94, 0.08)',
    text: '#fff1f2',
    textSecondary: '#fda4af',
    mutedText: '#f43f5e',
    accent: '#f43f5e',
    accentGlow: 'rgba(244, 63, 94, 0.4)',
    borderSubtle: 'rgba(244, 63, 94, 0.12)',
    borderFocus: 'rgba(244, 63, 94, 0.55)',
    blockColors: [
      '#F43F5E', // Rose
      '#FB923C', // Warm Orange
      '#F59E0B', // Amber Sun
      '#E11D48', // Crimson Dusk
      '#C026D3', // Fuchsia
      '#A855F7', // Purple Twilight
      '#FB7185', // Coral Pink
      '#EA580C', // Deep Tangerine
    ],
  },
  {
    id: 'forest',
    name: 'Forest',
    subtitle: 'Nordic Moss',
    description: 'Calm evergreen hues, misty moss tones, and natural jade blocks.',
    unlockRequirement: 'Clear entire board or reach 5,000 pts',
    milestoneScore: 5000,
    background: '#0a1712',
    surface: '#11241d',
    surfaceElevated: '#183329',
    board: '#0c1b15',
    cell: '#142c22',
    cellHover: '#1c3d30',
    cellBorder: 'rgba(52, 211, 153, 0.08)',
    text: '#ecfdf5',
    textSecondary: '#a7f3d0',
    mutedText: '#6ee7b7',
    accent: '#10b981',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    borderSubtle: 'rgba(52, 211, 153, 0.12)',
    borderFocus: 'rgba(16, 185, 129, 0.55)',
    blockColors: [
      '#10B981', // Emerald
      '#059669', // Dark Jade
      '#34D399', // Mint
      '#84CC16', // Lime Leaf
      '#14B8A6', // Pine Teal
      '#65A30D', // Moss Green
      '#0D9488', // Deep Sage
      '#F59E0B', // Golden Amber
    ],
  },
  {
    id: 'minimal-dawn',
    name: 'Minimal Dawn',
    subtitle: 'Scandinavian Warmth',
    description: 'Soft warm cream surfaces with calm, sophisticated pastel blocks.',
    unlockRequirement: 'Clear entire board or reach 8,000 pts',
    milestoneScore: 8000,
    background: '#f7f5f0',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    board: '#e8e5dc',
    cell: '#dad6cb',
    cellHover: '#cfcbbe',
    cellBorder: 'rgba(0, 0, 0, 0.04)',
    text: '#1f2937',
    textSecondary: '#4b5563',
    mutedText: '#9ca3af',
    accent: '#4f46e5',
    accentGlow: 'rgba(79, 70, 229, 0.25)',
    borderSubtle: 'rgba(0, 0, 0, 0.08)',
    borderFocus: 'rgba(79, 70, 229, 0.5)',
    blockColors: [
      '#4F46E5', // Nordic Indigo
      '#D97706', // Warm Ochre
      '#059669', // Nordic Pine
      '#DC2626', // Terracotta
      '#7C3AED', // Soft Violet
      '#0891B2', // Slate Cyan
      '#EA580C', // Clay Orange
      '#BE185D', // Dusty Rose
    ],
  },
  {
    id: 'aurora',
    name: 'Aurora',
    subtitle: 'Cosmic Borealis',
    description: 'Deep galactic space illuminated by iridescent polar light blocks.',
    unlockRequirement: 'Clear entire board or reach 12,000 pts',
    milestoneScore: 12000,
    background: '#080814',
    surface: '#101026',
    surfaceElevated: '#171738',
    board: '#0c0c1e',
    cell: '#151532',
    cellHover: '#1f1f4a',
    cellBorder: 'rgba(168, 85, 247, 0.1)',
    text: '#faf5ff',
    textSecondary: '#d8b4fe',
    mutedText: '#c084fc',
    accent: '#8b5cf6',
    accentGlow: 'rgba(139, 92, 246, 0.45)',
    borderSubtle: 'rgba(168, 85, 247, 0.14)',
    borderFocus: 'rgba(139, 92, 246, 0.6)',
    blockColors: [
      '#8B5CF6', // Electric Violet
      '#06B6D4', // Aurora Teal
      '#10B981', // Boreal Green
      '#F43F5E', // Solar Magenta
      '#6366F1', // Deep Starlight
      '#EC4899', // Polar Pink
      '#3B82F6', // Cosmic Blue
      '#A855F7', // Royal Nebula
    ],
  },
];

export function getThemeById(id: string): GameTheme {
  const found = THEMES.find(t => t.id === id);
  return found || THEMES[0];
}

export function getNextLockedTheme(unlockedIds: string[]): GameTheme | null {
  for (const theme of THEMES) {
    if (!unlockedIds.includes(theme.id)) {
      return theme;
    }
  }
  return null;
}

/**
 * Injects CSS variables onto document.documentElement for dynamic theme switching
 */
export function applyTheme(theme: GameTheme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--bg-app', theme.background);
  root.style.setProperty('--bg-surface', theme.surface);
  root.style.setProperty('--bg-surface-elevated', theme.surfaceElevated);
  root.style.setProperty('--bg-board', theme.board);
  root.style.setProperty('--cell-empty', theme.cell);
  root.style.setProperty('--cell-empty-hover', theme.cellHover);
  root.style.setProperty('--cell-empty-border', theme.cellBorder);
  root.style.setProperty('--text-primary', theme.text);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--text-muted', theme.mutedText);
  root.style.setProperty('--accent-primary', theme.accent);
  root.style.setProperty('--accent-glow', theme.accentGlow);
  root.style.setProperty('--border-subtle', theme.borderSubtle);
  root.style.setProperty('--border-focus', theme.borderFocus);

  // Set theme data attribute for custom CSS selectors
  root.setAttribute('data-theme-id', theme.id);
  if (theme.id === 'minimal-dawn') {
    root.setAttribute('data-theme', 'light');
  } else {
    root.setAttribute('data-theme', 'dark');
  }

  // Update meta theme-color for mobile address bar
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme.background);
  }
}
