export default {
  preset: 'react-native',
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/__tests__/integration'],
  setupFilesAfterEnv: ['<rootDir>/jest/setupInt.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // IMPORTANT: on transpile firebase & @firebase (ESM) + libs RN/Expo
  transformIgnorePatterns: [
    'node_modules/(?!(firebase|@firebase|react-native|@react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|expo-modules-core|@expo/.*|react-navigation|@react-navigation/.*)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // pour éviter la détection de tests en dehors du dossier integration
  testMatch: ['**/__tests__/integration/**/*.test.ts?(x)'],
};
