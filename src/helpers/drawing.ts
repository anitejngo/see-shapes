import { Point, Shape } from '../types/types';

export const drawShape = (
    ctx: CanvasRenderingContext2D,
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    shape: Shape
): void => {
    if (shape.isHidden) {
        return;
    }

    const shapePoints = shape.points;
    if (shapePoints.length < 2) {
        // Not enough points to draw a shape
        return;
    }

    ctx.beginPath();
    // Move to the first point
    const firstPoint = shapePoints[0];
    const firstX = (firstPoint.x - minX) * zoomLevel + padding;
    const firstY =
        canvas.height - ((firstPoint.y - minY) * zoomLevel + padding);
    ctx.moveTo(firstX, firstY);

    // Draw lines to the rest of the points
    for (let i = 1; i < shapePoints.length; i++) {
        const point = shapePoints[i];
        const x = (point.x - minX) * zoomLevel + padding;
        const y = canvas.height - ((point.y - minY) * zoomLevel + padding);
        ctx.lineTo(x, y);
    }

    // Connect back to the first point to close the shape
    if (shape.shouldClose) {
        ctx.lineTo(firstX, firstY);
    }
    // Set styles and draw
    ctx.strokeStyle = shape.color;
    ctx.stroke();
};
