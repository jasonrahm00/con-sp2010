function stripSpaces(strng) {
  return strng !== null ? strng.replace(/[\u200B]/g, '') : null;
}