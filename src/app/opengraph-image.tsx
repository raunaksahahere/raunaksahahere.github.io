import { ImageResponse } from "next/og";

export const alt = "Raunak Saha — I build things that probably shouldn't exist yet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f5efe3",
          padding: 72,
          color: "#15130f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#c8f03c", border: "4px solid #15130f", display: "flex" }} />
          <div style={{ fontSize: 34, fontWeight: 700 }}>raunak.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -5, lineHeight: 1 }}>Hey, I&apos;m Raunak.</div>
          <div style={{ fontSize: 46, marginTop: 24, color: "#4b463e" }}>I build things that probably shouldn&apos;t exist yet.</div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["CodeMeet", "Kavach Pay", "Parity", "PlanTwin", "cfgcanary"].map((n, i) => (
            <div
              key={n}
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                padding: "10px 22px",
                borderRadius: 999,
                border: "3px solid #15130f",
                background: ["#2f4bff", "#ff6b2c", "#c8f03c", "#fbf8f2", "#fbf8f2"][i],
                color: i === 0 ? "#fbf8f2" : "#15130f",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
