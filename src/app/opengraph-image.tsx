import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Sola Scriptura — Bible Reading Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c1917",
          fontFamily: "sans-serif",
        }}
      >
        {/* BookOpen SVG icon */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>

        {/* Title */}
        <div
          style={{
            marginTop: 32,
            fontSize: 56,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          Sola Scriptura
        </div>

        {/* Emerald accent line */}
        <div
          style={{
            marginTop: 20,
            width: 80,
            height: 4,
            backgroundColor: "#10b981",
            borderRadius: 2,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#a8a29e",
            fontWeight: 400,
          }}
        >
          Bible Reading Tracker
        </div>

        {/* Scripture quote */}
        <div
          style={{
            marginTop: 40,
            fontSize: 18,
            color: "#78716c",
            fontStyle: "italic",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          — Psalm 119:105
        </div>
      </div>
    ),
    size,
  );
}
