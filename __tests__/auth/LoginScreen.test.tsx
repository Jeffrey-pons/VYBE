import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import LoginScreen from '@/app/login';
import { router } from 'expo-router';

// ✅ Déclare avec préfixe "mock"
const mockHandleLogin = jest.fn();

// ⚠️ Mock AVANT l'import de tout ce qui utilise le hook, et utilise la variable "mock..."
jest.mock('@/hooks/useLogin', () => ({
  useLogin: () => ({ handleLogin: mockHandleLogin }),
}));

// Store mock (ok tel que, ne référence rien hors factory)
jest.mock('@/stores/useLoginStore', () => {
  let state = { email: '', password: '', isLoading: false };
  const setState = (partial: any) => { state = { ...state, ...partial }; };
  return {
    useLoginStore: () => ({
      ...state,
      setEmail: (email: string) => setState({ email }),
      setPassword: (password: string) => setState({ password }),
      setIsLoading: (isLoading: boolean) => setState({ isLoading }),
    }),
  };
});

jest.mock('expo-router', () => ({ router: { replace: jest.fn() } }));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('navigue vers register', () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Inscrivez-vous ici'));
    expect(router.replace).toHaveBeenCalledWith('/register');
  });
});
