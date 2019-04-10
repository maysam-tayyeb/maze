export const fillTile = (
  context: CanvasRenderingContext2D,
  fillStyle: string,
  x: number,
  y: number
): void => {
  context.fillStyle = fillStyle;
  context.fillRect(x * 10, y * 10, 10, 10);
};
