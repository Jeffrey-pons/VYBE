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

  it('setSearch / setDate / setCity / setKeyword', () => {
    act(() => {
      useFilterStore.getState().setSearch('rock');
      useFilterStore.getState().setDate('2025-05-02');
      useFilterStore.getState().setCity('Paris');
      useFilterStore.getState().setKeyword('electro');
    });
    const s = useFilterStore.getState();
    expect(s.search).toBe('rock');
    expect(s.date).toBe('2025-05-02');
    expect(s.city).toBe('Paris');
    expect(s.keyword).toBe('electro');
  });

  it('setShowDatePicker / setShowCityInput', () => {
    act(() => {
      useFilterStore.getState().setShowDatePicker(true);
      useFilterStore.getState().setShowCityInput(true);
    });
    const s = useFilterStore.getState();
    expect(s.showDatePicker).toBe(true);
    expect(s.showCityInput).toBe(true);
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
