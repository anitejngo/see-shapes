import React, { useEffect, useState } from 'react';
import { drawEverything } from './helpers/draw';
import { parseInput } from './helpers/calculations';
import { Shape } from './types/types';
export function RenderShapes() {
    const [roofPoints, setRoofPoints] = useState<string>();
    const [anyPoints, setAnyPoints] = useState<string>();
    const [allIndexes, setAllIndexes] = useState<string[]>([]);
    const [indexesToShow, setIndexesToShow] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState<boolean>(true);

    const getIndexes = (anyPointsData: Shape[][] | undefined) => {
        if (anyPointsData) {
            return Array.from({ length: anyPointsData.length }, (_, index) =>
                index.toString()
            );
        } else {
            return [];
        }
    };

    const handleToggleIndex = (index: string) => {
        if (indexesToShow.includes(index)) {
            // If index is already in the array, remove it
            setIndexesToShow(indexesToShow.filter((idx) => idx !== index));
        } else {
            // If index is not in the array, add it
            setIndexesToShow([...indexesToShow, index]);
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setIndexesToShow([]);
        } else {
            setIndexesToShow(allIndexes); // Add your logic to set all indexes
        }
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const anyPointsData = parseInput(anyPoints);
            console.log(anyPointsData, 'DATA?');
            const roofPointsData = parseInput(roofPoints);
            const allIndexes = getIndexes(anyPointsData);
            setAllIndexes(allIndexes);
            setIndexesToShow(allIndexes);
            drawEverything(
                canvas,
                roofPointsData,
                anyPointsData,
                indexesToShow
            );
        }
    }, [anyPoints, roofPoints]);

    useEffect(() => {
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const anyPointsData = parseInput(anyPoints);
            const roofPointsData = parseInput(roofPoints);
            drawEverything(
                canvas,
                roofPointsData,
                anyPointsData,
                indexesToShow
            );
        }
    }, [indexesToShow]);

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
                    placeholder="Add array of points"
                    value={anyPoints}
                    onChange={(e) => setAnyPoints(e.target.value)}
                    style={{ width: '100%' }}
                    rows={14}
                />
                <textarea
                    placeholder="Add array of roof"
                    value={roofPoints}
                    onChange={(e) => setRoofPoints(e.target.value)}
                    style={{ width: '100%' }}
                    rows={14}
                />
            </div>

            <canvas
                id="canvas"
                style={{ border: '1px solid black', marginBottom: 6 }}
            />
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                    <input
                        type="checkbox"
                        id="select-all"
                        checked={selectAll}
                        onChange={handleSelectAll}
                    />
                    <label htmlFor="select-all">Show all</label>
                </div>
                {allIndexes.map((indexToShow, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`index-${indexToShow}`}
                            value={indexToShow}
                            checked={indexesToShow.includes(indexToShow)}
                            onChange={() => handleToggleIndex(indexToShow)}
                        />
                        <label htmlFor={`index-${indexToShow}`}>
                            {indexToShow}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
