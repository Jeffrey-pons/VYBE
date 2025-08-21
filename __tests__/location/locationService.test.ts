import * as Location from 'expo-location';
import { getLocation, updateUserCity } from '@/services/locationService';
import { getAuth } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';

const originalFetch: typeof global.fetch = global.fetch;

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

jest.mock('firebase/auth', () => {
  const getAuth = jest.fn(() => ({}));
  return { getAuth };
});

jest.mock('firebase/firestore', () => {
  const doc = jest.fn((_db: unknown, _col: string, id: string) => ({ id }));
  const updateDoc = jest.fn(async () => {});
  return { doc, updateDoc };
});

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  (console.error as jest.Mock).mockRestore?.();
  global.fetch = originalFetch;
});

describe('locationService.getLocation', () => {
  it('permission refusée → pas de callback et log erreur', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(onCityDetected).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('construit une URL Nominatim correcte avec lat/lon', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 48.8566, longitude: 2.3522 },
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ address: { city: 'Paris' } }),
    });

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('https://nominatim.openstreetmap.org/reverse');
    expect(calledUrl).toContain('lat=48.8566');
    expect(calledUrl).toContain('lon=2.3522');
    expect(calledUrl).toContain('format=json');

    expect(onCityDetected).toHaveBeenCalledWith('Paris');
  });

  it('fallback town quand city est absente', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ address: { town: 'St-Malo' } }),
    });

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(onCityDetected).toHaveBeenCalledWith('St-Malo');
  });

  it('fallback village quand city/town sont absents', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ address: { village: 'Le Hameau' } }),
    });

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(onCityDetected).toHaveBeenCalledWith('Le Hameau');
  });

  it('réponse sans address → pas de callback, log erreur', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({}),
    });

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(onCityDetected).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('fetch rejette → pas de callback, log erreur', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
      coords: { latitude: 1, longitude: 2 },
    });
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network down'));

    const onCityDetected = jest.fn();
    await getLocation({ onCityDetected });

    expect(onCityDetected).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });
});

describe('locationService.updateUserCity', () => {
  it('throw si aucun user', async () => {
    // getAuth() → {}
    (getAuth as jest.Mock).mockReturnValue({ currentUser: null });

    await expect(updateUserCity('Paris')).rejects.toThrow('Utilisateur non connecté');
    expect(updateDoc).not.toHaveBeenCalled();
  });

  it('met à jour la ville si user courant présent', async () => {
    (getAuth as jest.Mock).mockReturnValue({ currentUser: { uid: 'u1' } });

    await updateUserCity('Lyon');

    expect(doc).toHaveBeenCalledWith(expect.anything(), 'users', 'u1');
    expect(updateDoc).toHaveBeenCalledWith({ id: 'u1' }, { city: 'Lyon' });
  });
});
