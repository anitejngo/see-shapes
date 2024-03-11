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
    if (shapePoints.length < 1) {
        return;
    }
    if (shapePoints.length < 2) {
        // Not enough points to draw a shape
        drawPoint(
            ctx,
            shape.points[0],
            minX,
            minY,
            zoomLevel,
            padding,
            canvas,
            shape.color
        );
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

const drawPoint = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    color: string
): void => {
    const x = (point.x - minX) * zoomLevel + padding;
    const y = canvas.height - ((point.y - minY) * zoomLevel + padding);

    // Draw a little circle at each point
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);

    ctx.strokeStyle = color;

    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};
