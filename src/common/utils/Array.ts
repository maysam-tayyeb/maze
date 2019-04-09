export const createArray = (...lengths: number[]) => {
  const array = new Array(lengths[0] || 0);
  let i = lengths[0];

  if (lengths.length > 1) {
    const args = Array.prototype.slice.call(lengths, 1);
    while (i--) {
      array[lengths[0] - 1 - i] = createArray(...args);
    }
  }

  return array;
};
