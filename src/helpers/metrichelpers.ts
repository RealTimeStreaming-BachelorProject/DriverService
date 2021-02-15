export function dataToBytes(data: any): number {
  return new TextEncoder().encode(JSON.stringify(data)).length;
}
