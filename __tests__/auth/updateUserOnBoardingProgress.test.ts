import { updateUserOnboardingProgress } from '@/services/authService';
import { setDoc } from 'firebase/firestore';

describe('updateUserOnboardingProgress', () => {
  beforeEach(() => jest.clearAllMocks());

  it('merge les données de progression', async () => {
    await updateUserOnboardingProgress('uid_1', { city: 'Paris', hasConnectedMusic: true });
    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object),
      { city: 'Paris', hasConnectedMusic: true },
      { merge: true },
    );
  });
});
