export interface WindowRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function keepWindowReachable(rect: WindowRect, bounds: WindowRect, titlebarHeight: number): WindowRect {
  return {
    ...rect,
    x: clamp(rect.x, bounds.x, bounds.x + Math.max(0, bounds.width - Math.min(rect.width, 112))),
    y: clamp(rect.y, bounds.y, bounds.y + Math.max(0, bounds.height - titlebarHeight))
  };
}

export function resizeWindowRect(
  origin: WindowRect,
  edge: ResizeEdge,
  delta: { x: number; y: number },
  bounds: WindowRect,
  titlebarHeight: number
): WindowRect {
  const minWidth = Math.min(480, Math.max(0, bounds.width - 16));
  const minHeight = Math.min(288, bounds.height);
  const width = edge.includes('e') || edge.includes('w')
    ? clamp(origin.width + (edge.includes('w') ? -delta.x : delta.x), minWidth, bounds.width)
    : origin.width;
  const height = edge.includes('n') || edge.includes('s')
    ? clamp(origin.height + (edge.includes('n') ? -delta.y : delta.y), minHeight, bounds.height)
    : origin.height;

  return keepWindowReachable({
    x: edge.includes('w') ? origin.x + origin.width - width : origin.x,
    y: edge.includes('n') ? origin.y + origin.height - height : origin.y,
    width,
    height
  }, bounds, titlebarHeight);
}
