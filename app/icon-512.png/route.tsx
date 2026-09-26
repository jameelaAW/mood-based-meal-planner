import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const size = 512;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#211e26",
        }}
      >
        <div
          style={{
            width: size * 0.5,
            height: size * 0.5,
            borderRadius: "50%",
            background: "#d4a843",
          }}
        />
      </div>
    ),
    { width: size, height: size },
  );
}
