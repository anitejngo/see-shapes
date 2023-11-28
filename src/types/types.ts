export type Point = {
    position: {
        x: number;
        y: number;
    };
    id: string;
    isInside: boolean;
};

type Coordinate = {
    x: number;
    y: number;
};

export type ShapeData = {
    shape: Coordinate[];
    id: string;
};
