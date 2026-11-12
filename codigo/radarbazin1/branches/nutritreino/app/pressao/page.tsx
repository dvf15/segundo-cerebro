import BpEntry from "@/components/BpEntry";
import BottomNav from "@/components/BottomNav";

export default function PressaoPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-32">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Pressão arterial</h1>
        <p className="text-[13px] text-slate-400">Registro rápido · referência residencial 130/80</p>
      </header>
      <BpEntry />
      <BottomNav />
    </main>
  );
}
