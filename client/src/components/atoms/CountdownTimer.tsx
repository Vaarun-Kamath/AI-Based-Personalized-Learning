import { getRemainingTime } from '@/app/api/exam/handler';
import React, { useState, useEffect } from 'react';
import { FaCircle } from 'react-icons/fa';

function CountdownTimer(props: {
  initialTime: number;
  attempted: number;
  unanswered: number;
  examId: number;
  handleTestSubmit: () => void;
}) {
  const [time, setTime] = useState(props.initialTime);

  useEffect(() => {
    const fetchRemainingTime = async () => {
      try {
        const res = await getRemainingTime(props.examId);
        if (res.errorCode) {
          console.error('Error fetching remaining time', res.errorMessage);
        } else if (res.status === 200) {
          setTime(
            Math.round(
              props.initialTime - (new Date().getTime() - res.time) / 1000
            )
          );
        }
      } catch (error) {
        console.error('Please try again after some time');
      }
    };
    fetchRemainingTime();
  }, [props.examId, props.initialTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(interval);
          props.handleTestSubmit();
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [props.initialTime, props]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className='flex flex-row gap-10 w-full justify-center '>
      <div className='font-semibold text-5xl text-gray-600 w-1/2 '>
        <div className='text-center text-nowrap'>{formatTime(time)}</div>
      </div>
      <div className='flex flex-col w-1/2 justify-center'>
        <span className='flex flex-row gap-2 items-center'>
          <span className='text-green-500'>
            <FaCircle />
          </span>
          Attempted: {props.attempted}
        </span>
        <span className='flex flex-row gap-2 items-center'>
          <span className='text-gray-300'>
            <FaCircle />
          </span>
          Unanswered:{props.unanswered}
        </span>
      </div>
    </div>
  );
}

export default CountdownTimer;
