import { Point } from '../types/types';

export function getRandomBasicColor() {
    const basicColors = [
        '#F44336', // Red
        '#9C27B0', // Purple
        '#FFA000', // Darker Orange
        '#0288D1', // Dark Blue
        '#4CAF50', // Green
        '#6D4C41', // Dark Brown
        '#311B92', // Darker Purple
        '#BF360C', // Darker Red
        '#455A64', // Dark Blue Grey
        '#FF8F00', // Darker Orange
        '#1976D2', // Blue
        '#FF7043', // Lighter Red
        '#7B1FA2', // Darker Purple
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
        return undefined;
    }
};

export const isValidShape = (points: any): points is Point[] => {
    // Check if points is an array
    if (!Array.isArray(points)) {
        return false;
    }

    // Check if each element is an object with x and y properties
    return points.every((point: any) => {
        return (
            typeof point === 'object' &&
            point !== null &&
            typeof point.x === 'number' &&
            typeof point.y === 'number'
        );
    });
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
