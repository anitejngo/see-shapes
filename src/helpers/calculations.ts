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

export const parseInput = (inputValue: any): any => {
    try {
        // Using Function() to parse the input as JavaScript code
        const parsed = Function(`"use strict"; return (${inputValue})`)();

        // Check if it's an object or an array before setting the state
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        } else {
            // Handle invalid input here
            console.error('Invalid input - not an object or array');
            return [];
        }
    } catch (error) {
        return [];
    }
};

export function calculateZoomLevel(
    points: Point[],
    canvasWidth: number,
    canvasHeight: number,
    padding: number
): number {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    points?.forEach((point: Point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    const canvasWidthWithPadding = canvasWidth - 2 * padding;
    const canvasHeightWithPadding = canvasHeight - 2 * padding;

    const canvasWidthRatio = canvasWidthWithPadding / (maxX - minX);
    const canvasHeightRatio = canvasHeightWithPadding / (maxY - minY);

    const zoomX = canvasWidthRatio;
    const zoomY = canvasHeightRatio;

    return Math.min(zoomX, zoomY);
}

export function findMinCoordinates(points: Point[]) {
    let minX = Infinity;
    let minY = Infinity;
    points?.forEach((point: Point) => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
    });

    return { minX, minY };
}
