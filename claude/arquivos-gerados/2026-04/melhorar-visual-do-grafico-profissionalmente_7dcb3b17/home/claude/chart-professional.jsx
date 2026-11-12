import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProfessionalChart() {
  const data = [
    { year: '2019', NOI: 67.641, NOIvsAno1: null, NOIVenda: null },
    { year: '2022', NOI: 85.182, NOIvsAno1: 25.9, NOIVenda: 9.0 },
    { year: '2023', NOI: 92.993, NOIvsAno1: 9.2, NOIVenda: 8.7 },
    { year: '2024', NOI: 98.172, NOIvsAno1: 5.6, NOIVenda: 8.7 },
    { year: '2025', NOI: 105.410, NOIvsAno1: 7.4, NOIVenda: 8.9 },
    { year: '2026', NOI: 107.577, NOIvsAno1: 2.1, NOIVenda: 8.6 },
    { year: 'Meta/Orç', NOI: 113.690, NOIvsAno1: 7.9, NOIVenda: 9.1 }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">{payload[0].payload.year}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Análise de NOI e Variação Anual
          </h1>
          <p className="text-slate-600 mt-2 font-light">
            Evolução de 2019 a 2026 com projeção de meta/orçamento
          </p>
        </div>

        {/* Chart Container */}
        <div className="bg-gradient-to-b from-white to-slate-50 rounded-lg p-6 border border-slate-200">
          <ResponsiveContainer width="100%" height={450}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <defs>
                <linearGradient id="gradientNOI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a4c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2d5a6f" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="0" 
                stroke="#e2e8f0" 
                vertical={false}
                opacity={0.5}
              />
              
              <XAxis 
                dataKey="year" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                angle={0}
              />
              
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                label={{ value: 'NOI', angle: -90, position: 'insideLeft', offset: 10, fill: '#1e293b' }}
              />
              
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                label={{ value: 'Variação (%)', angle: 90, position: 'insideRight', offset: 10, fill: '#1e293b' }}
              />

              <Tooltip content={<CustomTooltip />} />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: '#1e293b', fontSize: '13px', fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />

              <Bar 
                yAxisId="left"
                dataKey="NOI" 
                fill="url(#gradientNOI)"
                radius={[8, 8, 0, 0]}
                name="NOI"
              />
              
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="NOIvsAno1" 
                stroke="#ea580c" 
                strokeWidth={3}
                dot={{ fill: '#ea580c', r: 5 }}
                activeDot={{ r: 7 }}
                name="NOI vs Ano-1"
              />
              
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="NOIVenda" 
                stroke="#4a9b8e" 
                strokeWidth={3}
                dot={{ fill: '#4a9b8e', r: 5 }}
                activeDot={{ r: 7 }}
                name="NOI/Venda (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Crescimento 2019-2026</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              +{((113.690 - 67.641) / 67.641 * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">NOI 2026 (Meta)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">113.69</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">Variação Última (2026)</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">+7.9%</p>
          </div>
        </div>
      </div>
    </div>
  );
}