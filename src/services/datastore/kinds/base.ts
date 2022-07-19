export class BaseKind<
  T extends Record<string, string | number | Date | undefined>
> {
  private readonly keyPair: [string, string];
  readonly data: T;

  constructor(data: T, keyName: keyof T) {
    if (!data[keyName]) {
      throw new Error(
        `Entity is missing value for ${String(keyName)} used as key`
      );
    }
    if (typeof data[keyName] !== "string") {
      throw new Error(
        `Value of field ${String(keyName)} used for the key must be a string`
      );
    }
    this.keyPair = [this.constructor.name, data[keyName] as string];
    this.data = data;
  }

  get entity(): {
    keyPair: [string, string];
    data: T;
  } {
    return {
      data: this.data,
      keyPair: this.keyPair,
    };
  }
}
