import React, { useEffect, useState } from 'react';
import { Formik, Form, FieldArray, Field } from 'formik';
import { drawEverything } from './helpers/draw';
import { getRandomBasicColor, isValidShape, parseInput } from './helpers/calculations';
import { FormValues, Shape } from './types/types';
import { AiFillEye, AiFillEyeInvisible, AiFillFormatPainter } from 'react-icons/ai';
import { ImSad } from 'react-icons/im';

import { LuSquareDashedBottom, LuSquare, LuInfo } from 'react-icons/lu';

import { IconCheckBox } from './components/IconCheckBox';

export function RenderShapes() {
  const [formValues, setFormValues] = useState<any>();
  const [shapes, setShapes] = useState<Shape[]>([]);

  useEffect(() => {
    const parsedShapes: Shape[] = formValues?.shapes
      .map((shape: any) => {
        let parsedPoints = parseInput(shape.points);

        // transform type Point = [number, number] to Point = [{ x: number, y: number }]
        if (Array.isArray(parsedPoints) && parsedPoints.length === 2 && typeof parsedPoints[0] === 'number' && typeof parsedPoints[1] === 'number') {
          parsedPoints = [{ x: parsedPoints[0], y: parsedPoints[1] }];
        }

        if (isValidShape(parsedPoints)) {
          return {
            points: parsedPoints,
            isHidden: shape.isHidden,
            shouldClose: shape.shouldClose,
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
              shouldClose: true,
              shouldShowCoordinates: true,
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
                              <Field name={`shapes.${index}.title`} type="text" placeholder="Add data title"
                                   className="w-full p-2 my-1" />
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

                              <IconCheckBox
                                checked={shape.shouldShowCoordinates}
                                onChange={(checked) => {
                                  const newShapes = [...values.shapes];
                                  newShapes[index].shouldShowCoordinates = checked;
                                  setValues({
                                    shapes: newShapes,
                                  });
                                }}
                                checkedIcon={<LuInfo size={26} className={'text-green-700'} />}
                                uncheckedIcon={<LuInfo size={26} className={'text-gray-400'} />}
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
