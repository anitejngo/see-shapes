import { Point } from '../types/types';

export function getRandomBasicColor() {
    const basicColors = [
        '#4A90E2', // Dodger Blue
        '#7ED321', // Nyanza Green
        '#FF2D55', // Razzmatazz Red
        '#FFD600', // Cyber Yellow
        '#8E44AD', // Wisteria Purple
        '#FF6F40', // Atomic Tangerine
        '#D35400', // Pumpkin Orange
        '#FF6EB4', // Piggy Pink
        '#17A589', // Green Blue
        '#D22B2B', // Fire Engine Red
        '#8BC34A', // Android Green
        '#00796B', // Tropical Rain Forest
        '#3D5AFE', // Royal Blue
        '#C2185B', // Fuchsia Pink
        '#34495E', // Wet Asphalt
        '#26A65B', // Nephritis Green
        '#95A5A6', // Almond Silver
        '#9B59B6', // Amethyst Purple
        '#ECF0F1', // Clouds White
        '#2C3E50', // Midnight Black
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

export function findPropertyValues(
    jsonString: any,
    propertyName: string
): any[] {
    const jsonData = parseInput(jsonString);
    const results: any[] = [];

    function recursiveSearch(obj: any) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((item) => {
                    recursiveSearch(item);
                });
            } else {
                if (propertyName in obj && 'id' in obj) {
                    results.push({
                        id: obj.id,
                        [propertyName]: obj[propertyName],
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
