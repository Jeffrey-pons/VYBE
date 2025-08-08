import { create } from 'zustand'

interface FilterState {
  // États des filtres
  search: string
  date: string
  city: string
  keyword: string
  
  // États UI
  showDatePicker: boolean
  showCityInput: boolean
  
  // Actions
  setSearch: (search: string) => void
  setDate: (date: string) => void
  setCity: (city: string) => void
  setKeyword: (keyword: string) => void
  setShowDatePicker: (show: boolean) => void
  setShowCityInput: (show: boolean) => void
  
  // Actions composées
  resetFilters: () => void
  resetCity: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  // États initiaux
  search: '',
  date: '',
  city: '',
  keyword: '',
  showDatePicker: false,
  showCityInput: false,
  
  // Actions simples
  setSearch: (search) => set({ search }),
  setDate: (date) => set({ date }),
  setCity: (city) => set({ city }),
  setKeyword: (keyword) => set({ keyword }),
  setShowDatePicker: (showDatePicker) => set({ showDatePicker }),
  setShowCityInput: (showCityInput) => set({ showCityInput }),
  
  // Actions composées
  resetFilters: () => set({
    search: '',
    date: '',
    city: '',
    keyword: '',
    showDatePicker: false,
    showCityInput: false,
  }),
  
  resetCity: () => set({
    city: '',
    showCityInput: false,
  }),
}))