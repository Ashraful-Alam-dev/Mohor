"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [reloading, setReloading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const res = await api.get("/analytics/admin");

      if (res.data?.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Admin analytics load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin analytics...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[var(--cream)]">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Admin Analytics</h1>
            <p className="text-sm opacity-70">
              System-wide activity overview
            </p>
          </div>

          <button
            onClick={recalc}
            disabled={reloading}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "0.75rem",
              background: "oklch(0.45 0.2 60)",
              color: "white",
              fontWeight: 700,
            }}
          >
            {reloading ? "Updating..." : "Recalculate"}
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm opacity-60">Total Admin Actions</p>
            <h2 className="text-2xl font-bold">
              {data?.totalAdminActions}
            </h2>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm opacity-60">Total Action Types</p>
            <h2 className="text-2xl font-bold">
              {data?.actionBreakdown?.length || 0}
            </h2>
          </div>

        </div>

        {/* ACTION BREAKDOWN */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-bold mb-3">System Action Breakdown</h2>

          <div className="space-y-2">
            {data?.actionBreakdown?.map((a, i) => (
              <div
                key={i}
                className="flex justify-between border-b py-1 text-sm"
              >
                <span>{a.action_type}</span>
                <span className="font-bold">{a.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT ACTIVITY LOGS */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="font-bold mb-3">Product Activity Logs</h2>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {data?.productStats?.slice(0, 10).map((log, i) => (
              <div
                key={i}
                className="text-sm border-b py-1 opacity-80"
              >
                {log.description}
              </div>
            ))}

            {(!data?.productStats ||
              data.productStats.length === 0) && (
              <p className="text-sm opacity-60">
                No product activity found
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}