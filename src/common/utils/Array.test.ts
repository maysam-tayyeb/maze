import { createArray } from './Array';

describe('Array Utils', () => {
  it('creates arrays', () => {
    const arr = createArray();

    expect(arr.length).toBe(0);
    expect(arr[0]).toBeUndefined();
  });

  it('creates linear arrays', () => {
    const arr = createArray(10);

    expect(arr.length).toBe(10);
    expect(arr[0]).toBeUndefined();
  });

  it('creates two dimensional arrays', () => {
    const arr = createArray(10, 10);

    expect(arr.length).toBe(10);
    expect(arr[0].length).toBe(10);
    expect(arr[9].length).toBe(10);
    expect(arr[10]).toBeUndefined();
  });
});
