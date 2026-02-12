import apiClient from "@/api/apiClient";
import axios from "axios";
import React, { useEffect } from "react";

const useGetMyIssues = () => {
  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await apiClient.get("/issues/getUsersIssues");
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyIssues();
  }, []);
};

export default useGetMyIssues;
