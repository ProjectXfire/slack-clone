export function formatName(text: string) {
  if (!text) return "";
  const textArray = text.split(" ");
  let letters = "";
  for (let i = 0; i < 2; i++) {
    if (!textArray[i]) continue;
    const firstLetter = textArray[i].charAt(0).toUpperCase();
    letters += firstLetter;
  }
  return letters;
}
