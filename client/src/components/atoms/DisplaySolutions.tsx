'use client';
import React from 'react';
import DisplayLoading from './Loading';

function DisplaySolutions(props: {
  qno: number;
  question: string;
  options: Object;
  examId: number;
  optionSelectedIndex: number;
  solution: string;
  correctOption: number;
  setOptionSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleOptionSelection = (index: number) =>
    props.setOptionSelectedIndex(index);

  return (
    <>
      {props.solution ? (
        <div className='text-xl flex flex-col gap-10'>
          <span>
            {props.qno + 1}. {props.question}
          </span>
          <div>
            {Object.keys(props.options).map((key, index) => {
              return (
                <div key={index} className='flex flex-row gap-2'>
                  <input
                    type='radio'
                    name={`option-${props.qno}`}
                    checked={props.optionSelectedIndex === index}
                    disabled
                    onChange={() => handleOptionSelection(index)}
                  />
                  <span>
                    {(props.options as { [key: string]: string })[key]}
                  </span>
                </div>
              );
            })}
          </div>
          {props.solution && (
            <div className='flex flex-col gap-4'>
              <span className='font-semibold'>Correct Answer:</span>
              <span>
                {String.fromCharCode(65 + props.correctOption)}.{' '}
                {
                  (props.options as { [key: string]: string })[
                    String.fromCharCode(65 + props.correctOption)
                  ]
                }
              </span>
              <span className='font-semibold'>Solution:</span>
              <span>{props.solution}</span>
            </div>
          )}
        </div>
      ) : (
        <DisplayLoading />
      )}
    </>
  );
}

export default DisplaySolutions;
