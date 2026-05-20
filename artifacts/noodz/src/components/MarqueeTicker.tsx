interface MarqueeTickerProps {
  reverse?: boolean;
  className?: string;
}

const items = [
  "NOODZ BY ALFARUQ",
  "한국 라면",
  "WONOSARI · JOGJA",
  "SLURP IT HOT",
  "국물이 진짜야",
  "RAMEN SEJATI",
  "ORDER VIA WA",
  "열정의 맛",
];

export default function MarqueeTicker({ reverse = false, className = "" }: MarqueeTickerProps) {
  const track = [...items, ...items, ...items]; // triple for seamless loop

  return (
    <div
      className={`overflow-hidden border-y select-none ${className}`}
      style={{
        borderColor: "hsl(var(--primary) / 0.25)",
        background: "hsl(var(--background))",
        paddingBlock: "14px",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          display: "flex",
          gap: "0",
          animation: `marquee${reverse ? "Rev" : "Fwd"} 28s linear infinite`,
          willChange: "transform",
          width: "max-content",
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0",
              fontFamily: "var(--app-font-display), sans-serif",
              fontSize: "clamp(11px, 1.1vw, 14px)",
              letterSpacing: "0.35em",
              color: i % 2 === 0
                ? "hsl(var(--foreground) / 0.55)"
                : "hsl(var(--primary) / 0.75)",
              whiteSpace: "nowrap",
              padding: "0 2.5rem",
            }}
          >
            {item}
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "hsl(var(--primary) / 0.4)",
                marginLeft: "2.5rem",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
