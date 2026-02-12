import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";

const useGetAllIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllIssues = async () => {
      try {
        const res = await apiClient.get("/issues/getAllIssues");
        setIssues(res.data.issues);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllIssues();
  }, []);

  return { issues, loading };
};

export default useGetAllIssues;
