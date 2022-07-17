export function flatten(
  inputObject: Record<string, unknown>
): Record<string, unknown> {
  const toReturn: Record<string, unknown> = {};

  for (const i in inputObject) {
    if (!Object.prototype.hasOwnProperty.call(inputObject, i)) {
      continue;
    }

    if (typeof inputObject[i] === "object") {
      const flatObject = flatten(inputObject[i] as Record<string, unknown>);
      for (const x in flatObject) {
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) {
          continue;
        }

        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = inputObject[i];
    }
  }
  return toReturn;
}
