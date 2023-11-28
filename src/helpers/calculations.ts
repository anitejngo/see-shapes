import { Point } from '../types/types';

export function getRandomBasicColor() {
    const basicColors = [
        '#3498db', // Belize Hole Blue
        '#2ecc71', // Emerald Green
        '#e74c3c', // Alizarin Red
        '#f39c12', // Orange
        '#9b59b6', // Amethyst Purple
        '#e67e22', // Carrot Orange
        '#d35400', // Pumpkin Orange
        '#ff6eb4', // Piggy Pink
        '#2ecc71', // Green
        '#e74c3c', // Red
        '#27ae60', // Nephritis Green
        '#2980b9', // Peter River Blue
        '#e74c3c', // Fuchsia Pink
        '#27ae60', // Nephritis Green
        '#9b59b6', // Amethyst Purple
    ];

    const randomIndex = Math.floor(Math.random() * basicColors.length);
    return basicColors[randomIndex];
}

const parseInput = (inputValue: any): any => {
    try {
        // Using Function() to parse the input as JavaScript code
        const parsed = Function(`"use strict"; return (${inputValue})`)();

        // Check if it's an object or an array before setting the state
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        } else {
            // Handle invalid input here
            console.error('Invalid input - not an object or array');
            return null;
        }
    } catch (error) {
        // Handle parsing errors here
        // console.error('Error parsing input:', error);
        return null;
    }
};

export function finsShapes(jsonString: any): any[] {
    const jsonData = parseInput(jsonString);
    const results: any[] = [];
    function recursiveSearch(obj: any) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((item) => {
                    recursiveSearch(item);
                });
            } else {
                if ('shape' in obj) {
                    results.push({
                        id: obj?.id ? obj.id : 'noIdFound',
                        shape: obj['shape'],
                    });
                }
                Object.keys(obj).forEach((key) => {
                    recursiveSearch(obj[key]);
                });
            }
        }
    }

    if (Array.isArray(jsonData)) {
        jsonData.forEach((item) => {
            recursiveSearch(item);
        });
    } else {
        recursiveSearch(jsonData);
    }

    return results;
}

export function findPoints(jsonString: any) {
    const jsonData = parseInput(jsonString);
    const results: any[] = [];
    function recursiveSearch(obj: any) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((item) => {
                    recursiveSearch(item);
                });
            } else {
                results.push({
                    id: obj?.id ? obj.id : 'noIdFound',
                    position: obj['position'],
                });
            }
        }
    }

    if (Array.isArray(jsonData)) {
        jsonData.forEach((item) => {
            recursiveSearch(item);
        });
    } else {
        recursiveSearch(jsonData);
    }
    return results;
}

export function calculateZoomLevel(
    shapesData: any,
    pointsData: Point[],
    canvasWidth: number,
    canvasHeight: number,
    padding: number
): number {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    shapesData?.forEach((shapesData: any) => {
        shapesData.shape.forEach((point: any) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
    });

    pointsData?.forEach((point: any) => {
        minX = Math.min(minX, point.position.x);
        minY = Math.min(minY, point.position.y);
        maxX = Math.max(maxX, point.position.x);
        maxY = Math.max(maxY, point.position.y);
    });

    const canvasWidthWithPadding = canvasWidth - 2 * padding;
    const canvasHeightWithPadding = canvasHeight - 2 * padding;

    const canvasWidthRatio = canvasWidthWithPadding / (maxX - minX);
    const canvasHeightRatio = canvasHeightWithPadding / (maxY - minY);

    const zoomX = canvasWidthRatio;
    const zoomY = canvasHeightRatio;

    return Math.min(zoomX, zoomY);
}

export function findMinCoordinates(shapesData: any, pointsData: any) {
    let minX = Infinity;
    let minY = Infinity;
    shapesData?.forEach((shapesData: any) => {
        shapesData.shape.forEach((point: any) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
        });
    });
    pointsData.forEach((point: any) => {
        minX = Math.min(minX, point.position.x);
        minY = Math.min(minY, point.position.y);
    });

    return { minX, minY };
}
