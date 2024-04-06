'use client';

import { redirect, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { examsList } from '@/components/constants/exams';
import { ExamType } from '@/types';
import { useSession } from 'next-auth/react';
import { createExam } from '@/app/api/exam/handler';

function ExamHomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [exam, setExam] = useState<ExamType>();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });

  const user = session?.user;
  if (!user) {
    redirect('/');
  }

  useEffect(() => {
    if (searchParams.get('id') !== null) {
      const listIndex = examsList.findIndex(
        (exam) => exam.id === searchParams.get('id')
      );
      if (listIndex !== -1) {
        setExam(examsList[listIndex]);
      } else {
        router.push('/404');
      }
    }
  }, [searchParams, router]);

  const handleExamAccept = async () => {
    try {
      const res = await createExam(user.username);
      if (res.errorCode) {
        console.error('Error fetching question', res.errorMessage);
      } else if (res.status === 200) {
        router.push('/exam/' + res.examId);
      }
    } catch (error) {
      console.error('Please try again after some time');
    }
  };

  return (
    <>
      {searchParams.get('id') === null && !exam ? (
        router.push('/404')
      ) : (
        <div className='flex justify-center items-center w-full'>
          <div className='border-2 p-3 rounded-md px-16 py-10 flex flex-col gap-10 text-lg'>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1 text-gray-500'>
                <span className='font-bold text-gray-800'>Exam Details</span>
                <span>
                  <span className='font-bold'>Name: </span>
                  {exam?.title}
                </span>
                <span>
                  <span className='font-bold'>Duration: </span>
                  {exam?.time}
                </span>
                <span>
                  <span className='font-bold'>Total Questions: </span>
                  {exam?.questions}
                </span>
              </div>
              <div>
                <span className='font-bold text-gray-800'>Rules</span>
                <ul className='mx-2 text-gray-500'>
                  <li>• Do not refresh the page</li>
                  <li>• Do not click the back button</li>
                  <li>• Do not close the tab</li>
                  <li>• Do not leave the page</li>
                </ul>
              </div>

              <button
                // href={}
                onClick={handleExamAccept}
                className='mx-2 bg-blue-500 p-3 rounded-md text-white font-semibold w-fit flex flex-row gap-2 items-center justify-center hover:bg-blue-700 transition-all duration-200'
              >
                Accept and Continue
                <span className='text-3xl font-bold'>
                  <IoIosArrowRoundForward />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExamHomePage;
