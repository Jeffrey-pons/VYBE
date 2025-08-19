import { registerUser } from '@/services/authService';
import type { RegisterDTO } from '@/dtos/AuthDto';
import * as validators from '@/utils/registerUtils';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

describe('registerUser', () => {
  const validData: RegisterDTO = {
    name: 'John',
    lastname: 'Doe',
    email: 'john@doe.tld',
    phoneNumber: '0600000000',
    password: 'Secret123!',
  };

  const isValidName = validators.isValidName as jest.MockedFunction<typeof validators.isValidName>;
  const isValidEmail = validators.isValidEmail as jest.MockedFunction<typeof validators.isValidEmail>;
  const isValidPhone = validators.isValidPhone as jest.MockedFunction<typeof validators.isValidPhone>;
  const isValidPassword = validators.isValidPassword as jest.MockedFunction<
    typeof validators.isValidPassword
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    isValidName.mockReturnValue(true);
    isValidEmail.mockReturnValue(true);
    isValidPhone.mockReturnValue(true);
    isValidPassword.mockReturnValue(true);
  });

  it('inscrit un utilisateur quand les validations passent', async () => {
    const res = await registerUser(validData);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(), 
      validData.email,
      validData.password
    );
    expect(setDoc).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalled();
    expect(res.user).toBeTruthy();
  });

  it("lève une ValidationError si le prénom est invalide", async () => {
    isValidName.mockReturnValue(false);
    await expect(registerUser(validData)).rejects.toThrow('Le prénom est invalide.');
  });

  it("lève une ValidationError si l'email est invalide", async () => {
    isValidName.mockReturnValue(true);
    isValidEmail.mockReturnValue(false);

    await expect(registerUser(validData)).rejects.toThrow("L'email est invalide.");
  });

  it("lève une ValidationError si le numéro de téléphone est invalide", async () => {
    isValidPhone.mockReturnValue(false);

    const data: RegisterDTO = { ...validData, phoneNumber: 'xxx' };
    await expect(registerUser(data)).rejects.toThrow('Le numéro de téléphone est invalide.');
  });

  it("lève une ValidationError si le mot de passe est invalide", async () => {
    isValidPassword.mockReturnValue(false);

    const data: RegisterDTO = { ...validData, password: '123' };
    await expect(registerUser(data)).rejects.toThrow('Le mot de passe est invalide.');
  });

  it('écrit les bons champs dans Firestore (payload attendu)', async () => {
    await registerUser(validData);

    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: 'John',
        lastname: 'Doe',
        mail: 'john@doe.tld',
        phoneNumber: '0600000000',
        createdAt: expect.any(Date),
      })
    );
  });

  it('relaye une erreur Firebase si la création échoue', async () => {
    const createMock = createUserWithEmailAndPassword as jest.MockedFunction<
      typeof createUserWithEmailAndPassword
    >;

    // Provoque une erreur Firebase
    createMock.mockRejectedValueOnce({ code: 'auth/email-already-in-use', message: 'Email in use' });

    await expect(registerUser(validData)).rejects.toBeInstanceOf(Error);
  });
});
