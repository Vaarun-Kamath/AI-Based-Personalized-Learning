"use client";

import CountdownTimer from "@/components/atoms/CountdownTimer";
import React, { useState } from "react";
import { IoExit } from "react-icons/io5";

function ExamPage({ params }: { params: { examId: number } }) {
  // return <div>ExamPage: {params.examId}</div>;
  const [numQuestions, setNumQuestions] = useState(30);
  const [time, setTime] = useState(30 * 60);
  const [examName, setExamName] = useState("Exam Name");

  const buttons = [];
  for (let i = 1; i <= numQuestions; i++) {
    buttons.push(
      <button
        key={i}
        className="rounded-full text-white w-14 h-14 bg-blue-500 hover:bg-blue-600"
      >
        {i}
      </button>
    );
  }

  return (
    <div className="w-full flex flex-row gap-5">
      <div className="border-2 w-3/4 h-full"></div>
      <div className="flex flex-col border-2 w-1/4 h-full justify-center items-center gap-5">
        <div className="col-span-5 flex flex-row gap-5">
          {/*Insert Timer div here*/}
          <CountdownTimer initialTime={time} />
        </div>
        <div className="grid grid-cols-5 py-10 gap-4">{buttons}</div>
        <div>
          <button className="bg-red-500 hover:bg-red-600 p-4 rounded-md text-white font-semibold flex flex-row gap-2 justify-center items-center">
            End Test
            <span className="text-xl">
              <IoExit />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
