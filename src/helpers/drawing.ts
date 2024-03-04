import { Point } from '../types/types';

export const drawPoint = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    color?: string
): void => {
    const x = (point.x - minX) * zoomLevel + padding;
    const y = canvas.height - ((point.y - minY) * zoomLevel + padding);

    // Draw a little circle at each point
    ctx.beginPath();
    ctx.arc(x, y, 1.5, 0, 2 * Math.PI);

    ctx.strokeStyle = color ? color : 'green';

    ctx.fillStyle = color ? color : 'green';
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
};

export const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: Point[],
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    color?: string
): void => {
    if (shape.length < 2) {
        // Not enough points to draw a shape
        return;
    }

    ctx.beginPath();
    // Move to the first point
    const firstPoint = shape[0];
    const firstX = (firstPoint.x - minX) * zoomLevel + padding;
    const firstY =
        canvas.height - ((firstPoint.y - minY) * zoomLevel + padding);
    ctx.moveTo(firstX, firstY);

    // Draw lines to the rest of the points
    for (let i = 1; i < shape.length; i++) {
        const point = shape[i];
        const x = (point.x - minX) * zoomLevel + padding;
        const y = canvas.height - ((point.y - minY) * zoomLevel + padding);
        ctx.lineTo(x, y);
    }

    // Connect back to the first point to close the shape
    ctx.lineTo(firstX, firstY);

    // Set styles and draw
    ctx.strokeStyle = color ? color : 'green';
    ctx.stroke();
};
