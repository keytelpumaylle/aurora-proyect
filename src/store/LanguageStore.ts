import { create } from 'zustand';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

interface LanguageState {
  selectedLanguage: Language;
  isModalOpen: boolean;
  availableLanguages: Language[];
  openModal: () => void;
  closeModal: () => void;
  setLanguage: (language: Language) => void;
}

const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'qu', name: 'Quechua', flag: '🏔️' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedLanguage: AVAILABLE_LANGUAGES[0], // Español por defecto
  isModalOpen: false,
  availableLanguages: AVAILABLE_LANGUAGES,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setLanguage: (language) => set({ selectedLanguage: language, isModalOpen: false }),
}));