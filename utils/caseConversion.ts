// utils/caseConversion.ts
export function snakeToCamel<T>(obj: any): T {
  const camelObj: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
      );
      camelObj[camelKey] = obj[key];
    }
  }

  return camelObj as T;
}
