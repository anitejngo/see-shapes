export type Point = { x: number; y: number };

export type Shape = {
  color: string;
  points: Point[];
  isHidden: boolean;
  shouldClose: boolean;
  shouldShowCoordinates: boolean;
};

export interface FormValues {
  shapes: Shape[];
}
