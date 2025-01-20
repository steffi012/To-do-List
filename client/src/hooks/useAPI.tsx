import axios, { AxiosInstance, AxiosResponse } from "axios";
import { useState } from "react";

const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL;

const publicInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "",
  timeout: 10000,
});

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
