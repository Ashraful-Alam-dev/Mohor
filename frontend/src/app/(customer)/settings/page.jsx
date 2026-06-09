"use client";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes categoryGlow {
          0%   { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
          14%  { text-shadow: 0 0 12px oklch(0.45 0.12 60 / 0.9), 0 0 30px oklch(0.35 0.1 60 / 0.5); }
          28%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
          42%  { text-shadow: 0 0 10px oklch(0.45 0.12 60 / 0.7), 0 0 22px oklch(0.35 0.1 60 / 0.35); }
          70%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.3), 0 0 15px oklch(0.35 0.1 60 / 0.15); }
          100% { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
        }
        @keyframes heartbeat {
          0%   { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
          14%  { box-shadow: 0 0 55px 20px oklch(0.78 0.15 80 / 0.65); }
          28%  { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
          42%  { box-shadow: 0 0 48px 16px oklch(0.78 0.15 80 / 0.55); }
          70%  { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.35); }
          100% { box-shadow: 0 0 35px 12px oklch(0.78 0.15 80 / 0.4); }
        }
      `}</style>

      <div
        style={{
          maxWidth: "32rem",
          width: "100%",
          background: "var(--cream)",
          border: "1px solid var(--border)",
          borderRadius: "1.5rem",
          padding: "3rem 2.5rem",
          textAlign: "center",
          boxShadow: "0 8px 40px oklch(0.18 0.02 80 / 0.12)",
          animation:
            "fadeInUp 0.4s ease-out, heartbeat 2.4s ease-in-out infinite",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
        }}
      >
       
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "99px",
            background: "var(--butter)",
            border: "2px solid var(--mustard)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 20px oklch(0.78 0.15 80 / 0.3)",
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="oklch(0.45 0.12 60)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ animation: "spinSlow 6s linear infinite" }}
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>

        {/* Label */}
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "oklch(0.45 0.12 60)",
            fontFamily: "var(--font-sans)",
            animation: "categoryGlow 2.4s ease-in-out infinite",
          }}
        >
          Coming Soon
        </p>
        <h1
          className="font-display"
          style={{
            fontSize: "2.25rem",
            fontWeight: 900,
            color: "var(--ink)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Settings
        </h1>

        <p
          style={{
            fontSize: "0.9rem",
            color: "oklch(0.5 0.04 80)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.8,
            maxWidth: "22rem",
          }}
        >
          Crafting a more personal experience. We are currently shaping advanced
          account settings and intuitive privacy controls to give you complete
          harmony over your journey. Returning shortly.
        </p>

        <div
          style={{
            width: "3rem",
            height: "2px",
            background: "var(--mustard)",
            borderRadius: "99px",
            opacity: 0.6,
          }}
        />

        {/* Note */}
        <p
          style={{
            fontSize: "0.78rem",
            color: "oklch(0.6 0.04 80)",
            fontFamily: "var(--font-sans)",
            fontStyle: "italic",
          }}
        >
          More to be revealed soon.
        </p>
      </div>
    </div>
  );
}
