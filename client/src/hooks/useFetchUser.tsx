import { useEffect, useState } from "react";
import { UsePublicRequest } from "./useAPI";

export const useFetchUsers = () => {
  const { publicApiRequest } = UsePublicRequest();
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await publicApiRequest({ cmd: "/users", method: "GET" });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error };
};
