'use client';

import { getQuestionSolutions } from '@/app/api/exam/handler';
import DisplaySolutions from '@/components/atoms/DisplaySolutions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoExit } from 'react-icons/io5';

function ExamSolutions({ params }: { params: { examId: number } }) {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState(40);
  const [qno, setQno] = useState<number>(0);

  const [optionsSelected, setOptionsSelected] = useState<Array<number>>([]); //! Fetch question only when option is selected
  const [currQuestion, setCurrQuestion] = useState<string>('');
  const [options, setOptions] = useState<Object>({});
  const [currSolution, setCurrSolution] = useState<string>('');
  const [optionSelectedIndex, setOptionSelectedIndex] = useState<number>(-1);
  const [correctOption, setCorrectOption] = useState<number>(-1);

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });

  const user = session?.user;

  const handleButtonClick = (questionNumber: number) => {
    if (questionNumber != qno) {
      setQno(questionNumber);
      setCurrQuestion('');
      setOptions([]);
      setOptionSelectedIndex(optionsSelected[questionNumber]);
      setCurrSolution('');
      setCorrectOption(-1);
    }
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionSolutions(params.examId, qno);
        if (res.errorCode) {
          console.error('Error fetching question', res.errorMessage);
        } else if (res.status === 200) {
          setCurrQuestion(res.question);
          setOptions(res.options);
          setOptionsSelected(res.optionsSelected);
          setOptionSelectedIndex(res.optionsSelected[qno]);
          setCurrSolution(res.solution);
          setCorrectOption(Number(res.correctOption));
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
        <DisplaySolutions
          qno={qno}
          question={currQuestion}
          options={options}
          solution={currSolution}
          examId={params.examId}
          setOptionSelectedIndex={setOptionSelectedIndex}
          optionSelectedIndex={optionSelectedIndex}
          correctOption = {correctOption}
        />
      </div>
      <div className='flex flex-col border-2 w-1/4 h-full justify-center items-center gap-5'>
        <div className='grid grid-cols-5 py-10 gap-4'>
          {Array.from({ length: numQuestions }, (_, index) => {
            return (
              <button
                key={index}
                onClick={() => handleButtonClick(index)}
                className={`rounded-full text-white w-10 h-10  ${
                  qno === index ? 'bg-blue-800' : ''
                } 
            ${
              optionsSelected && optionsSelected[index] !== -1
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
          <button
            onClick={() => router.push('/')}
            className='bg-red-500 hover:bg-red-600 p-4 rounded-md text-white font-semibold flex flex-row gap-2 justify-center items-center'
          >
            Exit Solutions
            <span className='text-xl'>
              <IoExit />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamSolutions;
