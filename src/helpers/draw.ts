import {
    calculateZoomLevel,
    findMinCoordinates,
    getRandomBasicColor,
} from './calculations';
import { drawPoint, drawShape } from './drawing';
import { Point, Shape } from '../types/types';
const PADDING = 100;

export const drawEverything = (
    canvas: any,
    roofPointsData: Shape,
    anyPointsData: Shape[][],
    indexesToShow: string[]
) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
        canvas.width = 800;
        canvas.height = 800;
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const allPoints: Point[] = [
            ...roofPointsData,
            ...anyPointsData.flatMap((shapeArray) =>
                shapeArray.flatMap((shape) => shape)
            ),
        ];

        const { minX, minY } = findMinCoordinates(allPoints);

        const zoomLevel = calculateZoomLevel(
            allPoints,
            canvas.width,
            canvas.height,
            PADDING
        );

        drawShape(
            ctx,
            roofPointsData,
            minX,
            minY,
            zoomLevel,
            PADDING,
            canvas,
            'red'
        );

        anyPointsData.forEach((group, index) =>
            group.map((shape) => {
                const color = getRandomBasicColor();

                if (indexesToShow.includes(index.toString())) {
                    drawShape(
                        ctx,
                        shape,
                        minX,
                        minY,
                        zoomLevel,
                        PADDING,
                        canvas,
                        color
                    );
                    shape.forEach((point: Point) => {
                        drawPoint(
                            ctx,
                            point,
                            minX,
                            minY,
                            zoomLevel,
                            PADDING,
                            canvas,
                            color
                        );
                    });
                }
            })
        );
    }
};
