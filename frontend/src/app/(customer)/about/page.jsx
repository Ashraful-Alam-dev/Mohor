"use client";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{ maxWidth: "56rem", margin: "0 auto", padding: "3rem 1.5rem" }}
    >
      <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes categoryGlow {
        0%   { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
        14%  { text-shadow: 0 0 12px oklch(0.45 0.12 60 / 0.9), 0 0 30px oklch(0.35 0.1 60 / 0.5); }
        28%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
        42%  { text-shadow: 0 0 10px oklch(0.45 0.12 60 / 0.7), 0 0 22px oklch(0.35 0.1 60 / 0.35); }
        70%  { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.3), 0 0 15px oklch(0.35 0.1 60 / 0.15); }
        100% { text-shadow: 0 0 6px oklch(0.45 0.12 60 / 0.4), 0 0 15px oklch(0.35 0.1 60 / 0.2); }
      }
      .about-card {
        background: var(--cream);
        border: 1px solid var(--border);
        border-radius: 1.25rem;
        padding: 1.75rem;
        box-shadow: 0 4px 20px oklch(0.18 0.02 80 / 0.1);
        transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s;
        animation: fadeInUp 0.4s ease-out;
      }
      .about-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 32px oklch(0.18 0.02 80 / 0.18);
      }
      .dev-icon-ring {
        width: 56px;
        height: 56px;
        border-radius: 99px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--butter);
        border: 2px solid var(--mustard);
        box-shadow: 0 0 12px oklch(0.78 0.15 80 / 0.3);
        flex-shrink: 0;
      }
    `}</style>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* HEADER */}
        <div
          style={{ textAlign: "center", animation: "fadeInUp 0.3s ease-out" }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "oklch(0.45 0.12 60)",
              fontFamily: "var(--font-sans)",
              marginBottom: "0.6rem",
              animation: "categoryGlow 2.4s ease-in-out infinite",
            }}
          >
            Our Story
          </p>
          <h1
            className="font-display"
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "0.75rem",
            }}
          >
            Built with care,
            <br />
            <span style={{ color: "var(--mustard)" }}>worn with pride.</span>
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "oklch(0.5 0.04 80)",
              fontFamily: "var(--font-sans)",
              maxWidth: "32rem",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Mohor is a curated women's fashion house where heirloom craft meets
            the rhythm of today.
          </p>
        </div>

        {/* DEVELOPERS */}
        <div>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "oklch(0.45 0.12 60)",
              fontFamily: "var(--font-sans)",
              marginBottom: "1rem",
              animation: "categoryGlow 2.4s ease-in-out infinite",
            }}
          >
            The Team
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {/* Developer 1 */}
            <div className="about-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div className="dev-icon-ring">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.45 0.12 60)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Ashraful Alam
                  </h2>
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "oklch(0.4 0.03 80)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.75,
                }}
              >
                Bridging the gap between refined front-end aesthetics and robust
                back-end engineering. I build clean, high performance web
                applications where every interaction feels intentional.
              </p>
            </div>

            {/* Developer 2 */}
            <div className="about-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div className="dev-icon-ring">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.45 0.12 60)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                  </svg>
                </div>
                <div>
                  <h2
                    style={{
                      fontWeight: 900,
                      fontSize: "1.05rem",
                      color: "var(--ink)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Hasin Ishrak
                  </h2>
                </div>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "oklch(0.4 0.03 80)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.75,
                }}
              >
                Merging a designer's eye with an engineer's precision. Dedicated
                to crafting fluid digital experiences, clean codebases, and
                frictionless user journeys.
              </p>
            </div>
          </div>
        </div>

        {/* MISSION STRIP */}
        <div
          style={{
            background: "var(--ink)",
            borderRadius: "1.25rem",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 8px 32px oklch(0.18 0.02 80 / 0.2)",
            transition:
              "transform 0.3s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.3s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 16px 48px oklch(0.18 0.02 80 / 0.35), 0 0 30px 6px oklch(0.78 0.15 80 / 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px oklch(0.18 0.02 80 / 0.2)";
          }}
        >
          <p
            className="font-display"
            style={{
              fontSize: "1.35rem",
              fontWeight: 900,
              color: "var(--butter)",
              lineHeight: 1.5,
            }}
          >
            "No clutter. No noise.{" "}
            <span style={{ color: "var(--mustard)" }}>
              Just clothes that mean something.
            </span>
            "
          </p>
        </div>
      </div>
    </div>
  );
}
