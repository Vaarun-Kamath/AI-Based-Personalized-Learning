import { isAxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function userLoginHandler(
  credentials: Record<"email" | "password", string>
) {
  try {
    const response = await axiosInstance.post(
      `${BACKEND_URL}/api/login`,
      credentials
    );
    console.log("LOGIN RES:::", response);
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
        errorCode: "LOGIN_POST_API_CALL_ERROR",
        errorMessage: "Please try again later.",
      };
    }
  }
}
