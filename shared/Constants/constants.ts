export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const BACKEND_RESPONSE_MESSAGES = {
  SUCCESS: "Sikeres művelet!",
  SERVER_ERROR: "Hiba történt! Kérlek, próbáld újra később.",
  UNAUTHORIZED: "Nincs jogosultságod ehhez a művelethez!",
  INVALID_ID: "Érvénytelen azonosító!",
  INVALID_DATA: "Érvénytelen adatok!",
  NOT_FOUND: "Menü nem található!",
  DUPLICATE_ERROR: "Felhasználónév vagy email már foglalt!",
};
