import React from "react";

function ExamPage({ params }: { params: { examId: number } }) {
  return <div>ExamPage: {params.examId}</div>;
}

export default ExamPage;
