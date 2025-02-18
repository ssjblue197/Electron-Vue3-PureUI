export function getNestedValue(
  obj: Record<string, unknown>,
  key: string,
) {
  // Replace brackets with dot notation and remove the closing brackets
  const keys = key.replace(/\[(\d+)\]/g, '.$1').split('.');
  return keys.reduce(
    (o, i) => (o && o[i] !== undefined ? o[i] : undefined),
    obj,
  );
}

export function setNestedValue(
  obj: Record<string, any>,
  key: string,
  value: unknown,
): void {
  // Split key into parts by converting array indices to dot notation
  const keys = key.replace(/\[(\d+)\]/g, '.$1').split('.');

  // Traverse the object and create nested objects/arrays if necessary
  keys.reduce((current, keyPart, index) => {
    // If we're at the last key part, set the value
    if (index === keys.length - 1) {
      current[keyPart] = value;
    } else {
      // If the next key part is a number, initialize it as an array if it's undefined
      if (!current[keyPart]) {
        current[keyPart] = isNaN(Number(keys[index + 1]))
          ? {}
          : [];
      }
      return current[keyPart];
    }
  }, obj);
}
