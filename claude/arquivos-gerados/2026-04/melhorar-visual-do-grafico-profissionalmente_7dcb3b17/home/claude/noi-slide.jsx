import { useState, useEffect } from "react";
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LabelList
} from "recharts";

const data = [
  { year: "2019",     NOI: 67.641,  vsAno: null,  margem: null  },
  { year: "2022",     NOI: 85.182,  vsAno: 25.9,  margem: 9.0   },
  { year: "2023",     NOI: 92.993,  vsAno: 9.2,   margem: 8.7   },
  { year: "2024",     NOI: 98.172,  vsAno: 5.6,   margem: 8.7   },
  { year: "2025",     NOI: 105.410, vsAno: 7.4,   margem: 8.9   },
  { year: "2026",     NOI: 107.577, vsAno: 2.1,   margem: 8.6   },
  { year: "Meta/Orç", NOI: 113.690, vsAno: 7.9,   margem: 9.1   },
];

const BAR_COLOR   = "#1b3d52";
const META_COLOR  = "#2a5f7a";
const LINE_ORANGE = "#e8711a";
const LINE_GREEN  = "#3a9e8a";

/* ── label personalizado acima das barras ── */
const BarTopLabel = ({ x, y, width, value }) => {
  if (value == null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      textAnchor="middle"
      fill="#1b3d52"
      fontSize={12}
      fontWeight={700}
      fontFamily="'DM Sans', sans-serif"
    >
      {value.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
    </text>
  );
};

/* ── label nos pontos das linhas ── */
const DotLabel = ({ cx, cy, value, color, offsetY = -14 }) => {
  if (value == null) return null;
  return (
    <g>
      <rect
        x={cx - 20} y={cy + offsetY - 11}
        width={40} height={18}
        rx={4} fill={color} opacity={0.92}
      />
      <text
        x={cx} y={cy + offsetY + 2}
        textAnchor="middle"
        fill="#fff"
        fontSize={11}
        fontWeight={700}
        fontFamily="'DM Sans', sans-serif"
      >
        {value}%
      </text>
    </g>
  );
};

const CustomDotOrange = (props) => {
  const { cx, cy, value } = props;
  return (
    <g key={`dot-o-${cx}`}>
      <circle cx={cx} cy={cy} r={5} fill={LINE_ORANGE} stroke="#fff" strokeWidth={2} />
      <DotLabel cx={cx} cy={cy} value={value} color={LINE_ORANGE}
        offsetY={value > 15 ? -18 : value < 4 ? 18 : -18} />
    </g>
  );
};

const CustomDotGreen = (props) => {
  const { cx, cy, value } = props;
  return (
    <g key={`dot-g-${cx}`}>
      <circle cx={cx} cy={cy} r={5} fill={LINE_GREEN} stroke="#fff" strokeWidth={2} />
      <DotLabel cx={cx} cy={cy} value={value} color={LINE_GREEN} offsetY={16} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "10px 16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ fontWeight: 700, color: "#1b3d52", marginBottom: 6, fontSize: 13 }}>{label}</p>
      {payload.map((p) => p.value != null && (
        <p key={p.name} style={{ color: p.color, fontSize: 12, margin: "2px 0" }}>
          <strong>{p.name}:</strong> {p.value}
        </p>
      ))}
    </div>
  );
};

export default function NOISlide() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setTimeout(() => setAnimated(true), 100); }, []);

  return (
    <div style={{
      width: "100vw",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f4f8 0%, #e8edf2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* SLIDE 16:9 */}
      <div style={{
        width: "min(96vw, 1280px)",
        aspectRatio: "16/9",
        background: "#ffffff",
        borderRadius: 18,
        boxShadow: "0 20px 80px rgba(27,61,82,0.18)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Accent bar top */}
        <div style={{
          height: 5,
          background: `linear-gradient(90deg, ${BAR_COLOR} 0%, ${LINE_GREEN} 50%, ${LINE_ORANGE} 100%)`,
        }} />

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px 4px",
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: "clamp(16px, 2vw, 26px)",
              fontFamily: "'DM Serif Display', serif",
              color: "#1b3d52",
              letterSpacing: "-0.3px",
            }}>
              NOI — Evolução &amp; Projeção
            </h1>
            <p style={{
              margin: "2px 0 0",
              fontSize: "clamp(10px, 1vw, 13px)",
              color: "#64748b",
              fontWeight: 400,
            }}>
              Análise de 2019 a 2026 · Valores em R$ mil · Variações percentuais anuais
            </p>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {[
              { color: BAR_COLOR,   label: "NOI",            dash: false },
              { color: LINE_ORANGE, label: "NOI vs Ano-1",   dash: true  },
              { color: LINE_GREEN,  label: "NOI / Venda (%)", dash: true  },
            ].map(({ color, label, dash }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {dash
                  ? <svg width={32} height={12}><line x1={0} y1={6} x2={32} y2={6} stroke={color} strokeWidth={2.5} strokeDasharray="5,3" /><circle cx={16} cy={6} r={4} fill={color} /></svg>
                  : <div style={{ width: 16, height: 14, borderRadius: 3, background: color }} />
                }
                <span style={{ fontSize: "clamp(9px, 0.85vw, 12px)", color: "#334155", fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ flex: 1, padding: "0 24px 16px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 36, right: 40, left: 10, bottom: 8 }}
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a5f7a" />
                  <stop offset="100%" stopColor="#1b3d52" />
                </linearGradient>
                <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a8ba8" />
                  <stop offset="100%" stopColor="#2a5f7a" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" vertical={false} />

              <XAxis
                dataKey="year"
                tick={{ fill: "#475569", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
              />

              {/* Left axis — NOI values */}
              <YAxis
                yAxisId="left"
                domain={[0, 130]}
                tickCount={6}
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(0)}
              />

              {/* Right axis — % */}
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[-2, 32]}
                tickCount={7}
                tick={{ fill: "#94a3b8", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Bars */}
              <Bar
                yAxisId="left"
                dataKey="NOI"
                name="NOI"
                radius={[6, 6, 0, 0]}
                maxBarSize={72}
                isAnimationActive={true}
                animationDuration={900}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.year === "Meta/Orç" ? "url(#metaGrad)" : "url(#barGrad)"}
                    opacity={entry.year === "Meta/Orç" ? 0.85 : 1}
                  />
                ))}
                <LabelList content={<BarTopLabel />} />
              </Bar>

              {/* Line NOI vs Ano-1 */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vsAno"
                name="NOI vs Ano-1"
                stroke={LINE_ORANGE}
                strokeWidth={2.5}
                dot={<CustomDotOrange />}
                activeDot={{ r: 7, fill: LINE_ORANGE }}
                connectNulls={false}
                isAnimationActive={true}
                animationDuration={1200}
              />

              {/* Line NOI/Venda */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="margem"
                name="NOI/Venda (%)"
                stroke={LINE_GREEN}
                strokeWidth={2.5}
                dot={<CustomDotGreen />}
                activeDot={{ r: 7, fill: LINE_GREEN }}
                connectNulls={false}
                isAnimationActive={true}
                animationDuration={1400}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer KPIs */}
        <div style={{
          display: "flex",
          gap: 0,
          borderTop: "1px solid #f1f5f9",
          background: "#f8fafc",
        }}>
          {[
            { label: "NOI 2019", value: "67.641", sub: "Base histórica" },
            { label: "NOI 2026", value: "107.577", sub: "Resultado atual" },
            { label: "Meta / Orç", value: "113.690", sub: "Projeção" },
            { label: "Crescimento total", value: "+68,1%", sub: "2019 → Meta" },
            { label: "NOI/Venda Médio", value: "8,8%", sub: "2022-2026" },
          ].map(({ label, value, sub }, i, arr) => (
            <div key={label} style={{
              flex: 1,
              padding: "10px 0",
              textAlign: "center",
              borderRight: i < arr.length - 1 ? "1px solid #e2e8f0" : "none",
            }}>
              <div style={{ fontSize: "clamp(8px, 0.75vw, 10px)", color: "#94a3b8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
              <div style={{ fontSize: "clamp(13px, 1.4vw, 20px)", fontWeight: 700, color: "#1b3d52", marginTop: 2, fontFamily: "'DM Serif Display', serif" }}>{value}</div>
              <div style={{ fontSize: "clamp(8px, 0.7vw, 10px)", color: "#94a3b8" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Corner accent */}
        <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `linear-gradient(135deg, transparent 50%, ${LINE_GREEN}22 100%)`,
          borderRadius: "0 0 18px 0",
        }} />
      </div>
    </div>
  );
}
