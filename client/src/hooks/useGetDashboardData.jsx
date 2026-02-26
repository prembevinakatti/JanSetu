import apiClient from "@/api/apiClient";
import { useState, useEffect } from "react";

const useDashboardData = () => {
  const [stats, setStats] = useState({});
  const [aiSummary, setAiSummary] = useState({});
  const [departments, setDepartments] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [emailComplaints, setEmailComplaints] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, aiRes, deptRes, hotspotRes, issuesRes, emailRes] =
        await Promise.all([
          apiClient.get("/analytics/stats"),
          apiClient.get("/analytics/ai-summary"),
          apiClient.get("/analytics/department"),
          apiClient.get("/analytics/hotspots"),
          apiClient.get("/analytics/recent"),
          apiClient.get("/emailComplaints/getAllEmailComplaints"),
        ]);

      // ✅ FIXED MAPPING

      setStats(statsRes.data.data || {});
      setAiSummary(aiRes.data.data || {});
      setDepartments(deptRes.data.data || []);
      setHotspots(hotspotRes.data.hotspots || []);
      setRecentIssues(issuesRes.data.data || []);
      setEmailComplaints(emailRes.data.allMails || []);

      console.log("Fetched Dashboard Data:", {
        stats: statsRes.data.data,
        aiSummary: aiRes.data.data,
        departments: deptRes.data.data,
        hotspots: hotspotRes.data.hotspots,
        recentIssues: issuesRes.data.data,
        emailComplaints: emailRes.data.allMails,
      });
    } catch (err) {
      console.error("Dashboard Hook Error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    aiSummary,
    departments,
    hotspots,
    recentIssues,
    emailComplaints,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};

export default useDashboardData;
