export const extractTargetPhrase = (sentence: string, phrase: string) => {
  const index = sentence.toLowerCase().indexOf(phrase.toLowerCase());
  if (index !== -1) {
    return sentence.substring(index, index + phrase.length);
  }
  return phrase; // Return the original phrase if not found (as a fallback)
};
