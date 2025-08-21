export const isValidEmail = (email: string): boolean => {
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex =  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2,})(?:\.[a-zA-Z]{2,})?$/;
  return emailRegex.test(trimmedEmail);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-().]/g, '');

  const frenchPattern = /^0[1-9]\d{8}$/;
  const internationalPattern = /^\+33[1-9]\d{8}$/;

  return frenchPattern.test(cleaned) || internationalPattern.test(cleaned);
};

export const isValidName = (name: string) => {
  return /^[a-zA-ZÀ-ÿ'-\s]{2,50}$/.test(name.trim());
};

export const isValidPassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/#^+=.])[A-Za-z\d@$!%*?&/#^+=.]{8,}$/.test(
    password,
  );
};
