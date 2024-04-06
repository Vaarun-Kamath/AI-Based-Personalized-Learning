import { isAxiosError } from 'axios';
import axiosInstance from '@/utils/axiosInstance';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getQuestion = async (examId: number, question: number) => {
  console.log('question:: ', question);
  try {
    const response = await axiosInstance.get(`${BACKEND_URL}/api/getQuestion`, {
      params: {
        examId: examId,
        question: question,
      },
    });
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'GET_EXAMS_GET_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};

export const postSelectedOption = async (
  examId: number,
  questionNumber: number,
  optionSelected: number
) => {
  try {
    const response = await axiosInstance.post(
      `${BACKEND_URL}/api/selectOption`,
      {
        examId,
        questionNo: questionNumber,
        selectedOption: optionSelected,
      }
    );
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'SEND_SELECTED_OPTION_POST_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};

export const createExam = async (username: string) => {
  try {
    const response = await axiosInstance.post(`${BACKEND_URL}/api/createExam`, {
      username,
    });
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'SEND_SELECTED_OPTION_POST_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};

export const isUserInExam = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      `${BACKEND_URL}/api/isUserInExam`,
      {
        params: {
          username: username,
        },
      }
    );
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'GET_EXAMS_GET_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};

export const submitExam = async (examId: number) => {
  try {
    const response = await axiosInstance.post(`${BACKEND_URL}/api/submitExam`, {
      examId,
    });
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'SUBMIT_TEST_POST_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};

export const getRemainingTime = async (examId: number) => {
  try {
    const response = await axiosInstance.get(
      `${BACKEND_URL}/api/getExamStartTime`,
      {
        params: {
          examId: examId,
        },
      }
    );
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const { status, errorCode, errorMessage } = error.response.data;
      return { status, errorCode, errorMessage };
    } else {
      console.error(error);
      return {
        status: 500,
        errorCode: 'GET_REMAINING_TIME_GET_API_CALL_ERROR',
        errorMessage: 'Please try again later.',
      };
    }
  }
};
