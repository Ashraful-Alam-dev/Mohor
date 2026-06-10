"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [reloading, setReloading] = useState(false);

  // LOAD ANALYTICS
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get("/analytics/me");

      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Analytics load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // RECALCULATE
  const recalc = async () => {
    try {
      setReloading(true);
      const res = await api.get("/analytics/recalculate");

      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Recalculate failed");
    } finally {
      setReloading(false);
    }
  };

  // Helper function to get max value for scaling
  const getMaxCount = (activities) => {
    if (!activities || activities.length === 0) return 1;
    return Math.max(...activities.map(d => d.count), 1);
  };

  // Calculate bar height (max 120px, with minimum 4px for visibility)
  const getBarHeight = (count, maxCount) => {
    if (count === 0) return 4;
    const height = (count / maxCount) * 100;
    return Math.max(4, Math.min(100, height));
  };

  // Format date for display
  const formatDate = (dateString, type = 'day') => {
    const date = new Date(dateString);
    if (type === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.getDate().toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--cream)] to-[var(--mustard)]/10">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[var(--mustard)] border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--cream)] via-white to-[var(--mustard)]/5">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
 Track your activity insights and patterns
            </p>
          </div>

          <button
            onClick={recalc}
            disabled={reloading}
            className="relative px-6 py-2.5 rounded-xl bg-[var(--mustard)] text-white font-bold 
                     transition-all duration-200 hover:scale-105 hover:shadow-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {reloading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Updating...
              </span>
            ) : (
              '⟳ Recalculate'
            )}
          </button>
        </div>

        {/* SUMMARY CARDS - Removed Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Total Actions Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--mustard)]/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-[var(--mustard)]/20">
                  <svg className="w-6 h-6 text-[var(--mustard)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400">Lifetime</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Actions</p>
              <h2 className="text-4xl font-black text-gray-800">{data?.totalActions || 0}</h2>
              <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--mustard)] rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (data?.totalActions || 0) / 10)}%` }}></div>
              </div>
            </div>
          </div>

          {/* Most Active Type Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full translate-y-16 -translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-gray-400">Trending</span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Most Active Type</p>
              <h2 className="text-2xl font-black text-gray-800 capitalize">
                {data?.actionTypes?.[0]?.action_type || "N/A"}
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                {data?.actionTypes?.[0]?.count || 0} total actions
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BREAKDOWN */}
        <div className="mb-8 rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--mustard)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Action Breakdown
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {data?.actionTypes?.map((a, i) => {
                const total = data?.totalActions || 1;
                const percentage = ((a.count / total) * 100).toFixed(1);
                return (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-600 capitalize flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--mustard)] group-hover:scale-125 transition-transform"></span>
                        {a.action_type}
                      </span>
                      <div className="flex gap-3">
                        <span className="text-sm font-bold text-gray-800">{a.count}</span>
                        <span className="text-xs text-gray-400">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--mustard)] to-[var(--mustard)]/60 rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {(!data?.actionTypes || data.actionTypes.length === 0) && (
                <p className="text-center text-gray-400 py-4">No actions recorded yet</p>
              )}
            </div>
          </div>
        </div>

        {/* WEEKLY ACTIVITY */}
        <div className="mb-8 rounded-2xl bg-white shadow-lg overflow-hidden">
            <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-[var(--mustard)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Weekly Activity (Last 7 Days)
                </h2>
            </div>
            <div className="p-6">
                {data?.weeklyActivity && data.weeklyActivity.length > 0 ? (
                <>
                    <div className="flex items-end justify-around gap-2 h-48 mb-4">
                    {data.weeklyActivity.map((d, i) => {
                        const maxCount = getMaxCount(data.weeklyActivity);
                        const barHeight = getBarHeight(d.count, maxCount);
                        return (
                        <div key={i} className="flex flex-col items-center flex-1 group">
                            <div className="relative w-full flex justify-center">
                            <div
                                className="w-12 bg-gradient-to-t from-[var(--mustard)] to-[var(--mustard)]/60 rounded-t-lg transition-all duration-300 group-hover:opacity-80"
                                style={{ height: `${barHeight}px` }}
                            >
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {d.count} actions
                                </div>
                            </div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-medium">
                            {formatDate(d.date, 'week')}
                            </span>
                        </div>
                        );
                    })}
                    </div>
                    <div className="text-center text-xs text-gray-400 mt-4">
                    Max: {getMaxCount(data.weeklyActivity)} actions in a day
                    </div>
                </>
                ) : (
                <p className="text-center text-gray-400 py-8">No weekly activity data available</p>
                )}
            </div>
        </div>

        {/* MONTHLY ACTIVITY */}
        <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--mustard)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Monthly Activity (Last 30 Days)
            </h2>
          </div>
          <div className="p-6">
            {data?.monthlyActivity && data.monthlyActivity.length > 0 ? (
              <>
                <div className="flex items-end justify-around gap-1 h-48 mb-4">
                  {data.monthlyActivity.map((d, i) => {
                    const maxCount = getMaxCount(data.monthlyActivity);
                    const barHeight = getBarHeight(d.count, maxCount);
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-full flex justify-center">
                          <div
                            className="w-full max-w-[8px] bg-gradient-to-t from-purple-500 to-purple-300 rounded-t transition-all duration-300 group-hover:opacity-80"
                            style={{ height: `${barHeight}px` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {d.count} actions
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-2">
                          {formatDate(d.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-center text-xs text-gray-400 mt-4">
                  {data.monthlyActivity.length} active days in the last 30 days
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400 py-8">No monthly activity data available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}