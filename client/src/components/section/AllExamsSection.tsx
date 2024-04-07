import React from 'react';
import { FaBook } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { TiDocumentText } from 'react-icons/ti';
import { examsList } from '../constants/exams';
import StyledLink from '../atoms/StyledLink';

function AllExamsSection() {
  return (
    <>
      <h2 className='font-bold text-3xl'>Exams</h2>
      <div className='grid grid-cols-5 gap-y-10 gap-x-10'>
        {examsList.map((exam, i) => (
          <StyledLink
            key={i}
            href={`/exam?id=${exam.id}`}
            className='border-2 border-gray-300 p-4 text-left hover:border-blue-500 rounded-md flex flex-col gap-2 transition-all duration-200'
          >
            <span className='font-semibold flex flex-row items-center gap-2 text-black'>
              <span className='text-black'>
                <FaBook />
              </span>
              {exam.title}
            </span>
            <span className='text-gray-500 font-light flex flex-row items-center gap-2'>
              <span className='text-black'>
                <TiDocumentText />
              </span>
              {exam.questions} Questions
            </span>
            <span className='text-gray-500 font-light flex flex-row items-center gap-2'>
              <span className='text-black'>
                <IoMdTime />
              </span>
              {exam.time} Minutes
            </span>
          </StyledLink>
        ))}
      </div>
    </>
  );
}

export default AllExamsSection;
