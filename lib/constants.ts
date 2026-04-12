export const CATEGORIES = [
  { id: 'elektronika',    label: 'Elektronika',      icon: '💻' },
  { id: 'obleceni',       label: 'Oblečení',          icon: '👕' },
  { id: 'nabytek',        label: 'Nábytek',           icon: '🛋️' },
  { id: 'auto-moto',      label: 'Auto-moto',         icon: '🚗' },
  { id: 'dum-zahrada',    label: 'Dům a zahrada',     icon: '🏡' },
  { id: 'sport',          label: 'Sport',             icon: '⚽' },
  { id: 'deti-hracky',    label: 'Děti a hračky',    icon: '🧸' },
  { id: 'knihy',          label: 'Knihy',             icon: '📚' },
  { id: 'zvirata',        label: 'Zvířata',           icon: '🐾' },
  { id: 'sluzby',         label: 'Služby',            icon: '🔧' },
  { id: 'ostatni',        label: 'Ostatní',           icon: '📦' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const CITIES = [
  'Mohelnice',
  'Zábřeh',
  'Šumperk',
  'Postřelmov',
  'Úsov',
  'Loštice',
  'Litovel',
  'Moravičany',
  'Mírov',
  'Pavlov',
  'Doubravice',
  'Třeština',
] as const

export type City = (typeof CITIES)[number]

export const SYMBOLIC_OPTIONS = [
  { id: 'cokolada', label: 'Čokoláda 🍫' },
  { id: 'kava',     label: 'Káva ☕' },
  { id: 'pivo',     label: 'Pivo 🍺' },
  { id: 'banany',   label: '5 banánů 🍌' },
  { id: 'vlastni',  label: 'Vlastní text ✏️' },
] as const

export const PRICE_TYPE_LABELS: Record<string, string> = {
  free:       'Zdarma',
  symbolic:   'Symbolická cena',
  fixed:      'Pevná cena',
  negotiable: 'Dohodou',
}

export const PRIMARY_COLOR = '#E84040'
