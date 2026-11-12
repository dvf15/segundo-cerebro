import HistoryCharts from "@/components/HistoryCharts";
import BottomNav from "@/components/BottomNav";

export default function HistoryPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-32">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Histórico</h1>
        <p className="text-[13px] text-slate-400">Macros, micros, pressão e peso ao longo do tempo</p>
      </header>
      <HistoryCharts />
      <BottomNav />
    </main>
  );
}
