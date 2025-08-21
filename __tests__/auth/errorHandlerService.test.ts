import { handleAuthError } from '@/services/errorHandlerService';

describe('handleAuthError', () => {
  it('mappe un code Firestore not-found', () => {
    const err = { code: 'firestore/not-found' } as any;
    const out = handleAuthError(err, 'fallback');
    expect(out).toBeInstanceOf(Error);
    expect(out.message.toLowerCase()).toContain('non trouvé');
  });

  it('fallback sur code inconnu', () => {
    const err = { code: 'weird/unknown' } as any;
    const out = handleAuthError(err, 'fallback message');
    expect(out).toBeInstanceOf(Error);
    expect(out.message).toContain('weird/unknown');
  });

  it('fallback si pas de code', () => {
    const err = { message: 'boom' } as any;
    const out = handleAuthError(err, 'fallback message');
    expect(out.message).toContain('boom');
  });
});