import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider } from '@/contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';

// ---------- Router mock (objet partagé !) ----------
const mockRouter = { replace: jest.fn(), push: jest.fn(), back: jest.fn() };
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  router: mockRouter,
}));

// ---------- Firebase mocks ----------
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  doc: jest.fn(),
}));

// ---------- Contexts mocks ----------
const mockSetLoading = jest.fn();
jest.mock('@/contexts/LoadingContext', () => ({
  useLoading: () => ({ setLoading: mockSetLoading }),
}));

const mockUpdateLocation = jest.fn();
jest.mock('@/contexts/LocationContext', () => ({
  useLocation: () => ({ updateLocation: mockUpdateLocation }),
}));

const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => <>{children}</>;

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('user null -> route /home', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb(null); // synchrone
      return () => {};
    });

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it('user + doc avec city + flags -> /activenotification + updateLocation(city)', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: 'u1' });
      return () => {};
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ city: 'Paris', hasActiveNotification: true, hasConnectedMusic: true }),
    });

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockUpdateLocation).toHaveBeenCalledWith('Paris');
      expect(mockRouter.replace).toHaveBeenCalledWith('/activenotification');
    });
  });

  it('user + doc avec city mais flags incomplets -> /connectmusic', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: 'u2' });
      return () => {};
    });

    (getDoc as jest.Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ city: 'Lyon', hasActiveNotification: true, hasConnectedMusic: false }),
    });

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockUpdateLocation).toHaveBeenCalledWith('Lyon');
      expect(mockRouter.replace).toHaveBeenCalledWith('/connectmusic');
    });
  });

  it('user + doc absent -> /home', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((_auth, cb) => {
      cb({ uid: 'u3' });
      return () => {};
    });

    (getDoc as jest.Mock).mockResolvedValue({ exists: () => false });

    render(
      <AuthProvider>
        <Wrapper />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/home');
    });
  });
});
