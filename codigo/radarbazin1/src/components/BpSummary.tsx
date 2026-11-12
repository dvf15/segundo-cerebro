"use client";

import { useMemo } from "react";
import {
  classifyBp,
  isNightReading,
  BP_REF_SYS,
  BP_REF_DIA,
  type BpReadingDTO,
} from "@/lib/bp";

function daysBefore(dateKey: string, n: number) {
  const d = new Date(dateKey + "T12:00:00");
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-CA");
}

const card = "rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3";

export default function BpSummary({ readings }: { readings: BpReadingDTO[] }) {
  const last = readings[readings.length - 1];
  const avg = (list: BpReadingDTO[], k: "sys" | "dia") =>
    list.length ? Math.round(list.reduce((a, r) => a + r[k], 0) / list.length) : 0;

  const last7 = useMemo(() => {
    if (!readings.length) return [];
    const latest = readings[readings.length - 1].date;
    const cutoff = daysBefore(latest, 6);
    return readings.filter((r) => r.date >= cutoff);
  }, [readings]);

  const avg7Sys = avg(last7, "sys");
  const avg7Dia = avg(last7, "dia");
  const avgAllSys = avg(readings, "sys");
  const avgAllDia = avg(readings, "dia");
  const situacao = last7.length ? classifyBp(avg7Sys, avg7Dia) : null;
  const highAvg = last7.length > 0 && (avg7Sys >= BP_REF_SYS || avg7Dia >= BP_REF_DIA);
  const allNight = readings.length > 0 && readings.every((r) => isNightReading(r.time));
  const veryHigh = last ? classifyBp(last.sys, last.dia).level === "muito_alta" : false;

  // Cobertura manhã × noite (MRPA pede também a média matinal).
  const morningCount = readings.filter((r) => parseInt(r.time.slice(0, 2), 10) < 12).length;
  const nightCount = readings.filter((r) => isNightReading(r.time)).length;
  const lowMorning = readings.length >= 3 && morningCount === 0;

  if (!readings.length) return null;

  return (
    <>
      {/* Alertas */}
      {veryHigh && (
        <div className="animate-in rounded-xl border border-red-500/50 bg-red-500/15 px-3 py-2 text-[15px] text-red-200">
          🚨 Última medição muito alta ({last.sys}/{last.dia}). Se houver sintomas, procure
          atendimento de emergência.
        </div>
      )}
      {highAvg && (
        <div className="animate-in rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[15px] text-amber-200">
          ⚠️ Média de 7 dias em {avg7Sys}/{avg7Dia} mmHg (≥ {BP_REF_SYS}/{BP_REF_DIA}) — considere
          avaliação médica.
        </div>
      )}
      {allNight && (
        <div className="animate-in rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-[15px] text-blue-200">
          ℹ️ Todas as medições foram à noite. O MRPA recomenda 2 de manhã e 2 à noite.
        </div>
      )}
      {!allNight && lowMorning && (
        <div className="animate-in rounded-xl border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-[15px] text-blue-200">
          ℹ️ Cobertura — manhã {morningCount} · noite {nightCount}. A média matinal (antes do café e
          da medicação) é a que a MRPA pede.
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 gap-3">
        <div className={card}>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Última medição</div>
          <div className="mt-1 text-xl font-extrabold text-white">
            {last.sys}/{last.dia}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-400">
            {last.date.slice(5)} · {last.time}
          </div>
        </div>
        <div className={card}>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Média 7 dias</div>
          <div className="mt-1 text-xl font-extrabold text-white">
            {last7.length ? `${avg7Sys}/${avg7Dia}` : "—"}
          </div>
          {situacao && (
            <div className="mt-1 text-[12px] font-semibold" style={{ color: situacao.color }}>
              {situacao.label} (ref. {BP_REF_SYS}/{BP_REF_DIA})
            </div>
          )}
        </div>
        <div className={card}>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Média geral</div>
          <div className="mt-1 text-xl font-extrabold text-white">
            {readings.length ? `${avgAllSys}/${avgAllDia}` : "—"}
          </div>
          <div className="mt-0.5 text-[12px] text-slate-400">{readings.length} medições</div>
        </div>
        <div className={card}>
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Situação (7d)</div>
          {situacao ? (
            <div className="mt-1 text-lg font-extrabold" style={{ color: situacao.color }}>
              {situacao.label}
            </div>
          ) : (
            <div className="mt-1 text-[13px] text-slate-400">—</div>
          )}
          <div className="mt-0.5 text-[12px] text-slate-400">
            vs {BP_REF_SYS}/{BP_REF_DIA} residencial
          </div>
        </div>
      </div>

      {/* Referências clínicas */}
      <div className={card}>
        <div className="mb-2 text-xs font-bold uppercase text-slate-300">Referências clínicas</div>
        <div className="space-y-1.5 text-[12.5px] text-slate-300">
          <p>
            <b className="text-slate-100">Consultório (DBH/SBC 2025):</b> Normal &lt; 120/80 ·
            Pré‑hipertensão 120–139/80–89 · HAS est. 1: 140–159/90–99 · est. 2: 160–179/100–109 ·
            est. 3: ≥ 180/110.
          </p>
          <p>
            <b className="text-slate-100">Residencial (MRPA):</b> média ≥ 130/80 = anormal (5–7 dias,
            descartando o 1º dia).
          </p>
          <p className="text-slate-400">Registro pessoal — não substitui avaliação médica.</p>
        </div>
      </div>
    </>
  );
}
