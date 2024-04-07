import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { TiDocumentText } from 'react-icons/ti';
import StyledLink from '../atoms/StyledLink';
import { getPastExams } from '@/app/api/exam/handler';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

function PastExamsSection() {
  const [pastExams, setPastExams] = useState<Array<String>>([]);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/`);
    },
  });

  const user = session?.user;

  useEffect(() => {
    const fetchPastExams = async () => {
      try {
        if (!user) {
          console.error('User is undefined');
          return;
        }
        const res = await getPastExams(user.username);
        if (res.errorCode) {
          console.error('Error fetching past exams', res.errorMessage);
        } else if (res.status === 200) {
          setPastExams(res.exams);
        }
      } catch (error) {
        console.error('Please try again after some time');
      }
    };
    fetchPastExams();
  }, [user]);
  return (
    <>
      <h2 className='font-bold text-3xl'>Your Past Exams</h2>
      <div className='w-full grid grid-cols-3 gap-x-10'>
        {pastExams.map((exam, i) => (
          <StyledLink
            key={i}
            href={`/solutions/` + exam}
            className='border-2 border-gray-300 p-4 text-left hover:border-blue-500 rounded-md flex flex-col gap-2 transition-all duration-200'
          >
            <span className='font-semibold flex flex-row items-center gap-2 text-black'>
              <span className='text-black'>
                <FaBook />
              </span>
              Physics
            </span>
            <span className='text-gray-500 font-light flex flex-row items-center gap-2'>
              <span className='text-black'>
                <TiDocumentText />
              </span>
              40 Questions
            </span>
            <span className='text-gray-500 font-light flex flex-row items-center gap-2'>
              <span className='text-black'>
                <IoMdTime />
              </span>
              40 Minutes
            </span>
          </StyledLink>
        ))}
      </div>
    </>
  );
}

export default PastExamsSection;
