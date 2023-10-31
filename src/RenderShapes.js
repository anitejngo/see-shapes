import React, { useEffect, useState } from 'react';

function findMinCoordinates(shapes) {
    let minX = Infinity;
    let minY = Infinity;
    shapes.forEach((shape) => {
        shape.forEach((point) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
        });
    });

    return { minX, minY };
}
function calculateZoomLevel(shapes, canvasWidth, canvasHeight, padding) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    shapes.forEach((shape) => {
        shape.forEach((point) => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
    });

    const canvasWidthWithPadding = canvasWidth - 2 * padding;
    const canvasHeightWithPadding = canvasHeight - 2 * padding;

    const canvasWidthRatio = canvasWidthWithPadding / (maxX - minX);
    const canvasHeightRatio = canvasHeightWithPadding / (maxY - minY);

    const zoomX = canvasWidthRatio;
    const zoomY = canvasHeightRatio;

    return Math.min(zoomX, zoomY);
}
function getRandomBasicColor() {
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

const parseInput = (inputValue) => {
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

        console.error('Error parsing input:', error);
        return null;
    }
};

function findPropertyValues(jsonString, propertyName) {
    const jsonData = parseInput(jsonString);
    const propertyValues = [];

    if (jsonData === null) {
        return [];
    }
    function recursiveSearch(obj) {
        if (typeof obj === 'object' && obj !== null) {
            if (Array.isArray(obj)) {
                obj.forEach((item) => {
                    recursiveSearch(item);
                });
            } else {
                Object.keys(obj).forEach((key) => {
                    if (key === propertyName) {
                        propertyValues.push(obj[key]);
                    } else {
                        recursiveSearch(obj[key]);
                    }
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

    return propertyValues;
}

export function RenderShapes() {
    const [roofArea, setRoofArea] = useState([]);
    const [objectsOnRoof, setObjectsOnRoof] = useState([]);
    const [allData, setAllData] = useState([]);

    const draw = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 800;

        const padding = 50; // Adjust the padding value as needed

        ctx.fillStyle = 'lightgray'; // You can use any valid CSS color value
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const { minX, minY } = findMinCoordinates(allData);

        const zoomLevel = calculateZoomLevel(
            allData,
            canvas.width,
            canvas.height,
            padding
        );
        allData.forEach((data) => {
            const color = getRandomBasicColor();
            ctx.beginPath();
            console.log(data, 'DATA');
            data.forEach((point) => {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                const x = (point.x - minX) * zoomLevel + padding;
                const y =
                    canvas.height - ((point.y - minY) * zoomLevel + padding); // Adjusted y-coordinate calculation
                ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.stroke();
        });
    };

    useEffect(() => {
        const roofAsShape =
            roofArea === '' ? [] : findPropertyValues(roofArea, 'shape');

        const objectsAsShapes =
            objectsOnRoof === ''
                ? []
                : findPropertyValues(objectsOnRoof, 'shape');

        setAllData([...roofAsShape, ...objectsAsShapes]);
    }, [roofArea, objectsOnRoof]);

    useEffect(() => {
        draw();
    }, [allData]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <div style={{ width: 800, marginBottom: 20 }}>
                <textarea
                    type="text"
                    placeholder="Add roof area"
                    value={roofArea}
                    onChange={(e) => setRoofArea(e.target.value)}
                    style={{ width: '100%' }}
                    rows={14}
                />
                <textarea
                    type="text"
                    placeholder="Add any shapes"
                    value={objectsOnRoof}
                    onChange={(e) => setObjectsOnRoof(e.target.value)}
                    style={{ width: '100%' }}
                    rows={14}
                />
            </div>
            <canvas id="canvas" style={{ border: '1px solid black' }}></canvas>
        </div>
    );
}
