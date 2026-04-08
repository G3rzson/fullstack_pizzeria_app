export function createPassword() {
  const length = 12;

  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const allChars = lowercase + uppercase + numbers;

  let passwordArray = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ];

  for (let i = passwordArray.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    passwordArray.push(allChars[randomIndex]);
  }

  // shuffle (Fisher-Yates)
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
}
