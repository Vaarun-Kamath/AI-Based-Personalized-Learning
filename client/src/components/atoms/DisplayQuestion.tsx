'use client';

import { postSelectedOption } from '@/app/api/exam/handler';
import React, { useEffect, useState } from 'react';

function DisplayQuestion(props: {
  qno: number;
  question: string;
  options: Object;
  examId: number;
  optionSelectedIndex: number;
  setOptionSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const handleOptionSelection = (index: number) => {
    props.setOptionSelectedIndex(index);
    const sendSelectedOption = async () => {
      const res = await postSelectedOption(props.examId, props.qno, index);
      if (res.errorCode) {
        console.error('Error sending selected option', res.errorMessage);
      } else if (res.status === 200) {
        console.log('Option selected sent to backend');
      }
    };
    sendSelectedOption();
  };

  useEffect(() => {
    console.log('DQS: options:', props.options);
  }, [props.options]);

  return (
    <div className='text-xl flex flex-col gap-10'>
      <span>
        {props.qno + 1}. {props.question}
      </span>
      <div>
        {Object.keys(props.options).map((key, index) => {
          return (
            <div key={index} className='flex flex-row gap-2'>
              {/* <div className='w-20'>{String.fromCharCode(65 + index)}</div> */}
              <input
                type='radio'
                name={`option-${props.qno}`}
                checked={props.optionSelectedIndex === index}
                onChange={() => handleOptionSelection(index)}
              />
              <span>{(props.options as { [key: string]: string })[key]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DisplayQuestion;
