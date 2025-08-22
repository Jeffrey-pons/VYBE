jest.setTimeout(30000);

jest.mock('@/stores/useLoginStore', () => {
  const resetLogin = jest.fn();
  const state = { resetLogin };
  const mock = Object.assign(jest.fn(() => state), { getState: () => state });
  return { __esModule: true, default: mock, useLoginStore: mock, __resetLoginMock: resetLogin };
});

jest.mock('@/stores/userStore', () => {
  const resetUserFields = jest.fn();
  const state = { resetUserFields };
  const mock = Object.assign(jest.fn(() => state), { getState: () => state });
  return { __esModule: true, default: mock, useUserStore: mock, __resetUserFieldsMock: resetUserFields };
});

// RN minimal (pas de requireActual pour éviter DevMenu)
jest.mock('react-native', () => ({
  Platform: {
  OS: 'ios',
  select: (o: { ios?: unknown; default?: unknown }) => (o?.ios ?? o?.default),
},
  Alert: { alert: jest.fn() },
  Linking: { openURL: jest.fn() },
  NativeModules: {},
  StyleSheet: { create: <T>(s: T) => s, },
}));

jest.mock('expo-router', () => ({ router: { replace: jest.fn(), push: jest.fn() } }));
