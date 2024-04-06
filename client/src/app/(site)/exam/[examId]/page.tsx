'use client';

import { getQuestion } from '@/app/api/exam/handler';
import CountdownTimer from '@/components/atoms/CountdownTimer';
import DisplayQuestion from '@/components/atoms/DisplayQuestion';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoExit } from 'react-icons/io5';

function ExamPage({ params }: { params: { examId: number } }) {
  const [numQuestions, setNumQuestions] = useState(30);
  const [time, setTime] = useState(30 * 60);
  const [qno, setQno] = useState<number>(0);
  const [optionCheck, setOptionCheck] = useState<boolean>(false);

  const [optionsSelected, setOptionsSelected] = useState<Array<number>>([]); //! Fetch question only when option is selected
  const [currQuestion, setCurrQuestion] = useState<string>('');
  const [options, setOptions] = useState<Object>({});
  const [optionSelectedIndex, setOptionSelectedIndex] = useState<number>(-1);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });

  const user = session?.user;

  const handleButtonClick = (questionNumber: number) => {
    setQno(questionNumber);
    setCurrQuestion('');
    setOptions([]);
    setOptionCheck(false);
    setOptionSelectedIndex(optionsSelected[questionNumber]);
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestion(params.examId, qno);
        if (res.errorCode) {
          console.error('Error fetching question', res.errorMessage);
        } else if (res.status === 200) {
          console.log('res:', res);
          setCurrQuestion(res.question);
          setOptions(res.options);
          setOptionsSelected(res.optionsSelected);
          setOptionSelectedIndex(res.optionsSelected[qno]);
        }
      } catch (error) {
        console.error('Please try again after some time');
      }
    };

    fetchQuestion();
  }, [params.examId, qno]);

  return (
    <div className='w-full flex flex-row gap-5'>
      <div className='border-2 w-3/4 h-full p-10'>
        <DisplayQuestion
          qno={qno}
          question={currQuestion}
          options={options}
          examId={params.examId}
          setOptionSelectedIndex={setOptionSelectedIndex}
          optionSelectedIndex={optionSelectedIndex}
        />
      </div>
      <div className='flex flex-col border-2 w-1/4 h-full justify-center items-center gap-5'>
        <div className='col-span-5 flex flex-row gap-5'>
          {/*Insert Timer div here*/}
          <CountdownTimer initialTime={time} />
        </div>
        <div className='grid grid-cols-5 py-10 gap-4'>
          {Array.from({ length: numQuestions }, (_, index) => {
            return (
              <button
                key={index}
                onClick={() => handleButtonClick(index)}
                className={`rounded-full text-white w-14 h-14  ${
                  qno === index ? 'bg-blue-600' : ''
                } 
                ${
                  optionsSelected[index] !== -1
                    ? ' bg-green-500'
                    : ' bg-blue-500 hover:bg-blue-600'
                }
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div>
          <button className='bg-red-500 hover:bg-red-600 p-4 rounded-md text-white font-semibold flex flex-row gap-2 justify-center items-center'>
            End Test
            <span className='text-xl'>
              <IoExit />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
