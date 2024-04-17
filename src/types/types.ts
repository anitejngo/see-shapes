export type Point = { x: number; y: number };

export type Shape = {
  color: string;
  points: Point[];
  isHidden: boolean;
  shouldDrawLines: boolean;
  shouldClose: boolean;
  shouldShowIndex: boolean;
  shouldShowCoordinates: boolean;
};

export interface FormValues {
  shapes: Shape[];
}
