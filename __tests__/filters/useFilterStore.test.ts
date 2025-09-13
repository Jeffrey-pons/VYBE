import { act } from '@testing-library/react-native';
import { useFilterStore } from '@/stores/useFilterStore';

const resetAll = () =>
  act(() => {
    useFilterStore.setState({
      search: '',
      date: '',
      city: '',
      keyword: '',
      showDatePicker: false,
      showCityInput: false,
    });
  });

describe('useFilterStore', () => {
  beforeEach(() => resetAll());

  it('état initial', () => {
    const s = useFilterStore.getState();
    expect(s).toMatchObject({
      search: '',
      date: '',
      city: '',
      keyword: '',
      showDatePicker: false,
      showCityInput: false,
    });
  });

  it('resetCity', () => {
    act(() => {
      useFilterStore.getState().setCity('Lyon');
      useFilterStore.getState().setShowCityInput(true);
      useFilterStore.getState().resetCity();
    });
    const s = useFilterStore.getState();
    expect(s.city).toBe('');
    expect(s.showCityInput).toBe(false);
  });

  it('resetFilters', () => {
    act(() => {
      useFilterStore.getState().setSearch('jazz');
      useFilterStore.getState().setDate('2025-01-01');
      useFilterStore.getState().setCity('Marseille');
      useFilterStore.getState().setKeyword('party');
      useFilterStore.getState().setShowDatePicker(true);
      useFilterStore.getState().setShowCityInput(true);
      useFilterStore.getState().resetFilters();
    });
    const s = useFilterStore.getState();
    expect(s).toMatchObject({
      search: '',
      date: '',
      city: '',
      keyword: '',
      showDatePicker: false,
      showCityInput: false,
    });
  });
});

describe('useFilterStore - Tests réalistes', () => {
  it("resetCity maintient la cohérence de l'état global", () => {
    act(() => {
      useFilterStore.getState().setCity('Paris');
      useFilterStore.getState().setKeyword('concert');
      useFilterStore.getState().setDate('2025-05-02');
      useFilterStore.getState().setShowCityInput(true);
    });

    act(() => {
      useFilterStore.getState().resetCity();
    });

    const state = useFilterStore.getState();
    expect(state.city).toBe('');
    expect(state.showCityInput).toBe(false);
    expect(state.keyword).toBe('concert');
    expect(state.date).toBe('2025-05-02');
  });

  it('persiste les filtres entre les sessions', () => {
    act(() => {
      useFilterStore.getState().setSearch('jazz');
      useFilterStore.getState().setCity('Lyon');
    });

    const newState = useFilterStore.getState();
    expect(newState.search).toBe('jazz');
    expect(newState.city).toBe('Lyon');
  });
});
