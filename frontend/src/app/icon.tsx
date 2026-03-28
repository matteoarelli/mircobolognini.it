import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1A1A1A",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#C9A96E",
            fontFamily: "Georgia, serif",
          }}
        >
          MB
        </span>
      </div>
    ),
    { ...size }
  );
}
