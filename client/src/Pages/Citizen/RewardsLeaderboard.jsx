import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import { Trophy, TrendingUp, Users, Zap } from "lucide-react";

const RewardsLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    topPoints: 0,
    averagePoints: 0,
  });

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:3000/api/v1/janSetu/auth/leaderboard",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard);

      // Calculate stats
      if (data.leaderboard.length > 0) {
        const totalPoints = data.leaderboard.reduce((sum, user) => sum + user.rewardPoints, 0);
        setStats({
          totalUsers: data.leaderboard.length,
          topPoints: data.leaderboard[0]?.rewardPoints || 0,
          averagePoints: Math.round(totalPoints / data.leaderboard.length),
        });
        setUserRank(data.leaderboard[0]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to load leaderboard. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-amber-400 to-amber-600";
    if (rank === 2) return "from-slate-300 to-slate-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-blue-600";
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };
  

  const getTierBadge = (rank) => {
    if (rank === 1) return { text: "Champion", color: "bg-amber-100 text-amber-800" };
    if (rank <= 3) return { text: "Elite", color: "bg-purple-100 text-purple-800" };
    if (rank <= 10) return { text: "Top 10", color: "bg-blue-100 text-blue-800" };
    if (rank <= 25) return { text: "Rising Star", color: "bg-green-100 text-green-800" };
    return { text: "Contributor", color: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="min-h-screen bg-white">
      <DashboardNavbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-amber-600" />
              <h1 className="text-5xl font-bold text-gray-900">Rewards Leaderboard</h1>
              <Trophy className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compete with other citizens and earn rewards by reporting civic issues. Rise through the ranks and become a community hero!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-blue-500 opacity-40" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Top Score</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{stats.topPoints}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-amber-500 opacity-40" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Average Points</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.averagePoints}</p>
                </div>
                <Zap className="w-12 h-12 text-green-500 opacity-40" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Your Rank</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">#-</p>
                </div>
                <Trophy className="w-12 h-12 text-purple-500 opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <p className="font-medium">⚠️ {error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-white rounded-full"></div>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-700 text-xl mb-2">No leaderboard data available yet.</p>
              <p className="text-gray-500">Start reporting issues to earn reward points and claim your place on the leaderboard!</p>
            </div>
          ) : (
            <div>
              {/* Top 3 Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-600" />
                  Top 3 Champions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {leaderboard.slice(0, 3).map((user, idx) => {
                    const rankColors = [
                      "from-amber-600 to-amber-700", // 1st
                      "from-gray-700 to-gray-800",   // 2nd
                      "from-orange-600 to-orange-700" // 3rd
                    ];
                    return (
                      <div
                        key={user.userId}
                        className="cursor-pointer group"
                      >
                        <div className={`bg-gradient-to-br ${rankColors[idx]} rounded-2xl p-8 text-white shadow-lg transform transition group-hover:scale-105`}>
                          <div className="text-center">
                            <div className="text-7xl mb-4 drop-shadow-lg">{getMedalIcon(user.rank)}</div>
                            <div className="bg-white bg-opacity-20 text-black rounded-lg py-3 mb-6 border border-white border-opacity-30">
                              <p className="text-sm font-semibold text-black opacity-90">RANK</p>
                              <p className="text-4xl font-bold text-black"># {user.rank}</p>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 truncate">{user.username}</h3>
                            <p className="text-sm opacity-90 mb-6">{user.email}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-white bg-opacity-20 rounded-lg p-3 border border-white border-opacity-30">
                                <p className="text-xs font-semibold text-black opacity-75">Points</p>
                                <p className="text-2xl font-bold text-black mt-1">{user.rewardPoints}</p>
                              </div>
                              <div className="bg-white bg-opacity-20 rounded-lg p-3 border border-white border-opacity-30">
                                <p className="text-xs font-semibold text-black opacity-75">Issues</p>
                                <p className="text-2xl font-bold text-black mt-1">{user.issuesReported}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>


              {/* Full Leaderboard Table */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  Full Rankings
                </h2>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-500 to-blue-600 border-b border-gray-200">
                          <th className="px-6 py-5 text-left text-sm font-semibold text-white">Rank</th>
                          <th className="px-6 py-5 text-left text-sm font-semibold text-white">Player</th>
                          <th className="px-6 py-5 text-center text-sm font-semibold text-white">Tier</th>
                          <th className="px-6 py-5 text-center text-sm font-semibold text-white">Issues</th>
                          <th className="px-6 py-5 text-right text-sm font-semibold text-white">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((user, index) => {
                          const tier = getTierBadge(user.rank);
                          const isTop3 = user.rank <= 3;
                          return (
                            <tr
                              key={user.userId}
                              className={`border-b border-gray-100 transition hover:bg-blue-50 ${
                                isTop3 ? "bg-blue-50" : index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                                    user.rank === 1 ? "from-amber-500 to-amber-600" :
                                    user.rank === 2 ? "from-slate-400 to-slate-500" :
                                    user.rank === 3 ? "from-orange-500 to-orange-600" :
                                    "from-blue-500 to-blue-600"
                                  } flex items-center justify-center text-white font-bold text-lg shadow`}>
                                    {user.rank <= 3 ? getMedalIcon(user.rank) : user.rank}
                                  </div>
                                  <span className="text-gray-900 font-semibold text-lg">
                                    #{user.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                                    {user.username?.charAt(0).toUpperCase() || "U"}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-gray-900 font-semibold truncate">
                                      {user.username}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tier.color}`}>
                                  {tier.text}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm">
                                  {user.issuesReported}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-2xl">⭐</span>
                                  <span className="text-gray-900 font-bold text-lg">
                                    {user.rewardPoints}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    How to Earn Points?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-600 text-lg">✓</span>
                      <span>Report an issue: <span className="font-bold text-amber-700">+10 points</span></span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-600 text-lg">✓</span>
                      <span>Get upvotes: <span className="font-bold text-amber-700">+1 point each</span></span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-600 text-lg">✓</span>
                      <span>Issue resolved: <span className="font-bold text-amber-700">+5 bonus points</span></span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-600" />
                    Achievement Tiers
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-amber-600 text-lg">🥇</span>
                      <span><span className="font-bold text-amber-700">Champion</span> - Rank #1 with highest points</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-purple-600 text-lg">⭐</span>
                      <span><span className="font-bold text-purple-700">Elite</span> - Top 3 contributors</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-600 text-lg">✨</span>
                      <span><span className="font-bold text-blue-700">Rising Star</span> - Ranked in Top 25</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RewardsLeaderboard;
