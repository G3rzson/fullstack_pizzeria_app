export const LOGIN_INFO = {
  success: "Sikeres bejelentkezés!",
  error: "Sikertelen bejelentkezés!",
  validationError: "Hibás adatok!",
  serverError: "Szerver hiba történt!",
  userNotExist: "Hibás email vagy felhasználónév!",
};

export const ACCESS_TOKEN_EXPIRES_IN = "20m"; // 20 perc
export const REFRESH_TOKEN_EXPIRES_IN = "1d"; // 1 nap
export const ACCESS_TOKEN_MAX_AGE = 60 * 20; // 20 perc
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24; // 1 nap
