export function getRandomElementFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomIntegerInRange(x: number, y: number): number {
  const min = Math.floor(Math.min(x, y));
  const max = Math.ceil(Math.max(x, y));
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSampleOfArray<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) {
    return arr;
  }

  const sample = [];
  let source = [...arr];
  while (sample.length < n) {
    const index = getRandomIntegerInRange(0, source.length - 1);
    sample.push(source[index]);
    source = [...source.slice(0, index), ...source.slice(index + 1)];
  }
  return sample;
}
