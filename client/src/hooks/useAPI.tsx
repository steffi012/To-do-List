import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useState, useCallback } from "react";


const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL;
// Create Axios instances
const publicInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "",
  timeout: 10000,
});

const authAxiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "generic/api/v1/",
  timeout: 10000,
});

// Define types
interface ApiRequestParams {
  cmd: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  args?: Record<string, unknown>;
}

interface UseRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  publicApiRequest: (params: ApiRequestParams) => Promise<AxiosResponse<T> | void>;
}

interface UsePrivateRequestReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  privateApiRequest: (params: ApiRequestParams) => Promise<AxiosResponse<T> | void>;
}

// Public API Request Hook
export const UsePublicRequest = <T = any>(): UseRequestReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const publicApiRequest = async ({
    cmd,
    method = "POST",
    args = {},
  }: ApiRequestParams): Promise<AxiosResponse<T> | void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<T> = await publicInstance({
        url: cmd,
        method,
        data: args || null,
      });
      setData(response.data);
      return response;
    } catch (err: any) {
      console.error("Public API Request Error: ", err);
      setError(err.response ? err.response.data : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, publicApiRequest };
};

// Private API Request Hook (with Authentication)
{/* export const UsePrivateRequest = <T = any>(): UsePrivateRequestReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const privateApiRequest = async ({
    cmd,
    method = "POST",
    args = {},
  }: ApiRequestParams): Promise<AxiosResponse<T> | void> => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken"); // Replace with your actual token retrieval logic

    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      const response: AxiosResponse<T> = await authAxiosInstance({
        url: cmd,
        method,
        data: args || null,
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });
      setData(response.data);
      return response;
    } catch (err: any) {
      console.error("Private API Request Error: ", err);
      setError(err.response ? err.response.data : "Request failed");
      if (err.response && err.response.status === 403) {
        console.warn("403 Forbidden - Possible authentication issue");
        // Optional: Handle specific 403 errors, e.g., logging out the user
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, privateApiRequest };
}; */}
