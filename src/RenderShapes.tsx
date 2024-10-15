import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { drawEverything } from './helpers/draw';
import {
  getRandomBasicColor,
  isValidShape,
  parseCoordinates,
  parseInput,
} from './helpers/calculations';
import { FormValues, Shape } from './types/types';
import { AiFillEye, AiFillEyeInvisible, AiFillFormatPainter } from 'react-icons/ai';
import { ImSad } from 'react-icons/im';

import { LuSquareDashedBottom, LuSquare } from 'react-icons/lu';
import { MdGpsOff, MdOutlineGpsFixed, MdOutlineNumbers } from 'react-icons/md';
import { BiShapeSquare } from 'react-icons/bi';

import { IconCheckBox } from './components/IconCheckBox';
import { DotsDropdown } from './components/DotsDropdown';

export function RenderShapes() {
  const [formValues, setFormValues] = useState<any>();
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const parsedShapes: Shape[] = formValues?.shapes
      .map((shape: Shape) => {
        let parsedPoints = parseInput(shape.points);

        // transform type Point = [number, number] to Point = [{ x: number, y: number }]
        if (
          Array.isArray(parsedPoints) &&
          parsedPoints.length === 2 &&
          typeof parsedPoints[0] === 'number' &&
          typeof parsedPoints[1] === 'number'
        ) {
          parsedPoints = [{ x: parsedPoints[0], y: parsedPoints[1] }];
        }

        if (isValidShape(parsedPoints)) {
          return {
            points: parsedPoints,
            isHidden: shape.isHidden,
            shouldDrawLines: shape.shouldDrawLines,
            shouldClose: shape.shouldClose,
            shouldShowIndex: shape.shouldShowIndex,
            shouldShowCoordinates: shape.shouldShowCoordinates,
            color: shape.color,
          };
        } else {
          return undefined;
        }
      })
      .filter((shape: any): shape is Shape => shape !== undefined); // Type assertion here

    if (parsedShapes) {
      setShapes(parsedShapes);
    }
  }, [formValues]);

  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const canvasDiv = document.getElementById('canvasDiv'); // Assuming you have a div with class 'flex' wrapping the canvas
    if (canvas && canvasDiv) {
      drawEverything(canvasDiv, canvas, shapes);
    }
  }, [shapes]);

  return (
    <div className="flex flex-row h-full">
      <Formik<FormValues>
        initialValues={{
          shapes: [
            {
              color: getRandomBasicColor(),
              points: [],
              isHidden: false,
              shouldDrawLines: false,
              shouldClose: false,
              shouldShowIndex: true,
              shouldShowCoordinates: false,
            },
          ],
        }}
        onSubmit={(values) => {
          // Handle form submission here
        }}>
        {({ values, handleChange, setFieldValue, setValues }) => {
          setFormValues(values);

          const formatText = (name: string, value: any) => {
            let beautifiedValue;
            try {
              const parsedValue = parseInput(value);
              beautifiedValue = JSON.stringify(parsedValue, null, 2);
            } catch (error) {
              beautifiedValue = value;
            }
            setFieldValue(name, beautifiedValue);
          };

          const convertBoundariesToBox = (index: number, value: any) => {
            let parsedValue;
            try {
              parsedValue = parseInput(value);
            } catch (error) {
              return;
            }

            if (Array.isArray(parsedValue) && parsedValue.length > 0) {
              const minX = Math.min(...parsedValue.map((point: any) => point.x));
              const minY = Math.min(...parsedValue.map((point: any) => point.y));
              const maxX = Math.max(...parsedValue.map((point: any) => point.x));
              const maxY = Math.max(...parsedValue.map((point: any) => point.y));

              const box = [
                { x: minX, y: minY },
                { x: maxX, y: minY },
                { x: maxX, y: maxY },
                { x: minX, y: maxY },
              ];

              const newShapes = [...values.shapes];
              newShapes[index] = {
                ...values.shapes[index],
                points: JSON.stringify(box, null, 2) as any,
                shouldDrawLines: true,
                shouldClose: true,
              };

              setValues({
                shapes: newShapes,
              });
            }
          };

          const convertArraysToCoordinates = (name: string, value: any) => {
            let parsedValue;
            try {
              parsedValue = parseInput(value);
            } catch (error) {
              return;
            }

            const coordinates = parseCoordinates(parsedValue);
            setFieldValue(name, JSON.stringify(coordinates, null, 2));
          };

          return (
            <Form className="flex w-1/3 flex-row">
              <FieldArray name="shapes">
                {({ push, remove }) => (
                  <div
                    className="flex flex-1 flex-col overflow-y-scroll space-y-2 p-2"
                    style={{ height: 'calc(100vh)' }}>
                    <div className={'flex items-center space-x-2'}>
                      <button
                        className="border border-gray-500 text-gray-500 px-4 py-2 rounded hover:bg-gray-100 hover:text-gray-600 w-fit h-fit"
                        type="button"
                        onClick={() =>
                          push({
                            color: getRandomBasicColor(),
                            points: '',
                            isHidden: false,
                          })
                        }>
                        Add more
                      </button>
                      <div
                        className={'text-gray-500'}>{`example: [{ x: 1,y: 1,},{ x: 1,y: 2,}]`}</div>
                    </div>
                    {values.shapes.map(
                      (
                        shape: Shape,
                        index: number, // Use Shape type here
                      ) => {
                        const points = values.shapes[index].points;
                        const parsedValue = parseInput(points);

                        const failedToParse =
                          // @ts-ignore
                          points !== '' && parsedValue === undefined;

                        return (
                          <div
                            key={index}
                            className="flex border border-gray-500 p-2 space-x-2 items-center ">
                            <div className={'self-start'}>
                              <Field
                                name={`shapes.${index}.title`}
                                type="text"
                                placeholder="Add data title"
                                className="w-full p-2 my-1"
                              />
                              <Field
                                name={`shapes.${index}.points`}
                                placeholder="Add array of points"
                                onChange={handleChange}
                                className="w-full border border-gray-500 bg-gray-100 p-2"
                                component="textarea"
                                rows={8}
                              />
                            </div>

                            <div className={'space-y-2 items-center flex flex-col'}>
                              <div className={'flex self-start'}>
                                <button
                                  className={
                                    'border px-4 py-2 rounded hover:bg-gray-100 hover:text-gray-600 h-fit w-fit'
                                  }
                                  type="button"
                                  disabled={values.shapes.length === 1}
                                  onClick={() => {
                                    remove(index);
                                  }}>
                                  Remove
                                </button>
                                <DotsDropdown
                                  options={[
                                    {
                                      label: 'Format code',
                                      onClick: () =>
                                        formatText(
                                          `shapes.${index}.points`,
                                          values.shapes[index].points,
                                        ),
                                    },
                                    {
                                      label: 'Boundaries to box',
                                      onClick: () =>
                                        convertBoundariesToBox(index, values.shapes[index].points),
                                    },
                                    {
                                      label: 'Arrays to coordinates',
                                      onClick: () =>
                                        convertArraysToCoordinates(
                                          `shapes.${index}.points`,
                                          values.shapes[index].points,
                                        ),
                                    },
                                  ]}
                                />
                              </div>
                              <button
                                className="flex"
                                onClick={() => {
                                  const newColor = getRandomBasicColor();
                                  const newShapes = [...values.shapes];
                                  newShapes[index].color = newColor;
                                  setValues({
                                    shapes: newShapes,
                                  });
                                }}>
                                Color:
                                <div
                                  className="w-6 h-6 ml-2 rounded"
                                  style={{
                                    backgroundColor: shape.color,
                                  }}
                                />
                              </button>

                              <IconCheckBox
                                checked={shape.isHidden}
                                onChange={(checked) => {
                                  const newShapes = [...values.shapes];
                                  newShapes[index].isHidden = checked;
                                  setValues({
                                    shapes: newShapes,
                                  });
                                }}
                                checkedIcon={
                                  <AiFillEyeInvisible size={26} className={'text-red-700'} />
                                }
                                uncheckedIcon={<AiFillEye size={26} className={'text-green-700'} />}
                              />

                              <div className={'flex'}>
                                <IconCheckBox
                                  checked={shape.shouldShowIndex}
                                  onChange={(checked) => {
                                    const newShapes = [...values.shapes];
                                    newShapes[index].shouldShowIndex = checked;
                                    setValues({
                                      shapes: newShapes,
                                    });
                                  }}
                                  checkedIcon={
                                    <MdOutlineNumbers size={26} className={'text-green-700'} />
                                  }
                                  uncheckedIcon={
                                    <MdOutlineNumbers size={26} className={'text-gray-400'} />
                                  }
                                />
                                <IconCheckBox
                                  checked={shape.shouldShowCoordinates}
                                  onChange={(checked) => {
                                    const newShapes = [...values.shapes];
                                    newShapes[index].shouldShowCoordinates = checked;
                                    setValues({
                                      shapes: newShapes,
                                    });
                                  }}
                                  checkedIcon={
                                    <MdOutlineGpsFixed size={26} className={'text-green-700'} />
                                  }
                                  uncheckedIcon={<MdGpsOff size={26} className={'text-gray-400'} />}
                                />
                              </div>
                              <div className={'flex'}>
                                <IconCheckBox
                                  checked={shape.shouldDrawLines}
                                  onChange={(checked) => {
                                    const newShapes = [...values.shapes];
                                    newShapes[index].shouldDrawLines = checked;
                                    setValues({
                                      shapes: newShapes,
                                    });
                                  }}
                                  checkedIcon={
                                    <BiShapeSquare size={26} className={'text-green-700'} />
                                  }
                                  uncheckedIcon={
                                    <BiShapeSquare size={26} className={'text-gray-400'} />
                                  }
                                />
                                <IconCheckBox
                                  checked={shape.shouldClose}
                                  onChange={(checked) => {
                                    const newShapes = [...values.shapes];
                                    newShapes[index].shouldClose = checked;
                                    setValues({
                                      shapes: newShapes,
                                    });
                                  }}
                                  checkedIcon={<LuSquare size={26} className={'text-green-700'} />}
                                  uncheckedIcon={
                                    <LuSquareDashedBottom size={26} className={'text-gray-400'} />
                                  }
                                />
                              </div>
                              <AiFillFormatPainter
                                size={26}
                                className={`${
                                  failedToParse ? 'text-gray-400 ' : 'text-green-700 '
                                } cursor-pointer`}
                                type="button"
                                onClick={() => {
                                  formatText(`shapes.${index}.points`, values.shapes[index].points);
                                }}
                              />

                              {failedToParse && (
                                <div className={'text-red-700 w-1/2 items-center flex flex-col'}>
                                  <div>Parsing error</div>
                                  <ImSad />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </FieldArray>
            </Form>
          );
        }}
      </Formik>

      <div id="canvasDiv" className={'flex w-2/3'} style={{ height: 'calc(100vh)' }}>
        <canvas id="canvas" className="border border-black mb-2" />
      </div>
    </div>
  );
}
