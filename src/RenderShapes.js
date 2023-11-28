import React, { useEffect, useState } from 'react';
import { drawPoint, drawShape } from './helpers/drawing';
import {
    calculateZoomLevel,
    findMinCoordinates,
    findPoints,
    finsShapes,
    getRandomBasicColor,
} from './helpers/calculations';

const PADDING = 100;

export function RenderShapes() {
    let zoomLevel = 0;
    let minimumX = 0;
    let minimumY = 0;
    const [roofArea, setRoofArea] = useState([]);
    const [objectsOnRoof, setObjectsOnRoof] = useState([]);
    const [positions, setPositions] = useState([]);
    const [shapesData, setShapesData] = useState([]);
    const [pointsData, setPointsData] = useState([]);
    const [showShapeId, setShowShapeId] = useState(true);
    const [showPointId, setShowPointId] = useState(true);

    const draw = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 800;
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const { minX, minY } = findMinCoordinates(shapesData, pointsData);
        minimumX = minX;
        minimumY = minY;

        zoomLevel = calculateZoomLevel(
            shapesData,
            pointsData,
            canvas.width,
            canvas.height,
            PADDING
        );

        shapesData.forEach((shapesData) => {
            const color = getRandomBasicColor();
            drawShape(
                ctx,
                shapesData,
                color,
                minX,
                minY,
                zoomLevel,
                PADDING,
                canvas,
                showShapeId
            );
        });

        pointsData.forEach((point, index) => {
            drawPoint(
                ctx,
                point,
                minX,
                minY,
                zoomLevel,
                PADDING,
                canvas,
                showPointId
            );
        });
    };

    useEffect(() => {
        const roofAsShape = roofArea === '' ? [] : finsShapes(roofArea);

        const objectsAsShapes =
            objectsOnRoof === '' ? [] : finsShapes(objectsOnRoof, 'shape');

        const points = positions === '' ? [] : findPoints(positions);

        setShapesData([...roofAsShape, ...objectsAsShapes]);
        setPointsData(points);
    }, [roofArea, objectsOnRoof, positions]);

    useEffect(() => {
        draw();
    }, [shapesData, showShapeId, showPointId]);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    width: '100%',
                    marginBottom: 20,
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
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
                <textarea
                    type="text"
                    placeholder="Add any positions"
                    value={positions}
                    onChange={(e) => setPositions(e.target.value)}
                    style={{ width: '100%' }}
                    rows={14}
                />
            </div>
            <div style={{ paddingBottom: 10 }}>
                <label>
                    Show Shape IDs
                    <input
                        type="checkbox"
                        checked={showShapeId}
                        onChange={() => setShowShapeId(!showShapeId)}
                    />
                </label>
                <label>
                    Show Point IDs
                    <input
                        type="checkbox"
                        checked={showPointId}
                        onChange={() => setShowPointId(!showPointId)}
                    />
                </label>
            </div>
            <canvas
                id="canvas"
                style={{ border: '1px solid black', marginBottom: 6 }}
            ></canvas>
            <div>Red dots are inside, Green are outside!</div>
        </div>
    );
}
