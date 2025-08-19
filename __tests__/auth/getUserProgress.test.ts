import { getUserProgress } from '@/services/authService';
import { getDoc } from 'firebase/firestore';

describe('getUserProgress', () => {
  const getDocMock = getDoc as unknown as jest.MockedFunction<typeof getDoc>;

  beforeEach(() => jest.clearAllMocks());

  it('retourne les données si le doc existe', async () => {
    const res = await getUserProgress('uid_1');
    expect(res).toEqual(
      expect.objectContaining({ name: 'John', lastname: 'Doe' }),
    );
  });

  it("retourne null si le doc n'existe pas", async () => {
    getDocMock.mockResolvedValueOnce({
      exists: () => false,
      data: () => ({}),
    } as unknown as Awaited<ReturnType<typeof getDoc>>);

    const res = await getUserProgress('uid_2');
    expect(res).toBeNull();
  });

  it('propage une erreur si getDoc rejette', async () => {
    getDocMock.mockRejectedValueOnce(new Error('boom'));
    await expect(getUserProgress('uid_3')).rejects.toThrow('boom');
  });
});
