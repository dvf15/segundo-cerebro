import ProfileForm from "@/components/ProfileForm";
import BottomNav from "@/components/BottomNav";

export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-2xl p-4 pb-32">
      <header className="mb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Perfil &amp; Exames</h1>
        <p className="text-[13px] text-slate-400">Dados, metas, suplementos e referencial científico</p>
      </header>
      <ProfileForm />
      <BottomNav />
    </main>
  );
}
