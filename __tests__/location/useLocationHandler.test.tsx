import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { useLocationHandler } from '@/hooks/useLocationHandler';

jest.mock('@/contexts/LocationContext', () => ({
  useLocation: jest.fn(),
}));

jest.mock('@/services/locationService', () => ({
  getLocation: jest.fn(),
  updateUserCity: jest.fn(),
}));

jest.mock('@/services/authService', () => ({
  updateUserOnboardingProgress: jest.fn(),
}));

const { useLocation } = jest.requireMock('@/contexts/LocationContext');
const { getLocation, updateUserCity } = jest.requireMock('@/services/locationService');
const { updateUserOnboardingProgress } = jest.requireMock('@/services/authService');

const setupLocation = (city: string | null = '') => {
  const updateLocation = jest.fn();
  (useLocation as jest.Mock).mockReturnValue({ city, updateLocation });
  return { updateLocation };
};

// Petit hôte pour récupérer les méthodes du hook
function HookHost({ onReady }: { onReady: (h: ReturnType<typeof useLocationHandler>) => void }) {
  const h = useLocationHandler();
  React.useEffect(() => {
    onReady(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [h]);
  return null;
}

describe('useLocationHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-expect-error - jsdom
    global.alert = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore?.();
  });

  it('handleCitySelect -> updateLocation + updateUserCity', async () => {
    const { updateLocation } = setupLocation('');
    (updateUserCity as jest.Mock).mockResolvedValue(undefined);

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleCitySelect('Paris');
    });

    expect(updateLocation).toHaveBeenCalledWith('Paris');
    expect(updateUserCity).toHaveBeenCalledWith('Paris');
  });

  it('handleUseLocation -> appelle getLocation puis MAJ ville', async () => {
    const { updateLocation } = setupLocation('');
    (getLocation as jest.Mock).mockImplementation(
      async ({ onCityDetected }: { onCityDetected: (c: string) => void }) => {
        onCityDetected('Nantes');
      }
    );
    (updateUserCity as jest.Mock).mockResolvedValue(undefined);

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleUseLocation();
    });

    expect(getLocation).toHaveBeenCalled();
    expect(updateLocation).toHaveBeenCalledWith('Nantes');
    expect(updateUserCity).toHaveBeenCalledWith('Nantes');
  });

  it('cooldown expiré (>5s) : 2 appels autorisés', async () => {
    setupLocation('');

    const nowSpy = jest.spyOn(Date, 'now');
    nowSpy.mockReturnValueOnce(10_000); // 1er appel
    nowSpy.mockReturnValueOnce(16_000); // 2e appel (6s après)

    (getLocation as jest.Mock).mockResolvedValue(undefined);

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleUseLocation();
      await hook.handleUseLocation();
    });

    expect(getLocation).toHaveBeenCalledTimes(2);
    nowSpy.mockRestore();
  });

  it('handleUseLocation -> onCityDetected OK mais updateUserCity échoue -> log erreur néanmoins updateLocation est appelé', async () => {
    const { updateLocation } = setupLocation('');
    (getLocation as jest.Mock).mockImplementation(
      async ({ onCityDetected }: { onCityDetected: (c: string) => void }) => {
        onCityDetected('Rennes');
      }
    );
    (updateUserCity as jest.Mock).mockRejectedValue(new Error('db fail'));

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleUseLocation();
    });

    // La ville est fixée dans le contexte, même si Firestore échoue
    expect(updateLocation).toHaveBeenCalledWith('Rennes');
    expect(console.error).toHaveBeenCalled();
  });

  it('handleUseLocation -> erreur (getLocation rejette) -> alert', async () => {
    setupLocation('');
    (getLocation as jest.Mock).mockRejectedValue(new Error('gps off'));

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleUseLocation();
    });

    expect(global.alert).toHaveBeenCalledWith('Impossible de détecter votre ville.');
  });

  it('handleCityNext -> sans ville -> alert', async () => {
    setupLocation(''); // pas de ville

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleCityNext({ uid: 'u1' });
    });

    expect(global.alert).toHaveBeenCalledWith(
      'Vous devez entrer une ville ou utiliser la géolocalisation avant de continuer.'
    );
  });

  it('handleCityNext -> avec ville + user -> appelle updateUserOnboardingProgress', async () => {
    setupLocation('Paris');
    (updateUserOnboardingProgress as jest.Mock).mockResolvedValue(undefined);

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      await hook.handleCityNext({ uid: 'u1' });
    });

    expect(updateUserOnboardingProgress).toHaveBeenCalledWith('u1', { city: 'Paris' });
  });

  it('handleCityNext -> avec ville + user null -> ne rappelle pas updateUserOnboardingProgress', async () => {
    setupLocation('Lyon');

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    await act(async () => {
      // @ts-expect-error: on force null pour tester la branche
      await hook.handleCityNext(null);
    });

    expect(updateUserOnboardingProgress).not.toHaveBeenCalled();
  });

  it('toggleCitySelector -> alterne true/false', async () => {
    setupLocation('');

    let hook!: ReturnType<typeof useLocationHandler>;
    render(<HookHost onReady={(h) => (hook = h)} />);

    expect(hook.showCitySelector).toBe(false);
    act(() => hook.toggleCitySelector());
    await waitFor(() => expect(hook.showCitySelector).toBe(true));
    act(() => hook.toggleCitySelector());
    await waitFor(() => expect(hook.showCitySelector).toBe(false));
  });
});
