"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { type BpReadingDTO } from "@/lib/bp";
import BpForm from "./BpForm";
import BpSummary from "./BpSummary";

export default function BpEntry() {
  const [readings, setReadings] = useState<BpReadingDTO[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/pressao", { cache: "no-store" });
        const j = await r.json();
        setReadings(j.readings || []);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const card =
    "rounded-2xl border border-[#4c4c57] bg-[#363640] shadow-[0_2px_6px_rgba(0,0,0,0.28)] p-3";

  return (
    <div className="space-y-4">
      <div className={card}>
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-300">
          Nova medição
        </div>
        <BpForm onSaved={setReadings} />
      </div>

      {loaded && <BpSummary readings={readings} />}

      <div className="text-center text-[13px] text-slate-400">
        Gráfico e lista completa em{" "}
        <Link href="/history?v=pressao" className="font-semibold text-blue-400">
          Histórico → Pressão
        </Link>
        .
      </div>
    </div>
  );
}
