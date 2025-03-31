export function initials(...names: string[]): string {
  if (!names || Array.isArray(names) && names.length === 0) {
    return '';
  }

  // Split the name into words and get the first letter of each word
  const initials = names.map(name => name.charAt(0));

  // Join the initials together and return as uppercase
  return initials.join('').toUpperCase();
}
