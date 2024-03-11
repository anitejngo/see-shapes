import { calculateZoomLevel, findMinCoordinates } from './calculations';
import { drawShape } from './drawing';
import { Point, Shape } from '../types/types';
const PADDING = 100;

export const drawEverything = (
    canvasDiv: HTMLElement,
    canvas: any,
    shapes: Shape[]
) => {
    try {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Set canvas size to match parent div
            canvas.width = canvasDiv.clientWidth;
            canvas.height = canvasDiv.clientHeight;

            ctx.fillStyle = '#e6f0ff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const allPoints: Point[] = [
                ...shapes.flatMap((shapeArray) => shapeArray.points),
            ];

            const { minX, minY } = findMinCoordinates(allPoints);

            const zoomLevel = calculateZoomLevel(
                allPoints,
                canvas.width,
                canvas.height,
                PADDING
            );

            shapes.forEach((shape, index) => {
                drawShape(ctx, minX, minY, zoomLevel, PADDING, canvas, shape);
            });
        }
    } catch {
        console.log('error while drawing');
    }
};
