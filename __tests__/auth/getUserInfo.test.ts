import { getUserInfo } from '@/services/authService';
import { getDoc } from 'firebase/firestore';

describe('getUserInfo', () => {
  const getDocMock = getDoc as unknown as jest.MockedFunction<typeof getDoc>;

  beforeEach(() => jest.clearAllMocks());

  it('retourne un User si le doc existe', async () => {
    const user = await getUserInfo('uid_1');
    expect(user).toEqual(expect.objectContaining({ name: 'John', lastname: 'Doe' }));
  });

  it("jette AuthServiceError si l'utilisateur n'existe pas", async () => {
    getDocMock.mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    } as unknown as Awaited<ReturnType<typeof getDoc>>);

    await expect(getUserInfo('uid_missing')).rejects.toThrow('Utilisateur non trouvé.');
  });

  it('mappe une erreur via handleAuthError si getDoc rejette', async () => {
    getDocMock.mockRejectedValueOnce({ code: 'firestore/permission-denied' });
    await expect(getUserInfo('uid_err')).rejects.toBeInstanceOf(Error);
  });
});
