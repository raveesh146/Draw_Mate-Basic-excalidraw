export type Point = {
  x: number;
  y: number;
};

export type DrawElement = {
  id: string;
  type: 'line' | 'rectangle' | 'ellipse' | 'pencil';
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
  roughness: number;
  fill?: string;
};