import { isAxiosError } from 'axios';
import axiosInstance from '@/utils/axiosInstance';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getUserData = async (username: string) => {
  try {
    const response = await axiosInstance.get(`${BACKEND_URL}/api/getUserData`, {
      params: {
        username,
      },
    });
    const { data } = response;
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      return error.response?.data;
    }
    return { errorCode: 500, errorMessage: 'Internal Server Error' };
  }
};
