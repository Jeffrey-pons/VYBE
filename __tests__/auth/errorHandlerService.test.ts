import { handleAuthError } from '@/services/errorHandlerService';

type TestError = { code: string; message?: string };

describe('handleAuthError', () => {
  it('mappe un code Firestore not-found', () => {
    const err: TestError = { code: 'utilisateur non trouvé.' };
    const out = handleAuthError(err, 'fallback');
    expect(out).toBeInstanceOf(Error);
    expect(out.message.toLowerCase()).toContain('utilisateur non trouvé.');
  });

  it('fallback sur code inconnu', () => {
    const err: TestError = { code: 'Unknown' };
    const out = handleAuthError(err, 'fallback message');
    expect(out).toBeInstanceOf(Error);
    expect(out.message).toContain('Unknown');
  });

  it('fallback si pas de code', () => {
    const err: TestError = { code: 'Boom ?' };
    const out = handleAuthError(err, 'fallback message');
    expect(out.message).toContain('Boom ?');
  });
});