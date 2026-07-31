declare function describe(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void): void;
declare function expect(value: any): {
  toBe(expected: any): void;
  toContain(expected: any): void;
  toBeGreaterThan(expected: number): void;
};
