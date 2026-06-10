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
    return Math.max(...activities.map((d) => d.count), 1);
  };

  // Calculate bar height (max 120px, with minimum 4px for visibility)
  const getBarHeight = (count, maxCount) => {
    if (count === 0) return 4;
    const height = (count / maxCount) * 100;
    return Math.max(4, Math.min(100, height));
  };

  // Format date for display
  const formatDate = (dateString, type = "day") => {
    const date = new Date(dateString);
    if (type === "week") {
      return date.toLocaleDateString("en-US", { weekday: "short" });
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
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          "radial-gradient(oklch(0.18 0.02 80 / 0.08) 1px, transparent 1px)",
        backgroundSize: "8px 4px",
      }}
    >
      <style>{`
      @keyframes btnGlow {
        0%   { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
        14%  { box-shadow: 0 0 16px 5px oklch(0.45 0.1 60 / 0.6); }
        28%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
        42%  { box-shadow: 0 0 12px 3px oklch(0.45 0.1 60 / 0.5); }
        70%  { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.25); }
        100% { box-shadow: 0 0 6px 1px oklch(0.45 0.1 60 / 0.3); }
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .analytics-card {
        background: var(--cream);
        border: 1px solid var(--border);
        border-radius: 1.25rem;
        box-shadow: 0 4px 20px oklch(0.18 0.02 80 / 0.08);
        transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s;
        animation: fadeInUp 0.4s ease-out both;
      }
      .analytics-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px oklch(0.18 0.02 80 / 0.15);
      }
      .recalc-btn {
        padding: 0.65rem 1.5rem;
        border-radius: 0.75rem;
        font-weight: 700;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        border: none;
        cursor: pointer;
        background: oklch(0.35 0.08 60);
        color: var(--butter);
        transition: background 0.2s, transform 0.15s;
      }
      .recalc-btn:hover:not(:disabled) {
        background: oklch(0.28 0.08 60);
        animation: btnGlow 2.4s ease-in-out infinite;
        transform: translateY(-2px);
      }
      .recalc-btn:disabled {
        background: oklch(0.75 0.02 80);
        color: oklch(0.55 0.02 80);
        cursor: not-allowed;
      }
      .bar-weekly:hover > .bar-fill-weekly { opacity: 0.75; }
      .bar-monthly:hover > .bar-fill-monthly { opacity: 0.75; }
    `}</style>

      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "2.5rem 1.25rem",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Analytics Dashboard
            </h1>
            <p
              style={{
                fontSize: "0.8rem",
                color: "oklch(0.5 0.04 80)",
                marginTop: "0.35rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              Track your activity insights and patterns.
            </p>
          </div>

          <button onClick={recalc} disabled={reloading} className="recalc-btn">
            {reloading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <svg
                  style={{
                    width: "14px",
                    height: "14px",
                    animation: "spin 1s linear infinite",
                  }}
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    opacity="0.25"
                  />
                  <path
                    fill="currentColor"
                    opacity="0.75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Updating...
              </span>
            ) : (
              "⟳ Recalculate"
            )}
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
            marginBottom: "1.75rem",
          }}
        >
          {/* Total Actions */}
          <div
            className="analytics-card"
            style={{
              padding: "1.5rem",
              transition:
                "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px oklch(0.18 0.02 80 / 0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 20px oklch(0.18 0.02 80 / 0.08)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.6rem",
                  borderRadius: "0.75rem",
                  background: "oklch(0.35 0.08 60 / 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "oklch(0.35 0.08 60)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "oklch(0.6 0.04 80)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Lifetime
              </span>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 80)",
                fontFamily: "var(--font-sans)",
                marginBottom: "0.3rem",
              }}
            >
              Total Actions
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1,
              }}
            >
              {data?.totalActions || 0}
            </h2>
            <div
              style={{
                marginTop: "1rem",
                height: "5px",
                background: "var(--butter)",
                borderRadius: "99px",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  background: "oklch(0.35 0.08 60)",
                  borderRadius: "99px",
                  width: `${Math.min(100, (data?.totalActions || 0) / 10)}%`,
                  transition: "width 0.6s cubic-bezier(0.2,0.8,0.2,1)",
                }}
              />
            </div>
          </div>

          {/* Most Active Type */}
          <div className="analytics-card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  padding: "0.6rem",
                  borderRadius: "0.75rem",
                  background: "oklch(0.78 0.15 80 / 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{
                    width: "20px",
                    height: "20px",
                    color: "var(--mustard)",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "oklch(0.6 0.04 80)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Trending
              </span>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 80)",
                fontFamily: "var(--font-sans)",
                marginBottom: "0.3rem",
              }}
            >
              Most Active Type
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "1.75rem",
                fontWeight: 900,
                color: "var(--ink)",
                lineHeight: 1.1,
                textTransform: "capitalize",
              }}
            >
              {data?.actionTypes?.[0]?.action_type || "N/A"}
            </h2>
            <p
              style={{
                fontSize: "0.75rem",
                color: "oklch(0.5 0.04 80)",
                marginTop: "0.5rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              {data?.actionTypes?.[0]?.count || 0} total actions
            </p>
          </div>
        </div>

        {/* ACTION BREAKDOWN */}
        <div
          className="analytics-card"
          style={{ marginBottom: "1.75rem", overflow: "hidden" }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <svg
              style={{
                width: "18px",
                height: "18px",
                color: "var(--mustard)",
                flexShrink: 0,
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h2
              style={{
                fontSize: "0.875rem",
                fontWeight: 900,
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Action Breakdown
            </h2>
          </div>
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {data?.actionTypes?.map((a, i) => {
              const total = data?.totalActions || 1;
              const percentage = ((a.count / total) * 100).toFixed(1);
              return (
                <div key={i}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.825rem",
                        fontWeight: 700,
                        color: "var(--ink)",
                        fontFamily: "var(--font-sans)",
                        textTransform: "capitalize",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          width: "7px",
                          height: "7px",
                          borderRadius: "50%",
                          background:
                            i % 2 === 0
                              ? "oklch(0.35 0.08 60)"
                              : "var(--mustard)",
                          flexShrink: 0,
                        }}
                      />
                      {a.action_type}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.825rem",
                          fontWeight: 900,
                          color: "var(--ink)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {a.count}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "oklch(0.55 0.04 80)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "var(--butter)",
                      borderRadius: "99px",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: "99px",
                        width: `${percentage}%`,
                        background:
                          i % 2 === 0
                            ? "oklch(0.35 0.08 60)"
                            : "var(--mustard)",
                        transition: "width 0.6s cubic-bezier(0.2,0.8,0.2,1)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
            {(!data?.actionTypes || data.actionTypes.length === 0) && (
              <p
                style={{
                  textAlign: "center",
                  color: "oklch(0.55 0.04 80)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  padding: "1rem 0",
                }}
              >
                No actions recorded yet.
              </p>
            )}
          </div>
        </div>

        {/* WEEKLY ACTIVITY */}
        <div
          className="analytics-card"
          style={{ marginBottom: "1.75rem", overflow: "hidden" }}
        >
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <svg
              style={{
                width: "18px",
                height: "18px",
                color: "var(--mustard)",
                flexShrink: 0,
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2
              style={{
                fontSize: "0.875rem",
                fontWeight: 900,
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Weekly Activity — Last 7 Days
            </h2>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {data?.weeklyActivity && data.weeklyActivity.length > 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                    gap: "0.5rem",
                    height: "140px",
                    marginBottom: "0.75rem",
                  }}
                >
                  {data.weeklyActivity.map((d, i) => {
                    const maxCount = getMaxCount(data.weeklyActivity);
                    const barHeight = getBarHeight(d.count, maxCount);
                    return (
                      <div
                        key={i}
                        className="bar-weekly"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                          position: "relative",
                        }}
                        title={`${d.count} actions`}
                      >
                        <div
                          className="bar-fill-weekly"
                          style={{
                            width: "100%",
                            maxWidth: "40px",
                            height: `${barHeight}px`,
                            background: "oklch(0.35 0.08 60)",
                            borderRadius: "0.4rem 0.4rem 0 0",
                            transition:
                              "opacity 0.2s, height 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                            boxShadow: "0 4px 12px oklch(0.35 0.08 60 / 0.25)",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "oklch(0.55 0.04 80)",
                            fontFamily: "var(--font-sans)",
                            marginTop: "0.4rem",
                          }}
                        >
                          {formatDate(d.date, "week")}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.7rem",
                    color: "oklch(0.6 0.04 80)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Peak: {getMaxCount(data.weeklyActivity)} actions in a day
                </p>
              </>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "oklch(0.55 0.04 80)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  padding: "2rem 0",
                }}
              >
                No weekly activity data available.
              </p>
            )}
          </div>
        </div>

        {/* MONTHLY ACTIVITY */}
        <div className="analytics-card" style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <svg
              style={{
                width: "18px",
                height: "18px",
                color: "var(--mustard)",
                flexShrink: 0,
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2
              style={{
                fontSize: "0.875rem",
                fontWeight: 900,
                color: "var(--ink)",
                fontFamily: "var(--font-sans)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Monthly Activity — Last 30 Days
            </h2>
          </div>
          <div style={{ padding: "1.5rem" }}>
            {data?.monthlyActivity && data.monthlyActivity.length > 0 ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                    gap: "2px",
                    height: "140px",
                    marginBottom: "0.75rem",
                  }}
                >
                  {data.monthlyActivity.map((d, i) => {
                    const maxCount = getMaxCount(data.monthlyActivity);
                    const barHeight = getBarHeight(d.count, maxCount);
                    return (
                      <div
                        key={i}
                        className="bar-monthly"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                          position: "relative",
                        }}
                        title={`${d.count} actions`}
                      >
                        <div
                          className="bar-fill-monthly"
                          style={{
                            width: "100%",
                            maxWidth: "10px",
                            height: `${barHeight}px`,
                            background: "var(--mustard)",
                            borderRadius: "0.25rem 0.25rem 0 0",
                            transition:
                              "opacity 0.2s, height 0.4s cubic-bezier(0.2,0.8,0.2,1)",
                            boxShadow: "0 4px 10px oklch(0.78 0.15 80 / 0.3)",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.55rem",
                            color: "oklch(0.6 0.04 80)",
                            fontFamily: "var(--font-sans)",
                            marginTop: "0.3rem",
                          }}
                        >
                          {formatDate(d.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.7rem",
                    color: "oklch(0.6 0.04 80)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {data.monthlyActivity.length} active days in the last 30 days
                </p>
              </>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "oklch(0.55 0.04 80)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  padding: "2rem 0",
                }}
              >
                No monthly activity data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
