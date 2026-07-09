import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mood-Based Meal Planner — tell us how you feel, we'll tell you what to eat.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
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
          background: "radial-gradient(circle at 50% 20%, #35303f 0%, #211e26 65%)",
          color: "#f4efe6",
          fontFamily: "serif",
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#cfc8ba",
            marginBottom: 24,
          }}
        >
          Mood-Based Meal Planner
        </div>
        <div
          style={{
            fontSize: 64,
            fontStyle: "italic",
            textAlign: "center",
            lineHeight: 1.25,
            maxWidth: 900,
          }}
        >
          Tell us how you feel. We&rsquo;ll tell you what to eat.
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 48 }}>
          {["#8aa68c", "#d4a843", "#7b87b0", "#e8907c", "#c98fa0", "#5fa8a0"].map((c) => (
            <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
