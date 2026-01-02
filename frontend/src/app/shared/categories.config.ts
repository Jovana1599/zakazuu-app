export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'plivanje', name: 'Plivanje', icon: '🏊' },
  { id: 'fudbal', name: 'Fudbal', icon: '⚽' },
  { id: 'ples', name: 'Ples', icon: '💃' },
  { id: 'edukacija', name: 'Edukacija', icon: '📚' },
  { id: 'umetnost', name: 'Umetnost', icon: '🎨' },
  { id: 'gimnastika', name: 'Gimnastika', icon: '🤸' },
  { id: 'rodjendani', name: 'Rođendani', icon: '🎂' },
  { id: 'klizanje', name: 'Klizanje', icon: '⛸️' },
  { id: 'priroda', name: 'Boravak u prirodi', icon: '🌲' },
  { id: 'muzika', name: 'Muzika', icon: '🎵' },
  { id: 'jezici', name: 'Strani jezici', icon: '🌍' },
  { id: 'it', name: 'IT & Programiranje', icon: '💻' },
];
