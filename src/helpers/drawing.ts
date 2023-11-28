import { Point, ShapeData } from '../types/types';

export const drawPoint = (
    ctx: CanvasRenderingContext2D,
    point: Point,
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    showPointId: boolean
): void => {
    const x = (point.position.x - minX) * zoomLevel + padding;
    const y = canvas.height - ((point.position.y - minY) * zoomLevel + padding);

    // Draw a little circle at each point
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);

    // Set the stroke color for each circle
    ctx.strokeStyle = point.isInside ? 'red' : 'green';

    // Uncomment the following line if you want to fill the circles
    ctx.fillStyle = point.isInside ? 'red' : 'green';
    ctx.fill();
    ctx.closePath();
    ctx.stroke();

    if (showPointId) {
        // Display the 'id' above the point
        ctx.fillStyle = point.isInside ? 'red' : 'green';
        ctx.font = '10px Arial';
        const idText = point.id.slice(0, 8) + '..';
        ctx.fillText(idText, x - ctx.measureText(idText).width / 2, y - 10);
    }
};

export const drawShape = (
    ctx: CanvasRenderingContext2D,
    shapesData: ShapeData,
    color: string,
    minX: number,
    minY: number,
    zoomLevel: number,
    padding: number,
    canvas: HTMLCanvasElement,
    showShapeId: boolean
): void => {
    const middle = {
        x: (shapesData.shape[0].x + shapesData.shape[1].x) / 2,
        y: (shapesData.shape[0].y + shapesData.shape[3].y) / 2,
    };
    ctx.beginPath();
    shapesData.shape.forEach((point) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        const x = (point.x - minX) * zoomLevel + padding;
        const y = canvas.height - ((point.y - minY) * zoomLevel + padding); // Adjusted y-coordinate calculation
        ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // Display the 'id' in shape
    if (showShapeId) {
        const idText = shapesData.id.slice(0, 8) + '..';
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        ctx.fillText(
            idText,
            (middle.x - minX) * zoomLevel +
                padding -
                ctx.measureText(idText).width / 2,
            canvas.height - ((middle.y - minY) * zoomLevel + padding) - 10
        );
    }
};
